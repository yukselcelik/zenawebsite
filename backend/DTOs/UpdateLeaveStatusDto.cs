using System.ComponentModel.DataAnnotations;

namespace Zenabackend.DTOs;

public class UpdateLeaveStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty; // Pending, Approved, Rejected, Cancelled
}

