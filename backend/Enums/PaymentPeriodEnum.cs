using System.ComponentModel;

namespace Zenabackend.Enums;

public enum PaymentPeriodEnum
{
    [Description("Aylık")]
    Monthly = 1,
    [Description("Üç Aylık")]
    Quarterly = 2,
    [Description("Yıllık")]
    Yearly = 3,
    [Description("Düzensiz")]
    Irregular = 4
}



