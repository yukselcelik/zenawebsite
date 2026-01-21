using System.ComponentModel.DataAnnotations;

namespace Zenabackend.DTOs;

public class CreateMeetingRoomRequestDto
{
    [Required]
    public string MeetingRoom { get; set; } = string.Empty; // "tonyukuk" or "atatürk"
    
    [Required]
    public DateTime Date { get; set; }
    
    [Required]
    public string StartTime { get; set; } = string.Empty; // "HH:mm" format
    
    [Required]
    public string EndTime { get; set; } = string.Empty; // "HH:mm" format
    
    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
}

public class MeetingRoomRequestResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string UserSurname { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string MeetingRoom { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

