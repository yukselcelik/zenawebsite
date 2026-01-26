using System.ComponentModel;

namespace Zenabackend.Enums;

public enum UserRoleEnum
{
    [Description("Çalışan")]
    Personel = 0,
    [Description("Yönetici")]
    Manager = 1
}
