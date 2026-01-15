namespace Zenabackend.DTOs;

public class CreateExpenseRequestDto
{
    public DateTime? RequestDate { get; set; }
    public int ExpenseType { get; set; }
    public decimal RequestedAmount { get; set; }
    public string Description { get; set; } = string.Empty;
}

