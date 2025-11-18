using Zenabackend.Enums;

namespace Zenabackend.Models;

public class EmploymentInfo : BaseEntity
{
    public int UserId { get; set; }
    public DateTime StartDate { get; set; }
    public string? Position { get; set; }
    public WorkTypeEnum WorkType { get; set; } = WorkTypeEnum.FullTime;
    public ContractTypeEnum ContractType { get; set; } = ContractTypeEnum.FixedTerm;
    public string? WorkplaceNumber { get; set; }
    public User User { get; set; } = null!;
}

