using Microsoft.EntityFrameworkCore;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Enums;
using Zenabackend.Models;

namespace Zenabackend.Services;

public class MeetingRoomRequestService(ApplicationDbContext context, ILogger<MeetingRoomRequestService> logger)
{
    public async Task<ApiResult<MeetingRoomRequestResponseDto>> CreateMeetingRoomRequestAsync(int userId, CreateMeetingRoomRequestDto dto)
    {
        // MeetingRoom enum'a çevir
        MeetingRoomEnum meetingRoom;
        switch (dto.MeetingRoom.ToLower())
        {
            case "tonyukuk":
                meetingRoom = MeetingRoomEnum.Tonyukuk;
                break;
            case "atatürk":
            case "ataturk":
                meetingRoom = MeetingRoomEnum.MustafaKemalAtaturk;
                break;
            default:
                return ApiResult<MeetingRoomRequestResponseDto>.BadRequest("Geçersiz toplantı salonu");
        }

        var date = dto.Date.Date.ToUniversalTime();
        var today = DateTime.UtcNow.Date;
        if (date < today)
        {
            return ApiResult<MeetingRoomRequestResponseDto>.BadRequest("Tarih bugünden önce olamaz");
        }

        // TimeSpan'e çevir - "HH:mm" formatından TimeSpan'e
        TimeSpan startTime;
        TimeSpan endTime;
        
        try
        {
            var startParts = dto.StartTime.Split(':');
            if (startParts.Length != 2 || !int.TryParse(startParts[0], out var startHour) || !int.TryParse(startParts[1], out var startMinute))
            {
                return ApiResult<MeetingRoomRequestResponseDto>.BadRequest("Geçersiz başlangıç saati formatı (HH:mm bekleniyor)");
            }
            startTime = new TimeSpan(startHour, startMinute, 0);

            var endParts = dto.EndTime.Split(':');
            if (endParts.Length != 2 || !int.TryParse(endParts[0], out var endHour) || !int.TryParse(endParts[1], out var endMinute))
            {
                return ApiResult<MeetingRoomRequestResponseDto>.BadRequest("Geçersiz bitiş saati formatı (HH:mm bekleniyor)");
            }
            endTime = new TimeSpan(endHour, endMinute, 0);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error parsing time: StartTime={StartTime}, EndTime={EndTime}", dto.StartTime, dto.EndTime);
            return ApiResult<MeetingRoomRequestResponseDto>.BadRequest("Saat formatı hatası");
        }

        if (endTime <= startTime)
        {
            return ApiResult<MeetingRoomRequestResponseDto>.BadRequest("Bitiş saati başlangıç saatinden sonra olmalıdır");
        }

        // Aynı tarih ve saatte çakışma kontrolü
        var conflictingRequest = await context.MeetingRoomRequests
            .Where(mrr => mrr.MeetingRoom == meetingRoom &&
                         mrr.Date.Date == date &&
                         mrr.Status == LeaveStatusEnum.Pending &&
                         ((mrr.StartTime <= startTime && mrr.EndTime > startTime) ||
                          (mrr.StartTime < endTime && mrr.EndTime >= endTime) ||
                          (mrr.StartTime >= startTime && mrr.EndTime <= endTime)))
            .FirstOrDefaultAsync();

        if (conflictingRequest != null)
        {
            return ApiResult<MeetingRoomRequestResponseDto>.BadRequest("Bu tarih ve saatte toplantı salonu zaten rezerve edilmiş");
        }

        var now = DateTime.UtcNow;

        var meetingRoomRequest = new MeetingRoomRequest
        {
            UserId = userId,
            MeetingRoom = meetingRoom,
            Date = date,
            StartTime = startTime,
            EndTime = endTime,
            Description = dto.Description,
            Status = LeaveStatusEnum.Pending,
            CreatedAt = now,
            UpdatedAt = now
        };

        context.MeetingRoomRequests.Add(meetingRoomRequest);
        await context.SaveChangesAsync();

        logger.LogInformation("Meeting room request created: {Id} by user {UserId}", meetingRoomRequest.Id, userId);

        var user = await context.Users.FindAsync(userId);
        var response = new MeetingRoomRequestResponseDto
        {
            Id = meetingRoomRequest.Id,
            UserId = meetingRoomRequest.UserId,
            UserName = user?.Name ?? string.Empty,
            UserSurname = user?.Surname ?? string.Empty,
            UserEmail = user?.Email ?? string.Empty,
            MeetingRoom = meetingRoom == MeetingRoomEnum.Tonyukuk ? "tonyukuk" : "atatürk",
            Date = meetingRoomRequest.Date,
            StartTime = $"{meetingRoomRequest.StartTime.Hours:D2}:{meetingRoomRequest.StartTime.Minutes:D2}",
            EndTime = $"{meetingRoomRequest.EndTime.Hours:D2}:{meetingRoomRequest.EndTime.Minutes:D2}",
            Description = meetingRoomRequest.Description,
            Status = meetingRoomRequest.Status.ToString(),
            CreatedAt = meetingRoomRequest.CreatedAt,
            UpdatedAt = meetingRoomRequest.UpdatedAt
        };

        return ApiResult<MeetingRoomRequestResponseDto>.Ok(response);
    }

