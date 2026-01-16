using Zenabackend.Enums;

namespace Zenabackend.Models;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? TcNo { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public UserRoleEnum Role { get; set; } = UserRoleEnum.Personel;
    public string? PhotoPath { get; set; }
    public bool IsApproved { get; set; } = false;
    public DateTime? ApprovedAt { get; set; }
    public string? SocialSecurityNumber { get; set; }
    public string TaxNumber { get; set; } = string.Empty;
    public ICollection<ContactInfo>? ContactInfos { get; set; }
    public ICollection<EmergencyContact>? EmergencyContacts { get; set; }
    public ICollection<EmploymentInfo>? EmploymentInfos { get; set; }
    public ICollection<EducationInfo>? EducationInfos { get; set; }
    public ICollection<SocialSecurityDocument>? SocialSecurityDocuments { get; set; }
    public ICollection<LegalDocument>? LegalDocuments { get; set; }
    public OffBoarding? OffBoarding { get; set; }
    public ICollection<OffBoardingDocument>? OffBoardingDocuments { get; set; }
    public RightsAndReceivables? RightsAndReceivables { get; set; }
    public ICollection<EmployeeBenefit>? EmployeeBenefits { get; set; }
}
