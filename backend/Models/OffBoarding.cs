using Zenabackend.Enums;

namespace Zenabackend.Models;

public class OffBoarding : BaseEntity
{
    public int UserId { get; set; }
    public DateTime? OffBoardingDate { get; set; }
    public OffBoardingReasonEnum? OffBoardingReason { get; set; }
    public User User { get; set; } = null!;
}

