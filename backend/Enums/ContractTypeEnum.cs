using System.ComponentModel;
namespace Zenabackend.Enums;

public enum ContractTypeEnum
{
    [Description("Belirli Süreli")]
    FixedTerm = 0,
    [Description("Sürekli")]
    Continuous = 1
}

