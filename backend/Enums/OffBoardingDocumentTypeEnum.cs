using System.ComponentModel;

namespace Zenabackend.Enums;

public enum OffBoardingDocumentTypeEnum
{
    [Description("İşten Ayrılış Belgesi")]
    OffBoardingDocument = 1,
    [Description("Fesih Bildirimi")]
    TerminationNotice = 2,
    [Description("Kapanış Bordrosu")]
    FinalPayroll = 3,
    [Description("İstifa Dilekçesi")]
    ResignationLetter = 4,
    [Description("Kıdem/İhbar Tazminat Belgeleri")]
    SeveranceNoticePayDocuments = 5,
    [Description("İbraname")]
    ReleaseWaiverDocument = 6
}

