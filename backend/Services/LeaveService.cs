using Microsoft.EntityFrameworkCore;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Enums;
using Zenabackend.Models;

namespace Zenabackend.Services;

public class LeaveService(ApplicationDbContext context, ILogger<LeaveService> logger)
{
    public async Task<ApiResult<LeaveRequestResponseDto>> CreateLeaveRequestAsync(int userId, CreateLeaveRequestDto dto)
    {
        var startDate = dto.StartDate.Date.ToUniversalTime();
        var endDate = dto.EndDate.Date.ToUniversalTime();

        // LeaveType enum'a çevir
        LeaveTypeEnum leaveType;
        if (string.IsNullOrEmpty(dto.LeaveType))
        {
            return ApiResult<LeaveRequestResponseDto>.BadRequest("İzin türü belirtilmelidir");
        }

        switch (dto.LeaveType.ToLower())
        {
            case "annual":
                leaveType = LeaveTypeEnum.Annual;
                break;
            case "unpaid":
                leaveType = LeaveTypeEnum.Unpaid;
                break;
            case "hourly":
                leaveType = LeaveTypeEnum.Hourly;
                break;
            case "excuse":
                leaveType = LeaveTypeEnum.Excuse;
                break;
            default:
                return ApiResult<LeaveRequestResponseDto>.BadRequest("Geçersiz izin türü");
        }

        // Yıllık izin için gün sayısı kontrolü
        if (leaveType == LeaveTypeEnum.Annual)
        {
            if (!dto.Days.HasValue || dto.Days.Value <= 0)
            {
                return ApiResult<LeaveRequestResponseDto>.BadRequest("Yıllık izin için gün sayısı belirtilmelidir");
            }

            // Kullanıcının yıllık izin gününü kontrol et
            // var rightsAndReceivables = await context.RightsAndReceivables
            //     .FirstOrDefaultAsync(r => r.UserId == userId);

            // if (rightsAndReceivables == null || 
            //     !rightsAndReceivables.UnusedAnnualLeaveDays.HasValue ||
            //     rightsAndReceivables.UnusedAnnualLeaveDays.Value < dto.Days.Value)
            // {
            //     return ApiResult<LeaveRequestResponseDto>.BadRequest("Yeterli yıllık izin gününüz bulunmamaktadır");
            // }

            // Bitiş tarihini gün sayısına göre hesapla
            endDate = startDate.AddDays(dto.Days.Value - 1);
        }

        // Saatlik izin için saat kontrolü
        if (leaveType == LeaveTypeEnum.Hourly)
        {
            if (!dto.Hours.HasValue || dto.Hours.Value <= 0)
            {
                return ApiResult<LeaveRequestResponseDto>.BadRequest("Saatlik izin için saat sayısı belirtilmelidir");
            }
            // Saatlik izin için başlangıç ve bitiş tarihi aynı
            endDate = startDate;
        }

        if (startDate > endDate)
        {
            return ApiResult<LeaveRequestResponseDto>.BadRequest("Başlangıç tarihi bitiş tarihinden önce olmalıdır");
        }

        var today = DateTime.UtcNow.Date;
        if (startDate < today)
        {
            return ApiResult<LeaveRequestResponseDto>.BadRequest("Başlangıç tarihi bugünden önce olamaz");
        }

        var now = DateTime.UtcNow;

        var leaveRequest = new LeaveRequest
        {
            UserId = userId,
            LeaveType = leaveType,
            StartDate = startDate,
            EndDate = endDate,
            Days = dto.Days,
            Hours = dto.Hours,
            Reason = dto.Reason,
            Status = LeaveStatusEnum.Pending,
            CreatedAt = now,
            UpdatedAt = now
        };

        context.LeaveRequests.Add(leaveRequest);
        await context.SaveChangesAsync();

        logger.LogInformation("Leave request created: {Id} by user {UserId}, Type: {Type}", leaveRequest.Id, userId, leaveType);

        var user = await context.Users.FindAsync(userId);
        var response = new LeaveRequestResponseDto
        {
            Id = leaveRequest.Id,
            UserId = leaveRequest.UserId,
            UserName = user?.Name ?? string.Empty,
            UserSurname = user?.Surname ?? string.Empty,
            UserEmail = user?.Email ?? string.Empty,
            LeaveType = leaveType.ToString().ToLower(),
            StartDate = leaveRequest.StartDate,
            EndDate = leaveRequest.EndDate,
            Days = leaveRequest.Days,
            Hours = leaveRequest.Hours,
            Reason = leaveRequest.Reason,
            Status = leaveRequest.Status,
            CreatedAt = leaveRequest.CreatedAt,
            UpdatedAt = leaveRequest.UpdatedAt
        };

        return ApiResult<LeaveRequestResponseDto>.Ok(response);
    }

