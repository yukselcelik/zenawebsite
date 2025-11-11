namespace Zenabackend.DTOs;

public class UpdateUserDto
{
    public string? Name { get; set; }
    public string? Surname { get; set; }
    public string? Phone { get; set; }
    public string? PhotoPath { get; set; }
    public string? TcNo { get; set; } // Personel kendi TcNo bilgisini güncelleyebilir, yönetici herkes için güncelleyebilir
    public string? Role { get; set; } // Sadece yönetici güncelleyebilir: "Manager" | "Personel"
    public List<ContactInfoDto>? ContactInfos { get; set; }
    public List<EmergencyContactDto>? EmergencyContacts { get; set; }
    public List<EducationInfoDto>? EducationInfos { get; set; }
    // Note: Email, TcNo, Role, IsApproved gibi alanlar sadece yönetici tarafından değiştirilebilir
}

public class CreateEmploymentInfoDto
{
    public int UserId { get; set; }
    public DateTime StartDate { get; set; }
    public string? Position { get; set; }
    public string WorkType { get; set; } = string.Empty;
    public string ContractType { get; set; } = string.Empty;
    public string? WorkplaceNumber { get; set; }
}

public class UpdateEmploymentInfoDto
{
    public DateTime? StartDate { get; set; }
    public string? Position { get; set; }
    public string? WorkType { get; set; }
    public string? ContractType { get; set; }
    public string? WorkplaceNumber { get; set; }
}

