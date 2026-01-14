using Zenabackend.Enums;

namespace Zenabackend.DTOs;

public class OffBoardingDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime? OffBoardingDate { get; set; }
    public OffBoardingReasonEnum? OffBoardingReason { get; set; }
    public string? OffBoardingReasonName { get; set; }
    public bool IsActive { get; set; }
    public List<OffBoardingDocumentDto>? Documents { get; set; }
}

public class OffBoardingDocumentDto
{
    public int Id { get; set; }
    public string? DocumentPath { get; set; }
    public string? DocumentUrl { get; set; }
    public string? OriginalFileName { get; set; }
    public OffBoardingDocumentTypeEnum DocumentType { get; set; }
    public string DocumentTypeName { get; set; } = string.Empty;
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateOffBoardingDto
{
    public int UserId { get; set; }
    public DateTime? OffBoardingDate { get; set; }
    public OffBoardingReasonEnum? OffBoardingReason { get; set; }
}

public class UpdateOffBoardingDto
{
    public DateTime? OffBoardingDate { get; set; }
    public OffBoardingReasonEnum? OffBoardingReason { get; set; }
}

public class CreateOffBoardingDocumentDto
{
    public int UserId { get; set; }
    public OffBoardingDocumentTypeEnum DocumentType { get; set; }
    public Microsoft.AspNetCore.Http.IFormFile? File { get; set; }
}