    public async Task<ApiResult<PagedResultDto<LeaveRequestResponseDto>>> GetMyLeaveRequestsAsync(int userId, int pageNumber = 1, int pageSize = 10)
    {
        var query = context.LeaveRequests
            .AsNoTracking()
            .Include(lr => lr.User)
            .Where(lr => lr.UserId == userId)
            .OrderByDescending(lr => lr.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var leaveRequests = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = leaveRequests.Select(lr => new LeaveRequestResponseDto
        {
            Id = lr.Id,
            UserId = lr.UserId,
            UserName = lr.User.Name,
            UserSurname = lr.User.Surname,
            UserEmail = lr.User.Email,
            LeaveType = lr.LeaveType.ToString().ToLower(),
            StartDate = lr.StartDate,
            EndDate = lr.EndDate,
            Days = lr.Days,
            Hours = lr.Hours,
            Reason = lr.Reason,
            Status = lr.Status,
            CreatedAt = lr.CreatedAt,
            UpdatedAt = lr.UpdatedAt
        }).ToList();

        var response = new PagedResultDto<LeaveRequestResponseDto>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };

        return ApiResult<PagedResultDto<LeaveRequestResponseDto>>.Ok(response);
    }

    public async Task<ApiResult<PagedResultDto<LeaveRequestResponseDto>>> GetLeaveRequestsAsync(int userId, bool isManager, int pageNumber = 1, int pageSize = 10)
    {
        var query = context.LeaveRequests
            .AsNoTracking()
            .Include(lr => lr.User)
            .AsQueryable();

        // Manager değilse sadece kendi izin taleplerini göster
        if (!isManager)
        {
            query = query.Where(lr => lr.UserId == userId);
        }

        query = query.OrderByDescending(lr => lr.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var leaveRequests = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = leaveRequests.Select(lr => new LeaveRequestResponseDto
        {
            Id = lr.Id,
            UserId = lr.UserId,
            UserName = lr.User.Name,
            UserSurname = lr.User.Surname,
            UserEmail = lr.User.Email,
            LeaveType = lr.LeaveType.ToString().ToLower(),
            StartDate = lr.StartDate,
            EndDate = lr.EndDate,
            Days = lr.Days,
            Hours = lr.Hours,
            Reason = lr.Reason,
            Status = lr.Status,
            CreatedAt = lr.CreatedAt,
            UpdatedAt = lr.UpdatedAt
        }).ToList();

        var response = new PagedResultDto<LeaveRequestResponseDto>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };

        return ApiResult<PagedResultDto<LeaveRequestResponseDto>>.Ok(response);
    }

    public async Task<ApiResult<PagedResultDto<LeaveRequestResponseDto>>> GetAllLeaveRequestsAsync(int pageNumber = 1, int pageSize = 10)
    {
        var query = context.LeaveRequests
            .AsNoTracking()
            .Include(lr => lr.User)
            .OrderByDescending(lr => lr.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var leaveRequests = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = leaveRequests.Select(lr => new LeaveRequestResponseDto
        {
            Id = lr.Id,
            UserId = lr.UserId,
            UserName = lr.User.Name,
            UserSurname = lr.User.Surname,
            UserEmail = lr.User.Email,
            LeaveType = lr.LeaveType.ToString().ToLower(),
            StartDate = lr.StartDate,
            EndDate = lr.EndDate,
            Days = lr.Days,
            Hours = lr.Hours,
            Reason = lr.Reason,
            Status = lr.Status,
            CreatedAt = lr.CreatedAt,
            UpdatedAt = lr.UpdatedAt
        }).ToList();

        var response = new PagedResultDto<LeaveRequestResponseDto>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };

        return ApiResult<PagedResultDto<LeaveRequestResponseDto>>.Ok(response);
    }

