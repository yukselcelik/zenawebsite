using Microsoft.AspNetCore.Http;
using Zenabackend.Enums;

namespace Zenabackend.DTOs;

public class SocialSecurityDto
{
    public int UserId { get; set; }
    public string? SocialSecurityNumber { get; set; }
    public string TaxNumber { get; set; } = string.Empty;
    public List<SocialSecurityDocumentDto>? Documents { get; set; }
}

public class SocialSecurityDocumentDto
{
    public int Id { get; set; }
    public string? DocumentPath { get; set; }
    public string? DocumentUrl { get; set; }
    public string? OriginalFileName { get; set; }
    public SocialSecurityDocumentType DocumentType { get; set; }
    public string DocumentTypeName { get; set; } = string.Empty;
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateSocialSecurityDto
{
    public int UserId { get; set; }
    public string? SocialSecurityNumber { get; set; }
    public string TaxNumber { get; set; } = string.Empty;
}

public class UpdateSocialSecurityDto
{
    public string? SocialSecurityNumber { get; set; }
    public string TaxNumber { get; set; } = string.Empty;
}

public class CreateSocialSecurityDocumentDto
{
    public int UserId { get; set; }
    public SocialSecurityDocumentType DocumentType { get; set; }
    public IFormFile? File { get; set; }
}

public class UpdateSocialSecurityDocumentDto
{
    public SocialSecurityDocumentType? DocumentType { get; set; }
}

