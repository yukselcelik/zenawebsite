using Microsoft.EntityFrameworkCore;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Enums;
using Zenabackend.Models;

namespace Zenabackend.Services;

public class EmployeeBenefitService(
    ApplicationDbContext context,
    ILogger<EmployeeBenefitService> logger)
{
    public async Task<ApiResult<List<EmployeeBenefitDto>>> GetBenefitsByUserIdAsync(int userId)
    {
        var userExists = await context.Users.AnyAsync(u => u.Id == userId && !u.isDeleted);
        if (!userExists)
        {
            return ApiResult<List<EmployeeBenefitDto>>.NotFound("Kullanıcı bulunamadı");
        }

        var benefits = await context.EmployeeBenefits
            .Where(b => b.UserId == userId && !b.isDeleted)
            .OrderBy(b => b.Order)
            .AsNoTracking()
            .ToListAsync();

        var dtos = benefits.Select(MapToDto).ToList();
        return ApiResult<List<EmployeeBenefitDto>>.Ok(dtos);
    }

    public async Task<ApiResult<List<EmployeeBenefitDto>>> UpsertBenefitsAsync(int userId, List<UpsertEmployeeBenefitDto> upsertDtos)
    {
        var userExists = await context.Users.AnyAsync(u => u.Id == userId && !u.isDeleted);
        if (!userExists)
        {
            return ApiResult<List<EmployeeBenefitDto>>.NotFound("Kullanıcı bulunamadı");
        }

        upsertDtos ??= new List<UpsertEmployeeBenefitDto>();

        var existing = await context.EmployeeBenefits
            .Where(b => b.UserId == userId && !b.isDeleted)
            .ToListAsync();

        var existingById = existing.ToDictionary(x => x.Id, x => x);
        var maxOrder = existing.Count == 0 ? 0 : existing.Max(x => x.Order);

        // Sync behavior: any existing benefit not included in payload will be soft-deleted.
        var idsToKeep = upsertDtos
            .Where(d => d.Id.HasValue)
            .Select(d => d.Id!.Value)
            .ToHashSet();

        foreach (var ex in existing)
        {
            if (!idsToKeep.Contains(ex.Id))
            {
                ex.isDeleted = true;
                ex.UpdatedAt = DateTime.UtcNow.AddHours(3);
            }
        }

        foreach (var dto in upsertDtos)
        {
            EmployeeBenefit model;

            if (dto.Id.HasValue && existingById.TryGetValue(dto.Id.Value, out var found))
            {
                // If it was marked deleted above, revive it since it's in payload
                found.isDeleted = false;
                model = found;
                model.UpdatedAt = DateTime.UtcNow.AddHours(3);
            }
            else
            {
                model = new EmployeeBenefit
                {
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow.AddHours(3),
                    UpdatedAt = DateTime.UtcNow.AddHours(3),
                    Order = dto.Order > 0 ? dto.Order : ++maxOrder
                };
                context.EmployeeBenefits.Add(model);
            }

            // Order (if user explicitly reorders tabs)
            if (dto.Order > 0)
            {
                model.Order = dto.Order;
            }

            // BenefitType
            if (dto.BenefitType.HasValue && Enum.IsDefined(typeof(BenefitTypeEnum), dto.BenefitType.Value))
            {
                model.BenefitType = (BenefitTypeEnum)dto.BenefitType.Value;
            }
            else
            {
                model.BenefitType = null;
            }

            // Custom name only for "Other"
            if (model.BenefitType == BenefitTypeEnum.Other)
            {
                model.CustomBenefitName = string.IsNullOrWhiteSpace(dto.CustomBenefitName) ? null : dto.CustomBenefitName.Trim();
            }
            else
            {
                model.CustomBenefitName = null;
            }

            // Yol Desteği
            if (dto.TravelSupportType.HasValue && Enum.IsDefined(typeof(TravelSupportTypeEnum), dto.TravelSupportType.Value))
            {
                model.TravelSupportType = (TravelSupportTypeEnum)dto.TravelSupportType.Value;
            }
            else
            {
                model.TravelSupportType = null;
            }
            model.TravelSupportDescription = dto.TravelSupportDescription;
            model.TravelSupportAmount = dto.TravelSupportAmount;

            // Yemek Desteği
            if (dto.FoodSupportType.HasValue && Enum.IsDefined(typeof(FoodSupportTypeEnum), dto.FoodSupportType.Value))
            {
                model.FoodSupportType = (FoodSupportTypeEnum)dto.FoodSupportType.Value;
            }
            else
            {
                model.FoodSupportType = null;
            }
            model.FoodSupportDailyAmount = dto.FoodSupportDailyAmount;
            model.FoodSupportCardCompanyInfo = dto.FoodSupportCardCompanyInfo;
            model.FoodSupportDescription = dto.FoodSupportDescription;

            // Prim
            if (dto.BonusType.HasValue && Enum.IsDefined(typeof(BonusTypeEnum), dto.BonusType.Value))
            {
                model.BonusType = (BonusTypeEnum)dto.BonusType.Value;
            }
            else
            {
                model.BonusType = null;
            }

            if (dto.BonusPaymentPeriod.HasValue && Enum.IsDefined(typeof(PaymentPeriodEnum), dto.BonusPaymentPeriod.Value))
            {
                model.BonusPaymentPeriod = (PaymentPeriodEnum)dto.BonusPaymentPeriod.Value;
            }
            else
            {
                model.BonusPaymentPeriod = null;
            }

            model.BonusAmount = dto.BonusAmount;
            model.BonusDescription = dto.BonusDescription;

            // Diğer
            if (dto.OtherBenefitsPaymentPeriod.HasValue && Enum.IsDefined(typeof(PaymentPeriodEnum), dto.OtherBenefitsPaymentPeriod.Value))
            {
                model.OtherBenefitsPaymentPeriod = (PaymentPeriodEnum)dto.OtherBenefitsPaymentPeriod.Value;
            }
            else
            {
                model.OtherBenefitsPaymentPeriod = null;
            }
            model.OtherBenefitsAmount = dto.OtherBenefitsAmount;
            model.OtherBenefitsDescription = dto.OtherBenefitsDescription;
        }

        await context.SaveChangesAsync();

        // Return latest data
        var updated = await context.EmployeeBenefits
            .Where(b => b.UserId == userId && !b.isDeleted)
            .OrderBy(b => b.Order)
            .AsNoTracking()
            .ToListAsync();

        return ApiResult<List<EmployeeBenefitDto>>.Ok(updated.Select(MapToDto).ToList());
    }

    private EmployeeBenefitDto MapToDto(EmployeeBenefit model)
    {
        return new EmployeeBenefitDto
        {
            Id = model.Id,
            UserId = model.UserId,
            Order = model.Order,
            BenefitType = model.BenefitType.HasValue ? (int)model.BenefitType.Value : null,
            BenefitTypeName = model.BenefitType.HasValue ? CommonHelper.GetEnumDescription(model.BenefitType.Value) : null,
            CustomBenefitName = model.CustomBenefitName,

            TravelSupportType = model.TravelSupportType.HasValue ? (int)model.TravelSupportType.Value : null,
            TravelSupportTypeName = model.TravelSupportType.HasValue ? CommonHelper.GetEnumDescription(model.TravelSupportType.Value) : null,
            TravelSupportDescription = model.TravelSupportDescription,
            TravelSupportAmount = model.TravelSupportAmount,

            FoodSupportType = model.FoodSupportType.HasValue ? (int)model.FoodSupportType.Value : null,
            FoodSupportTypeName = model.FoodSupportType.HasValue ? CommonHelper.GetEnumDescription(model.FoodSupportType.Value) : null,
            FoodSupportDailyAmount = model.FoodSupportDailyAmount,
            FoodSupportCardCompanyInfo = model.FoodSupportCardCompanyInfo,
            FoodSupportDescription = model.FoodSupportDescription,

            BonusType = model.BonusType.HasValue ? (int)model.BonusType.Value : null,
            BonusTypeName = model.BonusType.HasValue ? CommonHelper.GetEnumDescription(model.BonusType.Value) : null,
            BonusPaymentPeriod = model.BonusPaymentPeriod.HasValue ? (int)model.BonusPaymentPeriod.Value : null,
            BonusPaymentPeriodName = model.BonusPaymentPeriod.HasValue ? CommonHelper.GetEnumDescription(model.BonusPaymentPeriod.Value) : null,
            BonusAmount = model.BonusAmount,
            BonusDescription = model.BonusDescription,

            OtherBenefitsPaymentPeriod = model.OtherBenefitsPaymentPeriod.HasValue ? (int)model.OtherBenefitsPaymentPeriod.Value : null,
            OtherBenefitsPaymentPeriodName = model.OtherBenefitsPaymentPeriod.HasValue ? CommonHelper.GetEnumDescription(model.OtherBenefitsPaymentPeriod.Value) : null,
            OtherBenefitsAmount = model.OtherBenefitsAmount,
            OtherBenefitsDescription = model.OtherBenefitsDescription
        };
    }
}

