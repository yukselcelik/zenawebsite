namespace Zenabackend.DTOs;

public class UpdateRightsAndReceivablesDto
{
    // Ana Bilgiler
    public decimal? NetSalaryAmount { get; set; }
    public decimal? GrossSalaryAmount { get; set; }
    public decimal? AdvancesReceived { get; set; }
    public int? UnusedAnnualLeaveDays { get; set; }
    public decimal? UnusedAnnualLeaveAmount { get; set; }
    public int? OvertimeHours { get; set; }
    public decimal? OvertimeAmount { get; set; }
    
    // Yan Haklar - Yol Desteği
    public int? TravelSupportType { get; set; }
    public string? TravelSupportDescription { get; set; }
    public decimal? TravelSupportAmount { get; set; }
    
    // Yan Haklar - Yemek Desteği
    public int? FoodSupportType { get; set; }
    public decimal? FoodSupportDailyAmount { get; set; }
    public string? FoodSupportCardCompanyInfo { get; set; }
    public string? FoodSupportDescription { get; set; }
    
    // Yan Haklar - Prim
    public int? BonusType { get; set; }
    public int? BonusPaymentPeriod { get; set; }
    public decimal? BonusAmount { get; set; }
    public string? BonusDescription { get; set; }
    
    // Yan Haklar - Diğer
    public int? OtherBenefitsPaymentPeriod { get; set; }
    public decimal? OtherBenefitsAmount { get; set; }
    public string? OtherBenefitsDescription { get; set; }
}



