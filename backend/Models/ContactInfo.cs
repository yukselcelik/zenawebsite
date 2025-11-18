namespace Zenabackend.Models;

public class ContactInfo : BaseEntity
{
    public int UserId { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Mail { get; set; }
    public User User { get; set; } = null!;
}