    public async Task<ApiResult<bool>> CancelLeaveRequestAsync(int leaveRequestId, int userId, bool isManager)
    {
        var leaveRequest = await context.LeaveRequests.FindAsync(leaveRequestId);

        if (leaveRequest == null)
        {
            return ApiResult<bool>.NotFound("İzin talebi bulunamadı");
        }

        if (!isManager && leaveRequest.UserId != userId)
        {
            return ApiResult<bool>.Forbidden("Bu izin talebini iptal etme yetkiniz yok");
        }

        if (leaveRequest.Status != LeaveStatusEnum.Pending)
        {
            return ApiResult<bool>.BadRequest("Sadece bekleyen izin talepleri iptal edilebilir");
        }

        leaveRequest.Status = LeaveStatusEnum.Cancelled;
        leaveRequest.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        logger.LogInformation("Leave request cancelled: {Id} by user {UserId}", leaveRequestId, userId);

        return ApiResult<bool>.Ok(true);
    }

    public async Task<ApiResult<bool>> ApproveLeaveRequestAsync(int leaveRequestId)
    {
        var leaveRequest = await context.LeaveRequests
            .Include(lr => lr.User)
            .FirstOrDefaultAsync(lr => lr.Id == leaveRequestId);

        if (leaveRequest == null)
        {
            return ApiResult<bool>.NotFound("İzin talebi bulunamadı");
        }

        if (leaveRequest.Status != LeaveStatusEnum.Pending)
        {
            return ApiResult<bool>.BadRequest("Sadece bekleyen izin talepleri onaylanabilir");
        }

        // Yıllık izin onaylandığında RightsAndReceivables'tan düş
        if (leaveRequest.LeaveType == LeaveTypeEnum.Annual && leaveRequest.Days.HasValue)
        {
            var rightsAndReceivables = await context.RightsAndReceivables
                .FirstOrDefaultAsync(r => r.UserId == leaveRequest.UserId);

            if (rightsAndReceivables != null)
            {
                if (rightsAndReceivables.UnusedAnnualLeaveDays.HasValue)
                {
                    var oldDays = rightsAndReceivables.UnusedAnnualLeaveDays.Value;
                    var newDays = oldDays - leaveRequest.Days.Value;
                    if (newDays < 0)
                    {
                        return ApiResult<bool>.BadRequest("Yeterli yıllık izin günü bulunmamaktadır");
                    }
                    rightsAndReceivables.UnusedAnnualLeaveDays = newDays;
                    
                    // Ücret hesaplaması: Eğer toplam ücret varsa, günlük ücret hesapla ve yeni ücreti güncelle
                    if (rightsAndReceivables.UnusedAnnualLeaveAmount.HasValue && oldDays > 0)
                    {
                        // Günlük ücret = toplam ücret / eski gün sayısı
                        var dailyAmount = rightsAndReceivables.UnusedAnnualLeaveAmount.Value / oldDays;
                        // Yeni ücret = günlük ücret * yeni gün sayısı
                        rightsAndReceivables.UnusedAnnualLeaveAmount = dailyAmount * newDays;
                    }
                    else if (newDays == 0)
                    {
                        // Eğer tüm izin kullanıldıysa ücreti 0 yap
                        rightsAndReceivables.UnusedAnnualLeaveAmount = 0;
                    }
                }
            }
        }

        // Saatlik izin onaylandığında - kullanılan saatlik izin panele düşecek
        // Bu bilgiyi başka bir yerde saklamak gerekebilir, şimdilik sadece logluyoruz
        if (leaveRequest.LeaveType == LeaveTypeEnum.Hourly && leaveRequest.Hours.HasValue)
        {
            logger.LogInformation("Hourly leave approved: {Hours} hours for user {UserId}", 
                leaveRequest.Hours.Value, leaveRequest.UserId);
            // TODO: Kullanılan saatlik izin bilgisini saklamak için yeni bir tablo veya alan eklenebilir
        }

        leaveRequest.Status = LeaveStatusEnum.Approved;
        leaveRequest.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        logger.LogInformation("Leave request approved: {Id}, Type: {Type}", leaveRequestId, leaveRequest.LeaveType);

        return ApiResult<bool>.Ok(true);
    }

