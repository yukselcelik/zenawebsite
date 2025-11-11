namespace Zenabackend.DTOs;

public class InternshipApplicationResponseDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string School { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string? Year { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? CvFilePath { get; set; }
    public DateTime CreatedAt { get; set; }
}

