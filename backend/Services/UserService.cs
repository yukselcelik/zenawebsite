using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Models;
using Zenabackend.Enums;

namespace Zenabackend.Services;

public class UserService(ApplicationDbContext context, ILogger<UserService> logger, IConfiguration configuration)
{
    public async Task<ApiResult<UserDetailDto>> GetUserDetailAsync(int userId, int requestingUserId,
        UserRoleEnum requestingUserRole)
    {
        if (requestingUserRole != UserRoleEnum.Manager && userId != requestingUserId)
        {
            return ApiResult<UserDetailDto>.Unauthorized("Sadece kendi bilgilerinizi görüntüleyebilirsiniz");
        }

        var user = await context.Users
            .Include(u => u.ContactInfos!.Where(c => !c.isDeleted))
            .Include(u => u.EmergencyContacts!.Where(e => !e.isDeleted))
            .Include(u => u.EmploymentInfos!.Where(e => !e.isDeleted))
            .Include(u => u.EducationInfos!.Where(e => !e.isDeleted))
            .Include(u => u.SocialSecurityDocuments!.Where(d => !d.isDeleted))
            .Include(u => u.LegalDocuments!.Where(d => !d.isDeleted))
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId && !u.isDeleted);

        if (user == null)
        {
            return ApiResult<UserDetailDto>.NotFound("Kullanıcı bulunamadı");
        }

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

        var photoPath = BuildPublicPhotoUrl(user.PhotoPath);

