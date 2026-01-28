namespace Zenabackend.DTOs;

public class ReportDto
{
    public int Id { get; set; }
    public int ReportType { get; set; }
    public string ReportTypeName { get; set; } = string.Empty;
    public string DocumentPath { get; set; } = string.Empty;
    public string OriginalFileName { get; set; } = string.Empty;
    public int UploadedByUserId { get; set; }
    public string? UploadedByUserName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
