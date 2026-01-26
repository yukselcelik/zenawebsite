using Zenabackend.Enums;

namespace Zenabackend.Models;

public class ExpenseRequest : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string RequestNumber { get; set; } = string.Empty; // 001, 002, etc.
    public DateTime RequestDate { get; set; }
    public ExpenseTypeEnum ExpenseType { get; set; }
    public decimal RequestedAmount { get; set; }
    public decimal? ApprovedAmount { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Department { get; set; } // İlgili Şirket – Departman
    public string? DocumentPath { get; set; } // Fatura/Fiş/Belge dosya yolu
    public string? OriginalFileName { get; set; } // Orijinal dosya adı
    public ExpenseStatusEnum Status { get; set; } = ExpenseStatusEnum.Pending;
    public DateTime? ApprovedAt { get; set; }
    public DateTime? RejectedAt { get; set; }
    public string? RejectionReason { get; set; } // Reddetme nedeni
    public DateTime? PaidAt { get; set; }
    public PaymentMethodEnum? PaymentMethod { get; set; }
    public int? ApprovedByUserId { get; set; } // Onaylayan yönetici
    public User? ApprovedByUser { get; set; }
}