        var userDetail = new UserDetailDto
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Surname = user.Surname,
            Phone = user.Phone,
            TcNo = user.TcNo,
            PhotoPath = photoPath,
            Role = user.Role.ToString(),
            IsApproved = user.IsApproved,
            ApprovedAt = user.ApprovedAt,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            SocialSecurityNumber = user.SocialSecurityNumber,
            TaxNumber = user.TaxNumber,
            ContactInfos = user.ContactInfos?.Select(c => new ContactInfoDto
            {
                Id = c.Id,
                Address = c.Address,
                PhoneNumber = c.PhoneNumber,
                Mail = c.Mail
            }).ToList(),
            EmergencyContacts = user.EmergencyContacts?.Select(e => new EmergencyContactDto
            {
                Id = e.Id,
                FullName = e.FullName,
                PhoneNumber = e.PhoneNumber,
                Address = e.Address
            }).ToList(),
            EmploymentInfos = user.EmploymentInfos?.Select(e => new EmploymentInfoDto
            {
                Id = e.Id,
                StartDate = e.StartDate,
                Position = e.Position,
                WorkType = e.WorkType.ToString(),
                ContractType = e.ContractType.ToString(),
                WorkplaceNumber = e.WorkplaceNumber
            }).ToList(),
            EducationInfos = user.EducationInfos?.Select(e => new EducationInfoDto
            {
                Id = e.Id,
                University = e.University,
                Department = e.Department,
                GraduationYear = e.GraduationYear,
                Certification = e.Certification
            }).ToList(),
            SocialSecurity = new SocialSecurityDto
            {
                UserId = user.Id,
                SocialSecurityNumber = user.SocialSecurityNumber,
                TaxNumber = user.TaxNumber,
                Documents = user.SocialSecurityDocuments?.Select(d =>
                {
                    var docPath = d.DocumentPath;
                    var docUrl = string.Empty;
                    if (!string.IsNullOrWhiteSpace(docPath))
                    {
                        var trimmed = docPath.Trim();
                        var baseUrlLocal = configuration["FileStorage:BaseUrl"]?.TrimEnd('/') ??
                                           "http://localhost:5133";
                        if (trimmed.StartsWith("http", StringComparison.OrdinalIgnoreCase))
                        {
                            docUrl = trimmed;
                        }
                        else if (trimmed.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
                        {
                            docUrl = $"{baseUrlLocal}{trimmed}";
                        }
                        else if (trimmed.StartsWith("uploads/", StringComparison.OrdinalIgnoreCase))
                        {
                            docUrl = $"{baseUrlLocal}/{trimmed}";
                        }
                        else
                        {
                            docUrl = $"{baseUrlLocal}/uploads/social-security/{trimmed}";
                        }
                    }

                    return new SocialSecurityDocumentDto
                    {
                        Id = d.Id,
                        DocumentPath = d.DocumentPath,
                        DocumentUrl = docUrl,
                        OriginalFileName = d.OriginalFileName,
                        DocumentType = d.DocumentType,
                        DocumentTypeName = d.DocumentTypeName,
                        UserId = d.UserId,
                        CreatedAt = d.CreatedAt
                    };
                }).ToList() ?? new List<SocialSecurityDocumentDto>()
            },
            SocialSecurityDocuments = user.SocialSecurityDocuments?.Select(d =>
            {
                var docPath = d.DocumentPath;
                var docUrl = string.Empty;
                if (!string.IsNullOrWhiteSpace(docPath))
                {
                    var trimmed = docPath.Trim();
                    var baseUrlLocal = configuration["FileStorage:BaseUrl"]?.TrimEnd('/') ?? "http://localhost:5133";
                    if (trimmed.StartsWith("http", StringComparison.OrdinalIgnoreCase))
                    {
                        docUrl = trimmed;
                    }
                    else if (trimmed.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
                    {
                        docUrl = $"{baseUrlLocal}{trimmed}";
                    }
                    else if (trimmed.StartsWith("uploads/", StringComparison.OrdinalIgnoreCase))
                    {
                        docUrl = $"{baseUrlLocal}/{trimmed}";
                    }
                    else
                    {
                        docUrl = $"{baseUrlLocal}/uploads/social-security/{trimmed}";
                    }
                }

                return new SocialSecurityDocumentDto
                {
                    Id = d.Id,
                    DocumentPath = d.DocumentPath,
                    DocumentUrl = docUrl,
                    DocumentType = d.DocumentType,
                    DocumentTypeName = d.DocumentTypeName,
                    UserId = d.UserId,
                    CreatedAt = d.CreatedAt
                };
            }).ToList() ?? null,
            LegalDocuments = new LegalDocumentDto
            {
                UserId = user.Id,
                Documents = user.LegalDocuments?.Select(d =>
                {
                    var docPath = d.DocumentPath;
                    var docUrl = string.Empty;
                    if (!string.IsNullOrWhiteSpace(docPath))
                    {
                        var trimmed = docPath.Trim();
                        var baseUrlLocal = configuration["FileStorage:BaseUrl"]?.TrimEnd('/') ??
                                           "http://localhost:5133";
                        if (trimmed.StartsWith("http", StringComparison.OrdinalIgnoreCase))
                        {
                            docUrl = trimmed;
                        }
                        else if (trimmed.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
                        {
                            docUrl = $"{baseUrlLocal}{trimmed}";
                        }
                        else if (trimmed.StartsWith("uploads/", StringComparison.OrdinalIgnoreCase))
                        {
                            docUrl = $"{baseUrlLocal}/{trimmed}";
                        }
                        else
                        {
                            docUrl = $"{baseUrlLocal}/uploads/legal-documents/{trimmed}";
                        }
                    }

                    return new LegalDocumentItemDto
                    {
                        Id = d.Id,
                        DocumentPath = d.DocumentPath,
                        DocumentUrl = docUrl,
                        OriginalFileName = d.OriginalFileName,
                        LegalDocumentType = d.LegalDocumentType,
                        LegalDocumentTypeName = d.LegalDocumentTypeName,
                        UserId = d.UserId,
                        CreatedAt = d.CreatedAt
                    };
                }).ToList() ?? new List<LegalDocumentItemDto>()
            }
        };

        return ApiResult<UserDetailDto>.Ok(userDetail);
    }

    public async Task<ApiResult<UserDetailDto>> UpdateUserAsync(int userId, UpdateUserDto updateDto,
        int requestingUserId, UserRoleEnum requestingUserRole)
    {
        if (requestingUserRole != UserRoleEnum.Manager && userId != requestingUserId)
        {
            return ApiResult<UserDetailDto>.Unauthorized("Sadece kendi bilgilerinizi güncelleyebilirsiniz");
        }

        var user = await context.Users
            .Include(u => u.ContactInfos)
            .Include(u => u.EmergencyContacts)
            .Include(u => u.EducationInfos)
            .FirstOrDefaultAsync(u => u.Id == userId && !u.isDeleted);

        if (user == null)
        {
            return ApiResult<UserDetailDto>.NotFound("Kullanıcı bulunamadı");
        }

        if (updateDto.Name != null) user.Name = updateDto.Name;
        if (updateDto.Surname != null) user.Surname = updateDto.Surname;
        if (updateDto.Phone != null) user.Phone = updateDto.Phone;
        if (updateDto.PhotoPath != null) user.PhotoPath = updateDto.PhotoPath;

        if (updateDto.TcNo != null)
        {
            if (requestingUserRole == UserRoleEnum.Manager || userId == requestingUserId)
            {
                var trimmed = updateDto.TcNo.Trim();
                if (!string.IsNullOrEmpty(trimmed) && trimmed.All(char.IsDigit) && (trimmed.Length == 11))
                {
                    user.TcNo = trimmed;
                }
                else
                {
                    return ApiResult<UserDetailDto>.BadRequest("Geçerli bir TC No giriniz (11 haneli).");
                }
            }
            else
            {
                return ApiResult<UserDetailDto>.Unauthorized("TC No güncelleme yetkiniz yok");
            }
        }

        if (updateDto.Role != null)
        {
            if (requestingUserRole != UserRoleEnum.Manager)
            {
                return ApiResult<UserDetailDto>.Unauthorized("Rol güncelleme yetkiniz yok");
            }

            if (!Enum.TryParse<UserRoleEnum>(updateDto.Role, true, out var newRole))
            {
                return ApiResult<UserDetailDto>.BadRequest("Geçersiz rol");
            }

            user.Role = newRole;
        }

        if (updateDto.SocialSecurityNumber != null)
        {
            if (requestingUserRole != UserRoleEnum.Manager)
            {
                return ApiResult<UserDetailDto>.Unauthorized("Sosyal güvenlik numarası güncelleme yetkiniz yok");
            }

            user.SocialSecurityNumber = updateDto.SocialSecurityNumber;
        }

        if (updateDto.TaxNumber != null)
        {
            if (requestingUserRole != UserRoleEnum.Manager)
            {
                return ApiResult<UserDetailDto>.Unauthorized("Vergi numarası güncelleme yetkiniz yok");
            }

            user.TaxNumber = updateDto.TaxNumber;
        }

        user.UpdatedAt = DateTime.UtcNow;

        if (updateDto.ContactInfos != null)
        {
            foreach (var existing in user.ContactInfos ?? new List<ContactInfo>())
            {
                existing.isDeleted = true;
                existing.UpdatedAt = DateTime.UtcNow;
            }

            foreach (var contactInfo in updateDto.ContactInfos)
            {
                if (contactInfo.Id > 0)
                {
                    var existing = user.ContactInfos?.FirstOrDefault(c => c.Id == contactInfo.Id);
                    if (existing == null) continue;
                    existing.Address = contactInfo.Address;
                    existing.PhoneNumber = contactInfo.PhoneNumber;
                    existing.Mail = contactInfo.Mail;
                    existing.isDeleted = false;
                    existing.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    user.ContactInfos ??= new List<ContactInfo>();
                    user.ContactInfos.Add(new ContactInfo
                    {
                        UserId = user.Id,
                        Address = contactInfo.Address,
                        PhoneNumber = contactInfo.PhoneNumber,
                        Mail = contactInfo.Mail,
                        isDeleted = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                }
            }
        }

        if (updateDto.EmergencyContacts != null)
        {
            foreach (var existing in user.EmergencyContacts ?? new List<EmergencyContact>())
            {
                existing.isDeleted = true;
                existing.UpdatedAt = DateTime.UtcNow;
            }

            foreach (var emergencyContact in updateDto.EmergencyContacts)
            {
                if (emergencyContact.Id > 0)
                {
                    var existing = user.EmergencyContacts?.FirstOrDefault(e => e.Id == emergencyContact.Id);
                    if (existing == null) continue;
                    existing.FullName = emergencyContact.FullName;
                    existing.PhoneNumber = emergencyContact.PhoneNumber;
                    existing.Address = emergencyContact.Address;
                    existing.isDeleted = false;
                    existing.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    user.EmergencyContacts ??= new List<EmergencyContact>();
                    user.EmergencyContacts.Add(new EmergencyContact
                    {
                        UserId = user.Id,
                        FullName = emergencyContact.FullName,
                        PhoneNumber = emergencyContact.PhoneNumber,
                        Address = emergencyContact.Address,
                        isDeleted = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                }
            }
        }

        if (updateDto.EducationInfos != null)
        {
            foreach (var existing in user.EducationInfos ?? new List<EducationInfo>())
            {
                existing.isDeleted = true;
                existing.UpdatedAt = DateTime.UtcNow;
            }

            foreach (var educationInfo in updateDto.EducationInfos)
            {
                if (educationInfo.Id > 0)
                {
                    var existing = user.EducationInfos?.FirstOrDefault(e => e.Id == educationInfo.Id);
                    if (existing == null) continue;
                    existing.University = educationInfo.University;
                    existing.Department = educationInfo.Department;
                    existing.GraduationYear = educationInfo.GraduationYear;
                    existing.Certification = educationInfo.Certification;
                    existing.isDeleted = false;
                    existing.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    user.EducationInfos ??= new List<EducationInfo>();
                    user.EducationInfos.Add(new EducationInfo
                    {
                        UserId = user.Id,
                        University = educationInfo.University,
                        Department = educationInfo.Department,
                        GraduationYear = educationInfo.GraduationYear,
                        Certification = educationInfo.Certification,
                        isDeleted = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                }
            }
        }

        await context.SaveChangesAsync();

        logger.LogInformation("User updated: {UserId}", userId);

        return await GetUserDetailAsync(userId, requestingUserId, requestingUserRole);
    }

    public async Task<ApiResult<PagedResultDto<UserResponseDto>>> GetPersonnelListAsync(int pageNumber = 1,
        int pageSize = 10)
    {
        var query = context.Users
            .AsNoTracking()
            .Where(u => !u.isDeleted)
            .OrderByDescending(u => u.Role == UserRoleEnum.Manager)
            .ThenByDescending(u => u.IsApproved)
            .ThenByDescending(u => u.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var users = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

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

        var items = users.Select(u => new UserResponseDto
        {
            Id = u.Id,
            Email = u.Email,
            Name = u.Name,
            Surname = u.Surname,
            Phone = u.Phone,
            PhotoPath = BuildPublicPhotoUrl(u.PhotoPath),
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

    public async Task<ApiResult<EmploymentInfoDto>> CreateEmploymentInfoAsync(CreateEmploymentInfoDto createDto)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Id == createDto.UserId && !u.isDeleted);

        if (user == null)
        {
            return ApiResult<EmploymentInfoDto>.NotFound("Kullanıcı bulunamadı");
        }

        if (!Enum.TryParse<WorkTypeEnum>(createDto.WorkType, out var workType))
        {
            return ApiResult<EmploymentInfoDto>.BadRequest("Geçersiz WorkType");
        }

        if (!Enum.TryParse<ContractTypeEnum>(createDto.ContractType, out var contractType))
        {
            return ApiResult<EmploymentInfoDto>.BadRequest("Geçersiz ContractType");
        }

        // StartDate'i UTC'ye çevir (PostgreSQL için gerekli)
        var startDate = createDto.StartDate.Kind == DateTimeKind.Unspecified
            ? DateTime.SpecifyKind(createDto.StartDate, DateTimeKind.Utc)
            : createDto.StartDate.ToUniversalTime();

        var employmentInfo = new EmploymentInfo
        {
            // UserId = createDto.UserId,
            StartDate = startDate,
            Position = createDto.Position,
            WorkType = workType,
            ContractType = contractType,
            WorkplaceNumber = createDto.WorkplaceNumber,
            isDeleted = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        user.EmploymentInfos ??= new List<EmploymentInfo>();
        user.EmploymentInfos.Add(employmentInfo);
        try
        {
            await context.SaveChangesAsync();

            logger.LogInformation("EmploymentInfo created for user: {UserId}", createDto.UserId);

            var result = new EmploymentInfoDto
            {
                Id = employmentInfo.Id,
                StartDate = employmentInfo.StartDate,
                Position = employmentInfo.Position,
                WorkType = employmentInfo.WorkType.ToString(),
                ContractType = employmentInfo.ContractType.ToString(),
                WorkplaceNumber = employmentInfo.WorkplaceNumber
            };

            return ApiResult<EmploymentInfoDto>.Ok(result);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<ApiResult<EmploymentInfoDto>> UpdateEmploymentInfoAsync(int employmentInfoId,
        UpdateEmploymentInfoDto updateDto)
    {
        var employmentInfo = await context.Set<EmploymentInfo>()
            .FirstOrDefaultAsync(e => e.Id == employmentInfoId && !e.isDeleted);

        if (employmentInfo == null)
        {
            return ApiResult<EmploymentInfoDto>.NotFound("İstihdam bilgisi bulunamadı");
        }

        if (updateDto.StartDate.HasValue)
        {
            // StartDate'i UTC'ye çevir (PostgreSQL için gerekli)
            var startDate = updateDto.StartDate.Value.Kind == DateTimeKind.Unspecified
                ? DateTime.SpecifyKind(updateDto.StartDate.Value, DateTimeKind.Utc)
                : updateDto.StartDate.Value.ToUniversalTime();
            employmentInfo.StartDate = startDate;
        }

        if (updateDto.Position != null) employmentInfo.Position = updateDto.Position;
        if (updateDto.WorkType != null && Enum.TryParse<WorkTypeEnum>(updateDto.WorkType, out var workType))
        {
            employmentInfo.WorkType = workType;
        }

        if (updateDto.ContractType != null &&
            Enum.TryParse<ContractTypeEnum>(updateDto.ContractType, out var contractType))
        {
            employmentInfo.ContractType = contractType;
        }

        if (updateDto.WorkplaceNumber != null) employmentInfo.WorkplaceNumber = updateDto.WorkplaceNumber;

        employmentInfo.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        logger.LogInformation("EmploymentInfo updated: {EmploymentInfoId}", employmentInfoId);

        var result = new EmploymentInfoDto
        {
            Id = employmentInfo.Id,
            StartDate = employmentInfo.StartDate,
            Position = employmentInfo.Position,
            WorkType = employmentInfo.WorkType.ToString(),
            ContractType = employmentInfo.ContractType.ToString(),
            WorkplaceNumber = employmentInfo.WorkplaceNumber
        };

        return ApiResult<EmploymentInfoDto>.Ok(result);
    }

    public async Task<ApiResult<bool>> DeleteEmploymentInfoAsync(int employmentInfoId)
    {
        var employmentInfo = await context.Set<EmploymentInfo>()
            .FirstOrDefaultAsync(e => e.Id == employmentInfoId && !e.isDeleted);

        if (employmentInfo == null)
        {
            return ApiResult<bool>.NotFound("İstihdam bilgisi bulunamadı");
        }

        employmentInfo.isDeleted = true;
        employmentInfo.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        logger.LogInformation("EmploymentInfo deleted: {EmploymentInfoId}", employmentInfoId);

        return ApiResult<bool>.Ok(true);
    }

    public async Task<ApiResult<string>> UploadProfilePhotoAsync(int userId, IFormFile photo, int requestingUserId,
        UserRoleEnum requestingUserRole)
    {
        if (requestingUserRole != UserRoleEnum.Manager && userId != requestingUserId)
        {
            return ApiResult<string>.Unauthorized("Sadece kendi profil fotoğrafınızı güncelleyebilirsiniz");
        }

        var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId && !u.isDeleted);
        if (user == null)
        {
            return ApiResult<string>.NotFound("Kullanıcı bulunamadı");
        }

        var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "photos");
        if (!Directory.Exists(uploadsRoot))
        {
            Directory.CreateDirectory(uploadsRoot);
        }

        var extension = Path.GetExtension(photo.FileName);
        var uniqueName = $"{userId}_{Guid.NewGuid():N}{extension}";
        var fullPath = Path.Combine(uploadsRoot, uniqueName);

        await using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await photo.CopyToAsync(stream);
        }

        var storedFileName = uniqueName;

        user.PhotoPath = storedFileName;
        user.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        var baseUrl = configuration["FileStorage:BaseUrl"]?.TrimEnd('/') ?? "http://localhost:5133";
        var photoUrl = $"{baseUrl}/uploads/photos/{storedFileName}";

        logger.LogInformation("Profile photo updated for user {UserId}", userId);
        return ApiResult<string>.Ok(photoUrl, "Profil fotoğrafı güncellendi");
    }

    public async Task<ApiResult<bool>> DeleteProfilePhotoAsync(int userId, int requestingUserId,
        UserRoleEnum requestingUserRole)
    {
        if (requestingUserRole != UserRoleEnum.Manager && userId != requestingUserId)
        {
            return ApiResult<bool>.Unauthorized("Sadece kendi profil fotoğrafınızı silebilirsiniz");
        }

        var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId && !u.isDeleted);
        if (user == null)
        {
            return ApiResult<bool>.NotFound("Kullanıcı bulunamadı");
        }

        try
        {
            if (!string.IsNullOrWhiteSpace(user.PhotoPath))
            {
                var stored = user.PhotoPath?.Trim();
                var fileNameOnly = stored!;
                if (stored!.StartsWith("http", StringComparison.OrdinalIgnoreCase))
                {
                    var uri = new Uri(stored);
                    fileNameOnly = Path.GetFileName(uri.LocalPath);
                }
                else if (stored.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase) ||
                         stored.StartsWith("uploads/", StringComparison.OrdinalIgnoreCase))
                {
                    fileNameOnly = Path.GetFileName(stored);
                }

                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "photos",
                    fileNameOnly);
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Profile photo file delete failed for user {UserId}", userId);
        }

        user.PhotoPath = null;
        user.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        logger.LogInformation("Profile photo removed for user {UserId}", userId);
        return ApiResult<bool>.Ok(true, "Profil fotoğrafı kaldırıldı");
    }
}