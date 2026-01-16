namespace Zenabackend.DTOs;

public class UpsertEmployeeBenefitDto
{
    public int? Id { get; set; }
    public int Order { get; set; }

    public int? BenefitType { get; set; }
    public string? CustomBenefitName { get; set; }

    // Yol Desteği
    public int? TravelSupportType { get; set; }
    public string? TravelSupportDescription { get; set; }
    public decimal? TravelSupportAmount { get; set; }

    // Yemek Desteği
    public int? FoodSupportType { get; set; }
    public decimal? FoodSupportDailyAmount { get; set; }
    public string? FoodSupportCardCompanyInfo { get; set; }
    public string? FoodSupportDescription { get; set; }

    // Prim
    public int? BonusType { get; set; }
    public int? BonusPaymentPeriod { get; set; }
    public decimal? BonusAmount { get; set; }
    public string? BonusDescription { get; set; }

    // Diğer
    public int? OtherBenefitsPaymentPeriod { get; set; }
    public decimal? OtherBenefitsAmount { get; set; }
    public string? OtherBenefitsDescription { get; set; }
}

