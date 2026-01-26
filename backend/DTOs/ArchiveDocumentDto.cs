namespace Zenabackend.DTOs;

public class ArchiveDocumentDto
{
    public int? Id { get; set; }
    public int DocumentType { get; set; }
    public string DocumentTypeName { get; set; } = string.Empty;
    public string? DocumentPath { get; set; }
    public string? OriginalFileName { get; set; }
    public int? UploadedByUserId { get; set; }
    public string? UploadedByUserName { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateArchiveDocumentDto
{
    public int DocumentType { get; set; }
}

public class UpdateArchiveDocumentDto
{
    public int DocumentType { get; set; }
}

