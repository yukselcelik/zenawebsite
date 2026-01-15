using System.ComponentModel;

namespace Zenabackend.Enums;

public enum FoodSupportTypeEnum
{
    [Description("Yemek Kartı")]
    MealCard = 1,
    [Description("Nakit")]
    Cash = 2,
    [Description("Yemekhane")]
    Cafeteria = 3
}



