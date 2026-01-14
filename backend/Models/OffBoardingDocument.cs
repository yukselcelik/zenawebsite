using Zenabackend.Enums;

namespace Zenabackend.Models;

public class OffBoardingDocument : BaseEntity
{
    public string? DocumentPath { get; set; }
    public string? OriginalFileName { get; set; }
    public OffBoardingDocumentTypeEnum DocumentType { get; set; }
    public string DocumentTypeName { get; set; } = string.Empty;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}

