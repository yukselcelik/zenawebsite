using System.ComponentModel;

namespace Zenabackend.Enums;

public enum TravelSupportTypeEnum
{
    [Description("Nakit")]
    Cash = 1,
    [Description("Servis")]
    Service = 2,
    [Description("Şirket Aracı")]
    CompanyVehicle = 3,
    [Description("Yok")]
    None = 4
}



