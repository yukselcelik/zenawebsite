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
}



