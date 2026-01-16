namespace Zenabackend.Models;

public class RightsAndReceivables : BaseEntity
{
    public int UserId { get; set; }
    
    // Ana Bilgiler
    public decimal? NetSalaryAmount { get; set; }
    public decimal? GrossSalaryAmount { get; set; }
    public decimal? AdvancesReceived { get; set; }
    public int? UnusedAnnualLeaveDays { get; set; }
    public decimal? UnusedAnnualLeaveAmount { get; set; }
    public int? OvertimeHours { get; set; }
    public decimal? OvertimeAmount { get; set; }
    
    public User User { get; set; } = null!;
}



