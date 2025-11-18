

using System.ComponentModel;

namespace Zenabackend.Enums;

public enum SocialSecurityDocumentType
{
    [Description("Sağlık Raporları")]
    HealthDocument = 1,
    [Description("Engellilik/İşe Uygunluk Belgesi")]
    DisabilityDocument = 2,
    [Description("Özel Sağlık Sigortası")]
    SpecialHealthInsurance = 3
}