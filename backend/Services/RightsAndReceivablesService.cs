using Microsoft.EntityFrameworkCore;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Models;

namespace Zenabackend.Services;

public class RightsAndReceivablesService(
    ApplicationDbContext context,
    ILogger<RightsAndReceivablesService> logger)
{
    public async Task<ApiResult<RightsAndReceivablesDto>> GetRightsAndReceivablesByUserIdAsync(int userId)
    {
        var user = await context.Users
            .Include(u => u.RightsAndReceivables)
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId && !u.isDeleted);

        if (user == null)
        {
            return ApiResult<RightsAndReceivablesDto>.NotFound("Kullanıcı bulunamadı");
        }

        if (user.RightsAndReceivables == null || user.RightsAndReceivables.isDeleted)
        {
            return ApiResult<RightsAndReceivablesDto>.Ok(null);
        }

        var dto = MapToDto(user.RightsAndReceivables);
        return ApiResult<RightsAndReceivablesDto>.Ok(dto);
    }

    public async Task<ApiResult<RightsAndReceivablesDto>> CreateOrUpdateRightsAndReceivablesAsync(
        int userId, 
        UpdateRightsAndReceivablesDto updateDto)
    {
        var user = await context.Users
            .Include(u => u.RightsAndReceivables)
            .FirstOrDefaultAsync(u => u.Id == userId && !u.isDeleted);

        if (user == null)
        {
            return ApiResult<RightsAndReceivablesDto>.NotFound("Kullanıcı bulunamadı");
        }

        RightsAndReceivables rightsAndReceivables;

        if (user.RightsAndReceivables == null || user.RightsAndReceivables.isDeleted)
        {
            rightsAndReceivables = new RightsAndReceivables
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow.AddHours(3),
                UpdatedAt = DateTime.UtcNow.AddHours(3)
            };
            context.RightsAndReceivables.Add(rightsAndReceivables);
            logger.LogInformation("RightsAndReceivables created for user {UserId}", userId);
        }
        else
        {
            rightsAndReceivables = user.RightsAndReceivables;
            rightsAndReceivables.UpdatedAt = DateTime.UtcNow.AddHours(3);
            logger.LogInformation("RightsAndReceivables updated for user {UserId}", userId);
        }

        // Ana Bilgiler
        rightsAndReceivables.NetSalaryAmount = updateDto.NetSalaryAmount;
        rightsAndReceivables.GrossSalaryAmount = updateDto.GrossSalaryAmount;
        rightsAndReceivables.AdvancesReceived = updateDto.AdvancesReceived;
        rightsAndReceivables.UnusedAnnualLeaveDays = updateDto.UnusedAnnualLeaveDays;
        rightsAndReceivables.UnusedAnnualLeaveAmount = updateDto.UnusedAnnualLeaveAmount;
        rightsAndReceivables.OvertimeHours = updateDto.OvertimeHours;
        rightsAndReceivables.OvertimeAmount = updateDto.OvertimeAmount;

        await context.SaveChangesAsync();

        var dto = MapToDto(rightsAndReceivables);
        return ApiResult<RightsAndReceivablesDto>.Ok(dto);
    }

    private RightsAndReceivablesDto MapToDto(RightsAndReceivables model)
    {
        return new RightsAndReceivablesDto
        {
            Id = model.Id,
            UserId = model.UserId,
            NetSalaryAmount = model.NetSalaryAmount,
            GrossSalaryAmount = model.GrossSalaryAmount,
            AdvancesReceived = model.AdvancesReceived,
            UnusedAnnualLeaveDays = model.UnusedAnnualLeaveDays,
            UnusedAnnualLeaveAmount = model.UnusedAnnualLeaveAmount,
            OvertimeHours = model.OvertimeHours,
            OvertimeAmount = model.OvertimeAmount
        };
    }
}

