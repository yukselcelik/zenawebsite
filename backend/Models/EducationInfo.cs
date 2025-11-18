namespace Zenabackend.Models;

public class EducationInfo : BaseEntity
{
    public int UserId { get; set; }
    public string? University { get; set; }
    public string? Department { get; set; }
    public int? GraduationYear { get; set; }
    public string? Certification { get; set; }
    public User User { get; set; } = null!;
}
