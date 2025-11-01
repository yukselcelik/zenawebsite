using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Models;

namespace Zenabackend.Services;

public class AuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;

    public AuthService(ApplicationDbContext context, IConfiguration configuration, ILogger<AuthService> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto)
    {
        if (await _context.Users.AsNoTracking().AnyAsync(u => u.Email == registerDto.Email))
        {
            _logger.LogWarning("Registration attempted with existing email: {Email}", registerDto.Email);
            return null;
        }

        var user = new User
        {
            Email = registerDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
            Role = UserRole.Personel, // Kayıt olan kullanıcılar her zaman Personel yetkisinde
            IsApproved = false, // Yönetici onayı gerekli
            CreatedAt = DateTime.UtcNow.AddHours(3),
            UpdatedAt = DateTime.UtcNow.AddHours(3)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _logger.LogInformation("User registered successfully: {Email} - Waiting for approval", registerDto.Email);

        // Onay bekliyor, token döndürme
        return null;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
    {
        var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            _logger.LogWarning("Login failed for email: {Email}", loginDto.Email);
            return null;
        }

        // Yöneticiler her zaman giriş yapabilir, personel onaylanmış olmalı
        if (user.Role == UserRole.Personel && !user.IsApproved)
        {
            _logger.LogWarning("Login attempt by unapproved user: {Email}", loginDto.Email);
            return null; // Onay bekleniyor mesajı için null döndür
        }

        _logger.LogInformation("User logged in successfully: {Email}", loginDto.Email);

        return new AuthResponseDto
        {
            Token = GenerateToken(user),
            Email = user.Email
        };
    }

    private string GenerateToken(User user)
    {
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            }),
            Expires = DateTime.UtcNow.AddHours(24),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    // get me

    public async Task<ApiResult<MeDto>> GetMeAsync(int userId)
    {
        var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return ApiResult<MeDto>.NotFound("User not found");

        var meDto = new MeDto
        {
            UserId = user.Id.ToString(),
            Email = user.Email,
            Role = user.Role.ToString()
        };

        return ApiResult<MeDto>.Ok(meDto);
    }

    public async Task<bool> CheckEmailExistsAsync(string email)
    {
        return await _context.Users.AsNoTracking().AnyAsync(u => u.Email == email);
    }

    public async Task<bool?> CheckUserApprovalStatusAsync(string email)
    {
        var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == email);
        if (user == null) return null;
        return user.IsApproved;
    }

    // Yönetici için kullanıcı yönetimi metodları
    public async Task<ApiResult<PagedResultDto<UserResponseDto>>> GetPendingUsersAsync(int pageNumber = 1, int pageSize = 10)
    {
        var query = _context.Users
            .AsNoTracking()
            .Where(u => u.Role == UserRole.Personel && !u.IsApproved)
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

    public async Task<ApiResult<bool>> ApproveUserAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
        {
            return ApiResult<bool>.NotFound("Kullanıcı bulunamadı");
        }

        if (user.Role != UserRole.Personel)
        {
            return ApiResult<bool>.BadRequest("Sadece personel kullanıcılar onaylanabilir");
        }

        if (user.IsApproved)
        {
            return ApiResult<bool>.BadRequest("Kullanıcı zaten onaylanmış");
        }

        user.IsApproved = true;
        user.ApprovedAt = DateTime.UtcNow.AddHours(3);
        user.UpdatedAt = DateTime.UtcNow.AddHours(3);

        await _context.SaveChangesAsync();

        _logger.LogInformation("User approved: {UserId} - {Email}", userId, user.Email);

        return ApiResult<bool>.Ok(true);
    }

    public async Task<ApiResult<bool>> RejectUserAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
        {
            return ApiResult<bool>.NotFound("Kullanıcı bulunamadı");
        }

        if (user.Role != UserRole.Personel)
        {
            return ApiResult<bool>.BadRequest("Sadece personel kullanıcılar reddedilebilir");
        }

        if (user.IsApproved)
        {
            return ApiResult<bool>.BadRequest("Onaylanmış kullanıcılar reddedilemez");
        }

        // Kullanıcıyı sil (reddetme durumunda)
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        _logger.LogInformation("User rejected and removed: {UserId} - {Email}", userId, user.Email);

        return ApiResult<bool>.Ok(true);
    }
}

