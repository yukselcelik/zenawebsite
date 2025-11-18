using System.ComponentModel;

namespace Zenabackend.Enums;

public enum UserRoleEnum
{
    [Description("Personel")]
    Personel = 0,
    [Description("Yönetici")]
    Manager = 1
}
