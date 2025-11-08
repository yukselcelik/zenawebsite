using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Zenabackend.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? TcNo { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Personel;
    public string? PhotoPath { get; set; }
    public bool IsApproved { get; set; } = false;
    public bool isDeleted { get; set; } = false;
    public DateTime? ApprovedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow.AddHours(3);
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow.AddHours(3);
    public ICollection<ContactInfo>? ContactInfos { get; set; }
    public ICollection<EmergencyContact>? EmergencyContacts { get; set; }
    public ICollection<EmploymentInfo>? EmploymentInfos { get; set; }
    public ICollection<EducationInfo>? EducationInfos { get; set; }
}

public class ContactInfo
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Mail { get; set; }
    public User User { get; set; } = null!;
    public bool isDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow.AddHours(3);
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow.AddHours(3);
}

public class EmergencyContact
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; } = null!;
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public bool isDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow.AddHours(3);
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow.AddHours(3);
    public User User { get; set; } = null!;
}

public class EmploymentInfo
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime StartDate { get; set; }
    public string? Position { get; set; }
    public WorkType WorkType { get; set; } = WorkType.FullTime;
    public ContractType ContractType { get; set; } = ContractType.FixedTerm;
    public string? WorkplaceNumber { get; set; }
    public bool isDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow.AddHours(3);
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow.AddHours(3);
    public User User { get; set; } = null!;
}

public enum WorkType
{
    [Description("Tam Zamanlı")]
    FullTime = 0,
    [Description("Yarı Zamanlı")]
    PartTime = 1
}

public enum ContractType
{
    [Description("Belirli Süreli")]
    FixedTerm = 0,
    [Description("Sürekli")]
    Continuous = 1
}

public class EducationInfo
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? University { get; set; }
    public string? Department { get; set; }
    public int? GraduationYear { get; set; }
    public string? Certification { get; set; }
    public bool isDeleted { get; set; } = false;
    public User User { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow.AddHours(3);
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow.AddHours(3);
}


public static class CommonHelper
{
    public static string GetEnumDescription(Enum enumValue)
    {
        return enumValue.GetType()
            .GetMember(enumValue.ToString())
            .First()
            .GetCustomAttribute<DescriptionAttribute>()?.Description ?? enumValue.ToString();
    }

    public static List<SelectListItem> GetEnumList<T>() where T : Enum
    {
        return Enum.GetValues(typeof(T))
            .Cast<T>()
            .Select(e => new SelectListItem { Value = e.ToString(), Text = GetEnumDescription(e) })
            .ToList();
    }
}