using Microsoft.EntityFrameworkCore;
using Zenabackend.Models;

namespace Zenabackend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<LeaveRequest> LeaveRequests { get; set; }
    public DbSet<InternshipApplication> InternshipApplications { get; set; }
     public DbSet<ContactInfo> ContactInfos { get; set; }
    public DbSet<EmergencyContact> EmergencyContacts { get; set; }
    public DbSet<EmploymentInfo> EmploymentInfos { get; set; }
    public DbSet<EducationInfo> EducationInfos { get; set; }
    public DbSet<LegalDocument> LegalDocuments { get; set; }
    public DbSet<SocialSecurityDocument> SocialSecurityDocuments { get; set; }
    public DbSet<OffBoarding> OffBoardings { get; set; }
    public DbSet<OffBoardingDocument> OffBoardingDocuments { get; set; }
    public DbSet<RightsAndReceivables> RightsAndReceivables { get; set; }
    public DbSet<EmployeeBenefit> EmployeeBenefits { get; set; }
    public DbSet<ExpenseRequest> ExpenseRequests { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}

