using Zenabackend.Enums;

namespace Zenabackend.Models;

public class ArchiveDocument : BaseEntity
{
    public ArchiveDocumentTypeEnum DocumentType { get; set; }
    public string DocumentPath { get; set; } = string.Empty;
    public string OriginalFileName { get; set; } = string.Empty;
    public int? UploadedByUserId { get; set; }
    public User? UploadedByUser { get; set; }
}

