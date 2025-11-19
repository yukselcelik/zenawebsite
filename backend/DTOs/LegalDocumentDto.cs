using Microsoft.AspNetCore.Http;
using Zenabackend.Enums;

namespace Zenabackend.DTOs;

public class LegalDocumentDto
{
    public int UserId { get; set; }
    public List<LegalDocumentItemDto>? Documents { get; set; }
}

public class LegalDocumentItemDto
{
    public int Id { get; set; }
    public string? DocumentPath { get; set; }
    public string? DocumentUrl { get; set; }
    public string? OriginalFileName { get; set; }
    public LegalDocumentTypeEnum LegalDocumentType { get; set; }
    public string LegalDocumentTypeName { get; set; } = string.Empty;
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateLegalDocumentDto
{
    public int UserId { get; set; }
    public LegalDocumentTypeEnum LegalDocumentType { get; set; }
    public IFormFile? File { get; set; }
}

public class UpdateLegalDocumentDto
{
    public LegalDocumentTypeEnum? LegalDocumentType { get; set; }
}

