namespace Zenabackend.DTOs;

public class RightsAndReceivablesDto
{
    public int? Id { get; set; }
    public int UserId { get; set; }
    
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
    public string? TravelSupportTypeName { get; set; }
    public string? TravelSupportDescription { get; set; }
    public decimal? TravelSupportAmount { get; set; }
    
    // Yan Haklar - Yemek Desteği
    public int? FoodSupportType { get; set; }
    public string? FoodSupportTypeName { get; set; }
    public decimal? FoodSupportDailyAmount { get; set; }
    public string? FoodSupportCardCompanyInfo { get; set; }
    public string? FoodSupportDescription { get; set; }
    
    // Yan Haklar - Prim
    public int? BonusType { get; set; }
    public string? BonusTypeName { get; set; }
    public int? BonusPaymentPeriod { get; set; }
    public string? BonusPaymentPeriodName { get; set; }
    public decimal? BonusAmount { get; set; }
    public string? BonusDescription { get; set; }
    
    // Yan Haklar - Diğer
    public int? OtherBenefitsPaymentPeriod { get; set; }
    public string? OtherBenefitsPaymentPeriodName { get; set; }
    public decimal? OtherBenefitsAmount { get; set; }
    public string? OtherBenefitsDescription { get; set; }
}

