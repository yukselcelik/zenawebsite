using Microsoft.EntityFrameworkCore;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Models;
using Zenabackend.Enums;

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

        // Yan Haklar - Yol Desteği
        if (updateDto.TravelSupportType.HasValue && Enum.IsDefined(typeof(TravelSupportTypeEnum), updateDto.TravelSupportType.Value))
        {
            rightsAndReceivables.TravelSupportType = (TravelSupportTypeEnum)updateDto.TravelSupportType.Value;
        }
        else
        {
            rightsAndReceivables.TravelSupportType = null;
        }
        rightsAndReceivables.TravelSupportDescription = updateDto.TravelSupportDescription;
        rightsAndReceivables.TravelSupportAmount = updateDto.TravelSupportAmount;

        // Yan Haklar - Yemek Desteği
        if (updateDto.FoodSupportType.HasValue && Enum.IsDefined(typeof(FoodSupportTypeEnum), updateDto.FoodSupportType.Value))
        {
            rightsAndReceivables.FoodSupportType = (FoodSupportTypeEnum)updateDto.FoodSupportType.Value;
        }
        else
        {
            rightsAndReceivables.FoodSupportType = null;
        }
        rightsAndReceivables.FoodSupportDailyAmount = updateDto.FoodSupportDailyAmount;
        rightsAndReceivables.FoodSupportCardCompanyInfo = updateDto.FoodSupportCardCompanyInfo;
        rightsAndReceivables.FoodSupportDescription = updateDto.FoodSupportDescription;

        // Yan Haklar - Prim
        if (updateDto.BonusType.HasValue && Enum.IsDefined(typeof(BonusTypeEnum), updateDto.BonusType.Value))
        {
            rightsAndReceivables.BonusType = (BonusTypeEnum)updateDto.BonusType.Value;
        }
        else
        {
            rightsAndReceivables.BonusType = null;
        }
        if (updateDto.BonusPaymentPeriod.HasValue && Enum.IsDefined(typeof(PaymentPeriodEnum), updateDto.BonusPaymentPeriod.Value))
        {
            rightsAndReceivables.BonusPaymentPeriod = (PaymentPeriodEnum)updateDto.BonusPaymentPeriod.Value;
        }
        else
        {
            rightsAndReceivables.BonusPaymentPeriod = null;
        }
        rightsAndReceivables.BonusAmount = updateDto.BonusAmount;
        rightsAndReceivables.BonusDescription = updateDto.BonusDescription;

        // Yan Haklar - Diğer
        if (updateDto.OtherBenefitsPaymentPeriod.HasValue && Enum.IsDefined(typeof(PaymentPeriodEnum), updateDto.OtherBenefitsPaymentPeriod.Value))
        {
            rightsAndReceivables.OtherBenefitsPaymentPeriod = (PaymentPeriodEnum)updateDto.OtherBenefitsPaymentPeriod.Value;
        }
        else
        {
            rightsAndReceivables.OtherBenefitsPaymentPeriod = null;
        }
        rightsAndReceivables.OtherBenefitsAmount = updateDto.OtherBenefitsAmount;
        rightsAndReceivables.OtherBenefitsDescription = updateDto.OtherBenefitsDescription;

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
            OvertimeAmount = model.OvertimeAmount,
            TravelSupportType = model.TravelSupportType.HasValue ? (int)model.TravelSupportType.Value : null,
            TravelSupportTypeName = model.TravelSupportType.HasValue 
                ? CommonHelper.GetEnumDescription(model.TravelSupportType.Value) 
                : null,
            TravelSupportDescription = model.TravelSupportDescription,
            TravelSupportAmount = model.TravelSupportAmount,
            FoodSupportType = model.FoodSupportType.HasValue ? (int)model.FoodSupportType.Value : null,
            FoodSupportTypeName = model.FoodSupportType.HasValue 
                ? CommonHelper.GetEnumDescription(model.FoodSupportType.Value) 
                : null,
            FoodSupportDailyAmount = model.FoodSupportDailyAmount,
            FoodSupportCardCompanyInfo = model.FoodSupportCardCompanyInfo,
            FoodSupportDescription = model.FoodSupportDescription,
            BonusType = model.BonusType.HasValue ? (int)model.BonusType.Value : null,
            BonusTypeName = model.BonusType.HasValue 
                ? CommonHelper.GetEnumDescription(model.BonusType.Value) 
                : null,
            BonusPaymentPeriod = model.BonusPaymentPeriod.HasValue ? (int)model.BonusPaymentPeriod.Value : null,
            BonusPaymentPeriodName = model.BonusPaymentPeriod.HasValue 
                ? CommonHelper.GetEnumDescription(model.BonusPaymentPeriod.Value) 
                : null,
            BonusAmount = model.BonusAmount,
            BonusDescription = model.BonusDescription,
            OtherBenefitsPaymentPeriod = model.OtherBenefitsPaymentPeriod.HasValue ? (int)model.OtherBenefitsPaymentPeriod.Value : null,
            OtherBenefitsPaymentPeriodName = model.OtherBenefitsPaymentPeriod.HasValue 
                ? CommonHelper.GetEnumDescription(model.OtherBenefitsPaymentPeriod.Value) 
                : null,
            OtherBenefitsAmount = model.OtherBenefitsAmount,
            OtherBenefitsDescription = model.OtherBenefitsDescription
        };
    }
}

