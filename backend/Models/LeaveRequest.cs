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
    public LeaveTypeEnum LeaveType { get; set; }
    
    [Required]
    public DateTime StartDate { get; set; }
    
    [Required]
    public DateTime EndDate { get; set; }
    
    public int? Days { get; set; } // Yıllık izin için gün sayısı
    
    public int? Hours { get; set; } // Saatlik izin için saat sayısı
    
    [Required]
    [MaxLength(1000)]
    public string Reason { get; set; } = string.Empty;
    
    [Required]
    public LeaveStatusEnum Status { get; set; } = LeaveStatusEnum.Pending;
}