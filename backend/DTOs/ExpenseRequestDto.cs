using Zenabackend.Enums;

namespace Zenabackend.DTOs;

public class ExpenseRequestDto
{
    public int? Id { get; set; }
    public int UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserSurname { get; set; }
    public string RequestNumber { get; set; } = string.Empty;
    public DateTime RequestDate { get; set; }
    public int ExpenseType { get; set; }
    public string? ExpenseTypeName { get; set; }
    public decimal RequestedAmount { get; set; }
    public decimal? ApprovedAmount { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Department { get; set; }
    public string? DocumentPath { get; set; }
    public string? OriginalFileName { get; set; }
    public int Status { get; set; }
    public string? StatusName { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public DateTime? RejectedAt { get; set; }
    public string? RejectionReason { get; set; } // Reddetme nedeni
    public DateTime? PaidAt { get; set; }
    public int? PaymentMethod { get; set; }
    public string? PaymentMethodName { get; set; }
    public int? ApprovedByUserId { get; set; }
    public string? ApprovedByUserName { get; set; }
}

