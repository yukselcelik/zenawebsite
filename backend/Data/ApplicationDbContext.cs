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
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}

