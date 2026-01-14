using System.ComponentModel;

namespace Zenabackend.Enums;

public enum OffBoardingReasonEnum
{
    [Description("İstifa")]
    Resignation = 1,
    [Description("İşveren Feshi")]
    EmployerTermination = 2,
    [Description("Deneme Süresi Feshi")]
    ProbationPeriodTermination = 3,
    [Description("Emeklilik")]
    Retirement = 4,
    [Description("Vefat")]
    Death = 5,
    [Description("İş Kazası/Sağlık Sebebi")]
    WorkAccidentHealthReason = 6,
    [Description("Karşılıklı Anlaşma")]
    MutualAgreement = 7,
    [Description("İkale")]
    Ikale = 8
}

