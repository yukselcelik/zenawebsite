using Microsoft.EntityFrameworkCore;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Enums;
using Zenabackend.Models;

namespace Zenabackend.Services;

public class OtherRequestService(ApplicationDbContext context, ILogger<OtherRequestService> logger)
{
    public async Task<ApiResult<OtherRequestResponseDto>> CreateOtherRequestAsync(int userId, CreateOtherRequestDto dto)
    {
        var now = DateTime.UtcNow;

        var otherRequest = new OtherRequest
        {
            UserId = userId,
            Title = dto.Title.Trim(),
            Description = dto.Description.Trim(),
            Status = LeaveStatusEnum.Pending,
            CreatedAt = now,
            UpdatedAt = now
        };

        context.OtherRequests.Add(otherRequest);
        await context.SaveChangesAsync();

        logger.LogInformation("Other request created: {Id} by user {UserId}", otherRequest.Id, userId);

        var user = await context.Users.FindAsync(userId);
        var response = new OtherRequestResponseDto
        {
            Id = otherRequest.Id,
            UserId = otherRequest.UserId,
            UserName = user?.Name ?? string.Empty,
            UserSurname = user?.Surname ?? string.Empty,
            UserEmail = user?.Email ?? string.Empty,
            Title = otherRequest.Title,
            Description = otherRequest.Description,
            Status = otherRequest.Status,
            CreatedAt = otherRequest.CreatedAt,
            UpdatedAt = otherRequest.UpdatedAt
        };

        return ApiResult<OtherRequestResponseDto>.Ok(response);
    }

    public async Task<ApiResult<PagedResultDto<OtherRequestResponseDto>>> GetMyOtherRequestsAsync(int userId, int pageNumber = 1, int pageSize = 10)
    {
        var query = context.OtherRequests
            .AsNoTracking()
            .Include(or => or.User)
            .Where(or => or.UserId == userId && !or.isDeleted)
            .OrderByDescending(or => or.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var otherRequests = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = otherRequests.Select(or => new OtherRequestResponseDto
        {
            Id = or.Id,
            UserId = or.UserId,
            UserName = or.User.Name,
            UserSurname = or.User.Surname,
            UserEmail = or.User.Email,
            Title = or.Title,
            Description = or.Description,
            Status = or.Status,
            CreatedAt = or.CreatedAt,
            UpdatedAt = or.UpdatedAt
        }).ToList();

        var response = new PagedResultDto<OtherRequestResponseDto>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };

        return ApiResult<PagedResultDto<OtherRequestResponseDto>>.Ok(response);
    }

    public async Task<ApiResult<PagedResultDto<OtherRequestResponseDto>>> GetAllOtherRequestsAsync(int pageNumber = 1, int pageSize = 10)
    {
        var query = context.OtherRequests
            .AsNoTracking()
            .Include(or => or.User)
            .Where(or => !or.isDeleted)
            .OrderByDescending(or => or.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var otherRequests = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = otherRequests.Select(or => new OtherRequestResponseDto
        {
            Id = or.Id,
            UserId = or.UserId,
            UserName = or.User.Name,
            UserSurname = or.User.Surname,
            UserEmail = or.User.Email,
            Title = or.Title,
            Description = or.Description,
            Status = or.Status,
            CreatedAt = or.CreatedAt,
            UpdatedAt = or.UpdatedAt
        }).ToList();

        var response = new PagedResultDto<OtherRequestResponseDto>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };

        return ApiResult<PagedResultDto<OtherRequestResponseDto>>.Ok(response);
    }

    public async Task<ApiResult<bool>> DeleteOtherRequestAsync(int requestId, int actingUserId, bool isManager)
    {
        var req = await context.OtherRequests.FirstOrDefaultAsync(r => r.Id == requestId && !r.isDeleted);
        if (req == null)
        {
            return ApiResult<bool>.NotFound("Diğer talep bulunamadı");
        }

        if (!isManager && req.UserId != actingUserId)
        {
            return ApiResult<bool>.Forbidden("Bu talebi silme yetkiniz yok");
        }

        // Personel sadece bekleyen talebini silebilsin
        if (!isManager && req.Status != LeaveStatusEnum.Pending)
        {
            return ApiResult<bool>.BadRequest("Sadece beklemede olan talepler silinebilir");
        }

        req.isDeleted = true;
        req.Status = LeaveStatusEnum.Cancelled;
        req.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        logger.LogInformation("Other request deleted: {Id} by user {UserId} (isManager={IsManager})", requestId, actingUserId, isManager);
        return ApiResult<bool>.Ok(true);
    }
}

