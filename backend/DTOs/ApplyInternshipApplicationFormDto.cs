using Microsoft.AspNetCore.Http;

namespace Zenabackend.DTOs;

public class ApplyInternshipApplicationFormDto
{
    public IFormFile? CvFile { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? School { get; set; } = string.Empty;
    public string? Department { get; set; } = string.Empty;
    public string? Year { get; set; } = string.Empty;
    public string? Message { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
}