    public async Task<ApiResult<bool>> RejectLeaveRequestAsync(int leaveRequestId)
    {
        var leaveRequest = await context.LeaveRequests.FindAsync(leaveRequestId);

        if (leaveRequest == null)
        {
            return ApiResult<bool>.NotFound("İzin talebi bulunamadı");
        }

        if (leaveRequest.Status != LeaveStatusEnum.Pending)
        {
            return ApiResult<bool>.BadRequest("Sadece bekleyen izin talepleri reddedilebilir");
        }

        leaveRequest.Status = LeaveStatusEnum.Rejected;
        leaveRequest.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        logger.LogInformation("Leave request rejected: {Id}", leaveRequestId);

        return ApiResult<bool>.Ok(true);
    }

    public async Task<ApiResult<bool>> UpdateLeaveStatusAsync(int leaveRequestId, LeaveStatusEnum newStatus)
    {
        var leaveRequest = await context.LeaveRequests
            .Include(lr => lr.User)
            .FirstOrDefaultAsync(lr => lr.Id == leaveRequestId);

        if (leaveRequest == null)
        {
            return ApiResult<bool>.NotFound("İzin talebi bulunamadı");
        }

        // Eğer status Approved'a çevriliyorsa ve daha önce Approved değilse, yıllık izin kontrolü yap
        if (newStatus == LeaveStatusEnum.Approved && leaveRequest.Status != LeaveStatusEnum.Approved)
        {
            // Yıllık izin onaylandığında RightsAndReceivables'tan düş
            if (leaveRequest.LeaveType == LeaveTypeEnum.Annual && leaveRequest.Days.HasValue)
            {
                var rightsAndReceivables = await context.RightsAndReceivables
                    .FirstOrDefaultAsync(r => r.UserId == leaveRequest.UserId);

                if (rightsAndReceivables != null)
                {
                    if (rightsAndReceivables.UnusedAnnualLeaveDays.HasValue)
                    {
                        var oldDays = rightsAndReceivables.UnusedAnnualLeaveDays.Value;
                        var newDays = oldDays - leaveRequest.Days.Value;
                        if (newDays < 0)
                        {
                            return ApiResult<bool>.BadRequest("Yeterli yıllık izin günü bulunmamaktadır");
                        }
                        rightsAndReceivables.UnusedAnnualLeaveDays = newDays;
                        
                        // Ücret hesaplaması: Eğer toplam ücret varsa, günlük ücret hesapla ve yeni ücreti güncelle
                        if (rightsAndReceivables.UnusedAnnualLeaveAmount.HasValue && oldDays > 0)
                        {
                            // Günlük ücret = toplam ücret / eski gün sayısı
                            var dailyAmount = rightsAndReceivables.UnusedAnnualLeaveAmount.Value / oldDays;
                            // Yeni ücret = günlük ücret * yeni gün sayısı
                            rightsAndReceivables.UnusedAnnualLeaveAmount = dailyAmount * newDays;
                        }
                        else if (newDays == 0)
                        {
                            // Eğer tüm izin kullanıldıysa ücreti 0 yap
                            rightsAndReceivables.UnusedAnnualLeaveAmount = 0;
                        }
                    }
                }
            }
        }

        leaveRequest.Status = newStatus;
        leaveRequest.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        logger.LogInformation("Leave request status updated: {Id} to {Status}", leaveRequestId, newStatus);

        return ApiResult<bool>.Ok(true);
    }
}