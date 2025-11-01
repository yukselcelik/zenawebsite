using Microsoft.EntityFrameworkCore;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Models;

namespace Zenabackend.Services;

public class LeaveService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<LeaveService> _logger;

    public LeaveService(ApplicationDbContext context, ILogger<LeaveService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<ApiResult<LeaveRequestResponseDto>> CreateLeaveRequestAsync(int userId, CreateLeaveRequestDto dto)
    {
        // DateTime'ı sadece tarih olarak (time kısmı olmadan) kullan ve Unspecified olarak ayarla
        var startDate = DateTime.SpecifyKind(dto.StartDate.Date, DateTimeKind.Unspecified);
        var endDate = DateTime.SpecifyKind(dto.EndDate.Date, DateTimeKind.Unspecified);

        // Validate dates
        if (startDate >= endDate)
        {
            return ApiResult<LeaveRequestResponseDto>.BadRequest("Başlangıç tarihi bitiş tarihinden önce olmalıdır");
        }

        if (startDate < DateTime.Today)
        {
            return ApiResult<LeaveRequestResponseDto>.BadRequest("Başlangıç tarihi bugünden önce olamaz");
        }

        var now = DateTime.SpecifyKind(DateTime.UtcNow.AddHours(3), DateTimeKind.Unspecified);

        var leaveRequest = new LeaveRequest
        {
            UserId = userId,
            StartDate = startDate,
            EndDate = endDate,
            Reason = dto.Reason,
            Status = LeaveStatus.Pending,
            CreatedAt = now,
            UpdatedAt = now
        };

        _context.LeaveRequests.Add(leaveRequest);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Leave request created: {Id} by user {UserId}", leaveRequest.Id, userId);

        var user = await _context.Users.FindAsync(userId);
        var response = new LeaveRequestResponseDto
        {
            Id = leaveRequest.Id,
            UserId = leaveRequest.UserId,
            UserName = user?.Name ?? string.Empty,
            UserSurname = user?.Surname ?? string.Empty,
            UserEmail = user?.Email ?? string.Empty,
            StartDate = leaveRequest.StartDate,
            EndDate = leaveRequest.EndDate,
            Reason = leaveRequest.Reason,
            Status = leaveRequest.Status,
            CreatedAt = leaveRequest.CreatedAt,
            UpdatedAt = leaveRequest.UpdatedAt
        };

        return ApiResult<LeaveRequestResponseDto>.Ok(response);
    }

    public async Task<ApiResult<PagedResultDto<LeaveRequestResponseDto>>> GetMyLeaveRequestsAsync(int userId, int pageNumber = 1, int pageSize = 10)
    {
        var query = _context.LeaveRequests
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
            StartDate = lr.StartDate,
            EndDate = lr.EndDate,
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
        var query = _context.LeaveRequests
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
            StartDate = lr.StartDate,
            EndDate = lr.EndDate,
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
        var leaveRequest = await _context.LeaveRequests.FindAsync(leaveRequestId);

        if (leaveRequest == null)
        {
            return ApiResult<bool>.NotFound("İzin talebi bulunamadı");
        }

        // Check if user owns the request or is manager
        if (!isManager && leaveRequest.UserId != userId)
        {
            return ApiResult<bool>.Forbidden("Bu izin talebini iptal etme yetkiniz yok");
        }

        // Can only cancel pending requests
        if (leaveRequest.Status != LeaveStatus.Pending)
        {
            return ApiResult<bool>.BadRequest("Sadece bekleyen izin talepleri iptal edilebilir");
        }

        leaveRequest.Status = LeaveStatus.Cancelled;
        leaveRequest.UpdatedAt = DateTime.UtcNow.AddHours(3);

        await _context.SaveChangesAsync();

        _logger.LogInformation("Leave request cancelled: {Id} by user {UserId}", leaveRequestId, userId);

        return ApiResult<bool>.Ok(true);
    }

    public async Task<ApiResult<bool>> ApproveLeaveRequestAsync(int leaveRequestId)
    {
        var leaveRequest = await _context.LeaveRequests.FindAsync(leaveRequestId);

        if (leaveRequest == null)
        {
            return ApiResult<bool>.NotFound("İzin talebi bulunamadı");
        }

        if (leaveRequest.Status != LeaveStatus.Pending)
        {
            return ApiResult<bool>.BadRequest("Sadece bekleyen izin talepleri onaylanabilir");
        }

        leaveRequest.Status = LeaveStatus.Approved;
        leaveRequest.UpdatedAt = DateTime.UtcNow.AddHours(3);

        await _context.SaveChangesAsync();

        _logger.LogInformation("Leave request approved: {Id}", leaveRequestId);

        return ApiResult<bool>.Ok(true);
    }

    public async Task<ApiResult<bool>> RejectLeaveRequestAsync(int leaveRequestId)
    {
        var leaveRequest = await _context.LeaveRequests.FindAsync(leaveRequestId);

        if (leaveRequest == null)
        {
            return ApiResult<bool>.NotFound("İzin talebi bulunamadı");
        }

        if (leaveRequest.Status != LeaveStatus.Pending)
        {
            return ApiResult<bool>.BadRequest("Sadece bekleyen izin talepleri reddedilebilir");
        }

        leaveRequest.Status = LeaveStatus.Rejected;
        leaveRequest.UpdatedAt = DateTime.UtcNow.AddHours(3);

        await _context.SaveChangesAsync();

        _logger.LogInformation("Leave request rejected: {Id}", leaveRequestId);

        return ApiResult<bool>.Ok(true);
    }
}