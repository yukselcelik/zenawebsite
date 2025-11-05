using System.ComponentModel.DataAnnotations;

namespace Zenabackend.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Personel;
    public bool IsApproved { get; set; } = false; // Yönetici onayı gerekli
    public DateTime? ApprovedAt { get; set; } // Onaylanma tarihi
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow.AddHours(3);
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow.AddHours(3);
}

