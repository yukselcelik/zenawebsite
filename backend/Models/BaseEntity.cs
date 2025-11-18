namespace Zenabackend.Models;

public class BaseEntity
{
    public int Id { get; set; }
    public bool isDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow.AddHours(3);
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow.AddHours(3);
}