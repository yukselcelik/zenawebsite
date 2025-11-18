namespace Zenabackend.Models;

public class EmergencyContact : BaseEntity
{
    public int UserId { get; set; }
    public string FullName { get; set; } = null!;
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public User User { get; set; } = null!;
}
