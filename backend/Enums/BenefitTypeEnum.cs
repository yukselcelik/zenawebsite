using System.ComponentModel;

namespace Zenabackend.Enums;

public enum BenefitTypeEnum
{
    [Description("Yemek")]
    Food = 1,
    
    [Description("Yol")]
    Travel = 2,
    
    [Description("Prim")]
    Bonus = 3,
    
    [Description("Diğer")]
    Other = 4
}

