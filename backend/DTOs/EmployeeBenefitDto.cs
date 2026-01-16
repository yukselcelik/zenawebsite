namespace Zenabackend.DTOs;

public class EmployeeBenefitDto
{
    public int? Id { get; set; }
    public int UserId { get; set; }
    public int Order { get; set; }

    public int? BenefitType { get; set; }
    public string? BenefitTypeName { get; set; }
    public string? CustomBenefitName { get; set; }

    // Yol Desteği
    public int? TravelSupportType { get; set; }
    public string? TravelSupportTypeName { get; set; }
    public string? TravelSupportDescription { get; set; }
    public decimal? TravelSupportAmount { get; set; }

    // Yemek Desteği
    public int? FoodSupportType { get; set; }
    public string? FoodSupportTypeName { get; set; }
    public decimal? FoodSupportDailyAmount { get; set; }
    public string? FoodSupportCardCompanyInfo { get; set; }
    public string? FoodSupportDescription { get; set; }

    // Prim
    public int? BonusType { get; set; }
    public string? BonusTypeName { get; set; }
    public int? BonusPaymentPeriod { get; set; }
    public string? BonusPaymentPeriodName { get; set; }
    public decimal? BonusAmount { get; set; }
    public string? BonusDescription { get; set; }

    // Diğer
    public int? OtherBenefitsPaymentPeriod { get; set; }
    public string? OtherBenefitsPaymentPeriodName { get; set; }
    public decimal? OtherBenefitsAmount { get; set; }
    public string? OtherBenefitsDescription { get; set; }
}

