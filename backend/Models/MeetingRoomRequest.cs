using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Zenabackend.Enums;

namespace Zenabackend.Models;

public class MeetingRoomRequest : BaseEntity
{
    [Required]
    public int UserId { get; set; }
    
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
    
    [Required]
    public MeetingRoomEnum MeetingRoom { get; set; }
    
    [Required]
    public DateTime Date { get; set; }
    
    [Required]
    public TimeSpan StartTime { get; set; }
    
    [Required]
    public TimeSpan EndTime { get; set; }
    
    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public LeaveStatusEnum Status { get; set; } = LeaveStatusEnum.Pending; // İzin durumu enum'ını kullanıyoruz (Pending, Approved, Rejected)
}

