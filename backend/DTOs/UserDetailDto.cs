namespace Zenabackend.DTOs;

public class UserDetailDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? TcNo { get; set; }
    public string? PhotoPath { get; set; }
    public string Role { get; set; } = string.Empty;
    public bool IsApproved { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<ContactInfoDto>? ContactInfos { get; set; }
    public List<EmergencyContactDto>? EmergencyContacts { get; set; }
    public List<EmploymentInfoDto>? EmploymentInfos { get; set; }
    public List<EducationInfoDto>? EducationInfos { get; set; }
    public SocialSecurityDto? SocialSecurity { get; set; }
    public List<SocialSecurityDocumentDto>? SocialSecurityDocuments { get; set; }
}

public class ContactInfoDto
{
    public int Id { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Mail { get; set; }
}

public class EmergencyContactDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
}

public class EmploymentInfoDto
{
    public int Id { get; set; }
    public DateTime StartDate { get; set; }
    public string? Position { get; set; }
    public string WorkType { get; set; } = string.Empty;
    public string ContractType { get; set; } = string.Empty;
    public string? WorkplaceNumber { get; set; }
}

public class EducationInfoDto
{
    public int Id { get; set; }
    public string? University { get; set; }
    public string? Department { get; set; }
    public int? GraduationYear { get; set; }
    public string? Certification { get; set; }
}

