using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Zenabackend.Enums;

namespace Zenabackend.Models;

public class LeaveRequest : BaseEntity
{
    
    [Required]
    public int UserId { get; set; }
    
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
    
    [Required]
    public DateTime StartDate { get; set; }
    
    [Required]
    public DateTime EndDate { get; set; }
    
    [Required]
    [MaxLength(1000)]
    public string Reason { get; set; } = string.Empty;
    
    [Required]
    public LeaveStatusEnum Status { get; set; } = LeaveStatusEnum.Pending;
}