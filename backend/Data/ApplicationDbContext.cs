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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User-LeaveRequest relationship
        // modelBuilder.Entity<LeaveRequest>()
        //     .HasOne(lr => lr.User)
        //     .WithMany()
        //     .HasForeignKey(lr => lr.UserId)
        //     .OnDelete(DeleteBehavior.Cascade);
    }
}

