using Microsoft.EntityFrameworkCore;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Models;

namespace Zenabackend.Services;

public class UserService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<UserService> _logger;

    public UserService(ApplicationDbContext context, ILogger<UserService> logger)
    {
        _context = context;
        _logger = logger;
    }

    // Kullanıcı detaylarını getir (kendi bilgileri veya yönetici başkasının bilgilerini görebilir)
    public async Task<ApiResult<UserDetailDto>> GetUserDetailAsync(int userId, int requestingUserId, UserRole requestingUserRole)
    {
        // Kullanıcı sadece kendi bilgilerini görebilir, yönetici herkesi görebilir
        if (requestingUserRole != UserRole.Manager && userId != requestingUserId)
        {
            return ApiResult<UserDetailDto>.Unauthorized("Sadece kendi bilgilerinizi görüntüleyebilirsiniz");
        }

        var user = await _context.Users
            .Include(u => u.ContactInfos!.Where(c => !c.isDeleted))
            .Include(u => u.EmergencyContacts!.Where(e => !e.isDeleted))
            .Include(u => u.EmploymentInfos!.Where(e => !e.isDeleted))
            .Include(u => u.EducationInfos!.Where(e => !e.isDeleted))
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId && !u.isDeleted);

        if (user == null)
        {
            return ApiResult<UserDetailDto>.NotFound("Kullanıcı bulunamadı");
        }

        var userDetail = new UserDetailDto
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Surname = user.Surname,
            Phone = user.Phone,
            TcNo = user.TcNo,
            PhotoPath = user.PhotoPath,
            Role = user.Role.ToString(),
            IsApproved = user.IsApproved,
            ApprovedAt = user.ApprovedAt,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
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
            }).ToList()
        };

        return ApiResult<UserDetailDto>.Ok(userDetail);
    }

    // Kullanıcı bilgilerini güncelle
    public async Task<ApiResult<UserDetailDto>> UpdateUserAsync(int userId, UpdateUserDto updateDto, int requestingUserId, UserRole requestingUserRole)
    {
        // Kullanıcı sadece kendi bilgilerini güncelleyebilir, yönetici herkesi güncelleyebilir
        if (requestingUserRole != UserRole.Manager && userId != requestingUserId)
        {
            return ApiResult<UserDetailDto>.Unauthorized("Sadece kendi bilgilerinizi güncelleyebilirsiniz");
        }

        var user = await _context.Users
            .Include(u => u.ContactInfos)
            .Include(u => u.EmergencyContacts)
            .Include(u => u.EducationInfos)
            .FirstOrDefaultAsync(u => u.Id == userId && !u.isDeleted);

        if (user == null)
        {
            return ApiResult<UserDetailDto>.NotFound("Kullanıcı bulunamadı");
        }

        // Kullanıcı kendi bilgilerini güncellerken bazı alanları değiştiremez
        if (requestingUserRole != UserRole.Manager)
        {
            // Personel kullanıcılar Email, TcNo, Role, IsApproved gibi alanları değiştiremez
            // Bu alanlar UpdateUserDto'da zaten yok, ama yine de kontrol edelim
        }

        // Güncellenebilir alanlar
        if (updateDto.Name != null) user.Name = updateDto.Name;
        if (updateDto.Surname != null) user.Surname = updateDto.Surname;
        if (updateDto.Phone != null) user.Phone = updateDto.Phone;
        if (updateDto.PhotoPath != null) user.PhotoPath = updateDto.PhotoPath;

        user.UpdatedAt = DateTime.UtcNow;

        // ContactInfos güncelle
        if (updateDto.ContactInfos != null)
        {
            // Mevcut kayıtları soft delete yap
            foreach (var existing in user.ContactInfos ?? new List<ContactInfo>())
            {
                existing.isDeleted = true;
                existing.UpdatedAt = DateTime.UtcNow;
            }

            // Yeni kayıtları ekle
            foreach (var contactInfo in updateDto.ContactInfos)
            {
                if (contactInfo.Id > 0)
                {
                    // Mevcut kaydı güncelle
                    var existing = user.ContactInfos?.FirstOrDefault(c => c.Id == contactInfo.Id);
                    if (existing != null)
                    {
                        existing.Address = contactInfo.Address;
                        existing.PhoneNumber = contactInfo.PhoneNumber;
                        existing.Mail = contactInfo.Mail;
                        existing.isDeleted = false;
                        existing.UpdatedAt = DateTime.UtcNow;
                    }
                }
                else
                {
                    // Yeni kayıt ekle
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

        // EmergencyContacts güncelle
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
                    if (existing != null)
                    {
                        existing.FullName = emergencyContact.FullName;
                        existing.PhoneNumber = emergencyContact.PhoneNumber;
                        existing.Address = emergencyContact.Address;
                        existing.isDeleted = false;
                        existing.UpdatedAt = DateTime.UtcNow;
                    }
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

        // EducationInfos güncelle
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
                    if (existing != null)
                    {
                        existing.University = educationInfo.University;
                        existing.Department = educationInfo.Department;
                        existing.GraduationYear = educationInfo.GraduationYear;
                        existing.Certification = educationInfo.Certification;
                        existing.isDeleted = false;
                        existing.UpdatedAt = DateTime.UtcNow;
                    }
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

        await _context.SaveChangesAsync();

        _logger.LogInformation("User updated: {UserId}", userId);

        // Güncellenmiş kullanıcıyı döndür
        return await GetUserDetailAsync(userId, requestingUserId, requestingUserRole);
    }

    // Yönetici için personel listesi
    public async Task<ApiResult<PagedResultDto<UserResponseDto>>> GetPersonnelListAsync(int pageNumber = 1, int pageSize = 10)
    {
        var query = _context.Users
            .AsNoTracking()
            .Where(u => u.Role == UserRole.Personel && u.IsApproved && !u.isDeleted)
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

    // Yönetici için EmploymentInfo ekleme
    public async Task<ApiResult<EmploymentInfoDto>> CreateEmploymentInfoAsync(CreateEmploymentInfoDto createDto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == createDto.UserId && !u.isDeleted);

        if (user == null)
        {
            return ApiResult<EmploymentInfoDto>.NotFound("Kullanıcı bulunamadı");
        }

        if (!Enum.TryParse<WorkType>(createDto.WorkType, out var workType))
        {
            return ApiResult<EmploymentInfoDto>.BadRequest("Geçersiz WorkType");
        }

        if (!Enum.TryParse<ContractType>(createDto.ContractType, out var contractType))
        {
            return ApiResult<EmploymentInfoDto>.BadRequest("Geçersiz ContractType");
        }

        var employmentInfo = new EmploymentInfo
        {
            UserId = createDto.UserId,
            StartDate = createDto.StartDate,
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

        await _context.SaveChangesAsync();

        _logger.LogInformation("EmploymentInfo created for user: {UserId}", createDto.UserId);

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

    // Yönetici için EmploymentInfo güncelleme
    public async Task<ApiResult<EmploymentInfoDto>> UpdateEmploymentInfoAsync(int employmentInfoId, UpdateEmploymentInfoDto updateDto)
    {
        var employmentInfo = await _context.Set<EmploymentInfo>()
            .FirstOrDefaultAsync(e => e.Id == employmentInfoId && !e.isDeleted);

        if (employmentInfo == null)
        {
            return ApiResult<EmploymentInfoDto>.NotFound("İstihdam bilgisi bulunamadı");
        }

        if (updateDto.StartDate.HasValue) employmentInfo.StartDate = updateDto.StartDate.Value;
        if (updateDto.Position != null) employmentInfo.Position = updateDto.Position;
        if (updateDto.WorkType != null && Enum.TryParse<WorkType>(updateDto.WorkType, out var workType))
        {
            employmentInfo.WorkType = workType;
        }
        if (updateDto.ContractType != null && Enum.TryParse<ContractType>(updateDto.ContractType, out var contractType))
        {
            employmentInfo.ContractType = contractType;
        }
        if (updateDto.WorkplaceNumber != null) employmentInfo.WorkplaceNumber = updateDto.WorkplaceNumber;

        employmentInfo.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("EmploymentInfo updated: {EmploymentInfoId}", employmentInfoId);

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

    // Yönetici için EmploymentInfo silme (soft delete)
    public async Task<ApiResult<bool>> DeleteEmploymentInfoAsync(int employmentInfoId)
    {
        var employmentInfo = await _context.Set<EmploymentInfo>()
            .FirstOrDefaultAsync(e => e.Id == employmentInfoId && !e.isDeleted);

        if (employmentInfo == null)
        {
            return ApiResult<bool>.NotFound("İstihdam bilgisi bulunamadı");
        }

        employmentInfo.isDeleted = true;
        employmentInfo.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("EmploymentInfo deleted: {EmploymentInfoId}", employmentInfoId);

        return ApiResult<bool>.Ok(true);
    }
}

