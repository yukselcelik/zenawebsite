using Zenabackend.Enums;

namespace Zenabackend.Models;

public class EmployeeBenefit : BaseEntity
{
    public int UserId { get; set; }

    // UI order for tabs
    public int Order { get; set; } = 0;

    // High-level type: Yemek / Yol / Prim / Diğer
    public BenefitTypeEnum? BenefitType { get; set; }

    // Only for BenefitType = Other: custom type name to show on tab title
    public string? CustomBenefitName { get; set; }

    // Yol Desteği
    public TravelSupportTypeEnum? TravelSupportType { get; set; }
    public string? TravelSupportDescription { get; set; }
    public decimal? TravelSupportAmount { get; set; }

    // Yemek Desteği
    public FoodSupportTypeEnum? FoodSupportType { get; set; }
    public decimal? FoodSupportDailyAmount { get; set; }
    public string? FoodSupportCardCompanyInfo { get; set; }
    public string? FoodSupportDescription { get; set; }

    // Prim
    public BonusTypeEnum? BonusType { get; set; }
    public PaymentPeriodEnum? BonusPaymentPeriod { get; set; }
    public decimal? BonusAmount { get; set; }
    public string? BonusDescription { get; set; }

    // Diğer
    public PaymentPeriodEnum? OtherBenefitsPaymentPeriod { get; set; }
    public decimal? OtherBenefitsAmount { get; set; }
    public string? OtherBenefitsDescription { get; set; }

    public User User { get; set; } = null!;
}