    public async Task<ApiResult<PagedResultDto<MeetingRoomRequestResponseDto>>> GetMyMeetingRoomRequestsAsync(int userId, int pageNumber = 1, int pageSize = 10)
    {
        var query = context.MeetingRoomRequests
            .AsNoTracking()
            .Include(mrr => mrr.User)
            .Where(mrr => mrr.UserId == userId)
            .OrderByDescending(mrr => mrr.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var meetingRoomRequests = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = meetingRoomRequests.Select(mrr => new MeetingRoomRequestResponseDto
        {
            Id = mrr.Id,
            UserId = mrr.UserId,
            UserName = mrr.User.Name,
            UserSurname = mrr.User.Surname,
            UserEmail = mrr.User.Email,
            MeetingRoom = mrr.MeetingRoom == MeetingRoomEnum.Tonyukuk ? "tonyukuk" : "atatürk",
            Date = mrr.Date,
            StartTime = mrr.StartTime.ToString(@"hh\:mm"),
            EndTime = mrr.EndTime.ToString(@"hh\:mm"),
            Description = mrr.Description,
            Status = mrr.Status.ToString(),
            CreatedAt = mrr.CreatedAt,
            UpdatedAt = mrr.UpdatedAt
        }).ToList();

        var response = new PagedResultDto<MeetingRoomRequestResponseDto>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };

        return ApiResult<PagedResultDto<MeetingRoomRequestResponseDto>>.Ok(response);
    }

    public async Task<ApiResult<PagedResultDto<MeetingRoomRequestResponseDto>>> GetAllMeetingRoomRequestsAsync(int pageNumber = 1, int pageSize = 10)
    {
        var query = context.MeetingRoomRequests
            .AsNoTracking()
            .Include(mrr => mrr.User)
            .OrderByDescending(mrr => mrr.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var meetingRoomRequests = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = meetingRoomRequests.Select(mrr => new MeetingRoomRequestResponseDto
        {
            Id = mrr.Id,
            UserId = mrr.UserId,
            UserName = mrr.User.Name,
            UserSurname = mrr.User.Surname,
            UserEmail = mrr.User.Email,
            MeetingRoom = mrr.MeetingRoom == MeetingRoomEnum.Tonyukuk ? "tonyukuk" : "atatürk",
            Date = mrr.Date,
            StartTime = mrr.StartTime.ToString(@"hh\:mm"),
            EndTime = mrr.EndTime.ToString(@"hh\:mm"),
            Description = mrr.Description,
            Status = mrr.Status.ToString(),
            CreatedAt = mrr.CreatedAt,
            UpdatedAt = mrr.UpdatedAt
        }).ToList();

        var response = new PagedResultDto<MeetingRoomRequestResponseDto>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };

        return ApiResult<PagedResultDto<MeetingRoomRequestResponseDto>>.Ok(response);
    }

    public async Task<ApiResult<bool>> ApproveMeetingRoomRequestAsync(int requestId)
    {
        var request = await context.MeetingRoomRequests.FindAsync(requestId);

        if (request == null)
        {
            return ApiResult<bool>.NotFound("Toplantı odası talebi bulunamadı");
        }

        if (request.Status != LeaveStatusEnum.Pending)
        {
            return ApiResult<bool>.BadRequest("Sadece bekleyen talepler onaylanabilir");
        }

        request.Status = LeaveStatusEnum.Approved;
        request.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        logger.LogInformation("Meeting room request approved: {Id}", requestId);

        return ApiResult<bool>.Ok(true);
    }

    public async Task<ApiResult<bool>> RejectMeetingRoomRequestAsync(int requestId)
    {
        var request = await context.MeetingRoomRequests.FindAsync(requestId);

        if (request == null)
        {
            return ApiResult<bool>.NotFound("Toplantı odası talebi bulunamadı");
        }

        if (request.Status != LeaveStatusEnum.Pending)
        {
            return ApiResult<bool>.BadRequest("Sadece bekleyen talepler reddedilebilir");
        }

        request.Status = LeaveStatusEnum.Rejected;
        request.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        logger.LogInformation("Meeting room request rejected: {Id}", requestId);

        return ApiResult<bool>.Ok(true);
    }

    public async Task<ApiResult<bool>> UpdateMeetingRoomRequestStatusAsync(int requestId, LeaveStatusEnum newStatus)
    {
        var request = await context.MeetingRoomRequests.FirstOrDefaultAsync(r => r.Id == requestId);
        if (request == null)
        {
            return ApiResult<bool>.NotFound("Toplantı odası talebi bulunamadı");
        }

        // Pending'e alınacaksa çakışma kontrolü yap
        if (newStatus == LeaveStatusEnum.Pending)
        {
            var conflictingRequest = await context.MeetingRoomRequests
                .Where(mrr => mrr.Id != request.Id &&
                             mrr.MeetingRoom == request.MeetingRoom &&
                             mrr.Date.Date == request.Date.Date &&
                             mrr.Status == LeaveStatusEnum.Pending &&
                             ((mrr.StartTime <= request.StartTime && mrr.EndTime > request.StartTime) ||
                              (mrr.StartTime < request.EndTime && mrr.EndTime >= request.EndTime) ||
                              (mrr.StartTime >= request.StartTime && mrr.EndTime <= request.EndTime)))
                .FirstOrDefaultAsync();

            if (conflictingRequest != null)
            {
                return ApiResult<bool>.BadRequest("Bu tarih ve saatte toplantı salonu zaten rezerve edilmiş (bekleyen)");
            }
        }

        request.Status = newStatus;
        request.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        logger.LogInformation("Meeting room request status updated: {Id} -> {Status}", requestId, newStatus);
        return ApiResult<bool>.Ok(true);
    }
}

