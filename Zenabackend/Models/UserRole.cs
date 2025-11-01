using System.ComponentModel;

namespace Zenabackend.Models;

public enum UserRole
{
    [Description("Personel")]
    Personel = 0,
    [Description("Yönetici")]
    Manager = 1
}
