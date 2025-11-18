using System.ComponentModel;

namespace Zenabackend.Enums;

public enum LegalDocumentTypeEnum
{
    [Description("Is Sozlesmesi")]
    Contract = 1,
    [Description("Nufus Cuzdani Fotokopisi")]
    IDCard = 2,
    [Description("Adli Sicil Kaydi")]
    PoliceRecord = 3,
    [Description("Diploma Fotokopisi")]
    Diploma = 4,
    [Description("Askerlik Durumu Belgesi")]
    MilitaryStatus = 5,
    [Description("Ikametgah Belgesi")]
    ResidencePermit = 6,
    [Description("Calisma Izni Belgesi")]
    WorkPermit = 7,
    [Description("Vesikalik")]
    Vesikalik = 8,
}
