using Zenabackend.Enums;

namespace Zenabackend.Models;

public class LegalDocument : BaseEntity
{   
    public string? DocumentPath { get; set; }
    public LegalDocumentTypeEnum LegalDocumentType { get; set; }
    public string LegalDocumentTypeName { get; set; } = string.Empty;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}