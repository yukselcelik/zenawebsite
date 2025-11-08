using System.ComponentModel.DataAnnotations;

namespace Zenabackend.DTOs;

public class UpdateUserApprovalDto
{
    [Required]
    public bool IsApproved { get; set; }
}

