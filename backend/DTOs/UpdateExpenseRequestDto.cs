namespace Zenabackend.DTOs;

public class UpdateExpenseRequestDto
{
    public DateTime? RequestDate { get; set; }
    public decimal? ApprovedAmount { get; set; }
    public string? Department { get; set; }
    public int? PaymentMethod { get; set; }
}

