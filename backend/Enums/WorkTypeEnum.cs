using System.ComponentModel;

namespace Zenabackend.Enums;

public enum WorkTypeEnum
{
    [Description("Tam Zamanlı")]
    FullTime = 0,
    [Description("Yarı Zamanlı")]
    PartTime = 1
}
