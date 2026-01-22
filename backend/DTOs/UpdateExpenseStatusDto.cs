using System.ComponentModel.DataAnnotations;

namespace Zenabackend.DTOs;

public class UpdateExpenseStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty; // Pending, Approved, Rejected, Paid
}

