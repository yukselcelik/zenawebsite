using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Enums;
using Zenabackend.Models;

namespace Zenabackend.Services;

public class AuthService(ApplicationDbContext context, IConfiguration configuration, ILogger<AuthService> logger)
{
    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto)
    {
        if (await context.Users.AsNoTracking().AnyAsync(u => u.Email == registerDto.Email && !u.isDeleted))
        {
            logger.LogWarning("Registration attempted with existing email: {Email}", registerDto.Email);
            return null;
        }

        var user = new User
        {
            Email = registerDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
            Role = UserRoleEnum.Personel,
            IsApproved = false,
            CreatedAt = DateTime.UtcNow.AddHours(3),
            UpdatedAt = DateTime.UtcNow.AddHours(3)
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        logger.LogInformation("User registered successfully: {Email} - Waiting for approval", registerDto.Email);

        return new AuthResponseDto
        {
            Token = GenerateToken(user),
            Email = user.Email
        };
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
    {
        var user = await context.Users.AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email && !u.isDeleted);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            logger.LogWarning("Login failed for email: {Email}", loginDto.Email);
            return null;
        }

        if (user is { Role: UserRoleEnum.Personel, IsApproved: false })
        {
            logger.LogWarning("Login attempt by unapproved user: {Email}", loginDto.Email);
            return null;
        }

        logger.LogInformation("User logged in successfully: {Email}", loginDto.Email);

        return new AuthResponseDto
        {
            Token = GenerateToken(user),
            Email = user.Email
        };
    }

    private string GenerateToken(User user)
    {
        var key = Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            ]),
            Expires = DateTime.UtcNow.AddMinutes(600),
            Issuer = configuration["Jwt:Issuer"],
            Audience = configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public async Task<ApiResult<MeDto>> GetMeAsync(int userId)
    {
        var user = await context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId && !u.isDeleted);

        if (user == null)
            return ApiResult<MeDto>.NotFound("User not found");

        var photoPath = BuildPublicPhotoUrl(user.PhotoPath) ?? string.Empty;

        var meDto = new MeDto
        {
            UserId = user.Id.ToString(),
            Email = user.Email,
            Name = user.Name,
            Surname = user.Surname,
            PhotoPath = photoPath,
            Role = user.Role.ToString()
        };

        return ApiResult<MeDto>.Ok(meDto);

        string? BuildPublicPhotoUrl(string? stored)
        {
            if (string.IsNullOrWhiteSpace(stored)) return null;
            var trimmed = stored.Trim();
            if (trimmed.StartsWith("http", StringComparison.OrdinalIgnoreCase))
            {
                return trimmed;
            }

            var baseUrlLocal = configuration["FileStorage:BaseUrl"]?.TrimEnd('/') ?? "http://localhost:5133";
            if (trimmed.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
            {
                return $"{baseUrlLocal}{trimmed}";
            }

            if (trimmed.StartsWith("uploads/", StringComparison.OrdinalIgnoreCase))
            {
                return $"{baseUrlLocal}/{trimmed}";
            }

            return $"{baseUrlLocal}/uploads/photos/{trimmed}";
        }
    }

    public async Task<bool> CheckEmailExistsAsync(string email)
    {
        return await context.Users.AsNoTracking().AnyAsync(u => u.Email == email && !u.isDeleted);
    }

    public async Task<bool?> CheckUserApprovalStatusAsync(string email)
    {
        var user = await context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == email && !u.isDeleted);
        if (user == null) return null;
        return user.IsApproved;
    }

    // Yönetici için kullanıcı yönetimi metodları
    public async Task<ApiResult<PagedResultDto<UserResponseDto>>> GetPendingUsersAsync(int pageNumber = 1,
        int pageSize = 10)
    {
        var query = context.Users
            .AsNoTracking()
            .Where(u => u.Role == UserRoleEnum.Personel && !u.IsApproved && !u.isDeleted)
            .OrderByDescending(u => u.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var users = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = users.Select(u => new UserResponseDto
        {
            Id = u.Id,
            Email = u.Email,
            Name = u.Name,
            Surname = u.Surname,
            Phone = u.Phone,
            Role = u.Role.ToString(),
            IsApproved = u.IsApproved,
            ApprovedAt = u.ApprovedAt,
            CreatedAt = u.CreatedAt
        }).ToList();

        var response = new PagedResultDto<UserResponseDto>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };

        return ApiResult<PagedResultDto<UserResponseDto>>.Ok(response);
    }

    public async Task<ApiResult<PagedResultDto<UserResponseDto>>> GetAllPersonnelUsersAsync(int pageNumber = 1,
        int pageSize = 10)
    {
        var query = context.Users
            .AsNoTracking()
            .Where(u => u.Role == UserRoleEnum.Personel && !u.isDeleted)
            .OrderBy(u => u.IsApproved)
            .ThenByDescending(u => u.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var users = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = users.Select(u => new UserResponseDto
        {
            Id = u.Id,
            Email = u.Email,
            Name = u.Name,
            Surname = u.Surname,
            Phone = u.Phone,
            Role = u.Role.ToString(),
            IsApproved = u.IsApproved,
            ApprovedAt = u.ApprovedAt,
            CreatedAt = u.CreatedAt
        }).ToList();

        var response = new PagedResultDto<UserResponseDto>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };

        return ApiResult<PagedResultDto<UserResponseDto>>.Ok(response);
    }

    public async Task<ApiResult<bool>> ApproveUserAsync(int userId)
    {
        var user = await context.Users.FindAsync(userId);

        if (user == null || user.isDeleted)
        {
            return ApiResult<bool>.NotFound("Kullanıcı bulunamadı");
        }

        if (user.Role != UserRoleEnum.Personel)
        {
            return ApiResult<bool>.BadRequest("Sadece personel kullanıcılar onaylanabilir");
        }

        if (user.IsApproved)
        {
            return ApiResult<bool>.BadRequest("Kullanıcı zaten onaylanmış");
        }

        user.IsApproved = true;
        user.ApprovedAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        logger.LogInformation("User approved: {UserId} - {Email}", userId, user.Email);

        return ApiResult<bool>.Ok(true);
    }

    public async Task<ApiResult<bool>> RejectUserAsync(int userId)
    {
        var user = await context.Users.FindAsync(userId);

        if (user == null || user.isDeleted)
        {
            return ApiResult<bool>.NotFound("Kullanıcı bulunamadı");
        }

        if (user.Role != UserRoleEnum.Personel)
        {
            return ApiResult<bool>.BadRequest("Sadece personel kullanıcılar reddedilebilir");
        }

        if (user.IsApproved)
        {
            return ApiResult<bool>.BadRequest("Onaylanmış kullanıcılar reddedilemez");
        }

        user.isDeleted = true;
        user.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        logger.LogInformation("User rejected and soft deleted: {UserId} - {Email}", userId, user.Email);

        return ApiResult<bool>.Ok(true);
    }

    public async Task<ApiResult<bool>> UpdateUserApprovalStatusAsync(int userId, bool isApproved)
    {
        var user = await context.Users.FindAsync(userId);

        if (user == null || user.isDeleted)
        {
            return ApiResult<bool>.NotFound("Kullanıcı bulunamadı");
        }

        if (user.Role != UserRoleEnum.Personel)
        {
            return ApiResult<bool>.BadRequest("Sadece personel kullanıcıların onay durumu değiştirilebilir");
        }

        user.IsApproved = isApproved;
        user.ApprovedAt = isApproved ? DateTime.UtcNow : null;
        user.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        logger.LogInformation("User approval status updated: {UserId} - {Email} - IsApproved: {IsApproved}", userId,
            user.Email, isApproved);

        return ApiResult<bool>.Ok(true);
    }

    public async Task<ApiResult<bool>> DeleteUserAsync(int userId)
    {
        var user = await context.Users.FindAsync(userId);

        if (user == null || user.isDeleted)
        {
            return ApiResult<bool>.NotFound("Kullanıcı bulunamadı");
        }

        user.isDeleted = true;
        user.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        logger.LogInformation("User soft deleted: {UserId} - {Email}", userId, user.Email);

        return ApiResult<bool>.Ok(true);
    }
}