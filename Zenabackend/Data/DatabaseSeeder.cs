using Microsoft.EntityFrameworkCore;
using Zenabackend.Models;

namespace Zenabackend.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        try
        {
            // Admin kullanıcısı kontrolü ve ekleme
            if (!await context.Users.AnyAsync(u => u.Role == UserRole.Manager))
            {
                var adminUser = new User
                {
                    Email = "admin@zena.com",
                    Name = "Admin",
                    Surname = "User",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                    Role = UserRole.Manager,
                    IsApproved = true, // Yöneticiler her zaman onaylı
                    CreatedAt = DateTime.UtcNow.AddHours(3),
                    UpdatedAt = DateTime.UtcNow.AddHours(3)
                };

                context.Users.Add(adminUser);
                await context.SaveChangesAsync();

                logger.LogInformation("Default admin user created: admin@zena.com / Admin123!");
            }

            // Personel kullanıcıları ekle (2 adet)
            var personelCount = await context.Users.CountAsync(u => u.Role == UserRole.Personel);
            
            if (personelCount < 2)
            {
                var personel1 = new User
                {
                    Email = "personel1@zena.com",
                    Name = "Ahmet",
                    Surname = "Yılmaz",
                    Phone = "05551234567",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Personel123!"),
                    Role = UserRole.Personel,
                    IsApproved = true, // Onaylanmış personel
                    ApprovedAt = DateTime.UtcNow.AddHours(3).AddDays(-28),
                    CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-30),
                    UpdatedAt = DateTime.UtcNow.AddHours(3).AddDays(-28)
                };

                var personel2 = new User
                {
                    Email = "personel2@zena.com",
                    Name = "Ayşe",
                    Surname = "Demir",
                    Phone = "05559876543",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Personel123!"),
                    Role = UserRole.Personel,
                    IsApproved = true, // Onaylanmış personel
                    ApprovedAt = DateTime.UtcNow.AddHours(3).AddDays(-23),
                    CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-25),
                    UpdatedAt = DateTime.UtcNow.AddHours(3).AddDays(-23)
                };

                context.Users.AddRange(personel1, personel2);
                await context.SaveChangesAsync();

                logger.LogInformation("Dummy personel users created");

                // Her personel için 3 izin talebi ekle
                var personelUsers = await context.Users
                    .Where(u => u.Role == UserRole.Personel && u.IsApproved)
                    .OrderBy(u => u.CreatedAt)
                    .ToListAsync();

                if (personelUsers.Count >= 2)
                {
                    var leaveRequests = new List<LeaveRequest>();

                    // Personel1 için 3 izin talebi
                    var personel1Id = personelUsers[0].Id;
                    leaveRequests.Add(new LeaveRequest
                    {
                        UserId = personel1Id,
                        StartDate = DateTime.Today.AddDays(5),
                        EndDate = DateTime.Today.AddDays(7),
                        Reason = "Aile ziyareti için izin talebi",
                        Status = LeaveStatus.Pending,
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-10),
                        UpdatedAt = DateTime.UtcNow.AddHours(3).AddDays(-10)
                    });

                    leaveRequests.Add(new LeaveRequest
                    {
                        UserId = personel1Id,
                        StartDate = DateTime.Today.AddDays(-15),
                        EndDate = DateTime.Today.AddDays(-12),
                        Reason = "Sağlık kontrolü için izin",
                        Status = LeaveStatus.Approved,
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-20),
                        UpdatedAt = DateTime.UtcNow.AddHours(3).AddDays(-15)
                    });

                    leaveRequests.Add(new LeaveRequest
                    {
                        UserId = personel1Id,
                        StartDate = DateTime.Today.AddDays(-30),
                        EndDate = DateTime.Today.AddDays(-28),
                        Reason = "Kişisel nedenler",
                        Status = LeaveStatus.Rejected,
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-35),
                        UpdatedAt = DateTime.UtcNow.AddHours(3).AddDays(-32)
                    });

                    // Personel2 için 3 izin talebi
                    var personel2Id = personelUsers[1].Id;
                    leaveRequests.Add(new LeaveRequest
                    {
                        UserId = personel2Id,
                        StartDate = DateTime.Today.AddDays(10),
                        EndDate = DateTime.Today.AddDays(12),
                        Reason = "Tatil planı için izin talebi",
                        Status = LeaveStatus.Pending,
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-8),
                        UpdatedAt = DateTime.UtcNow.AddHours(3).AddDays(-8)
                    });

                    leaveRequests.Add(new LeaveRequest
                    {
                        UserId = personel2Id,
                        StartDate = DateTime.Today.AddDays(-10),
                        EndDate = DateTime.Today.AddDays(-8),
                        Reason = "Ev taşıma işlemleri",
                        Status = LeaveStatus.Approved,
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-18),
                        UpdatedAt = DateTime.UtcNow.AddHours(3).AddDays(-12)
                    });

                    leaveRequests.Add(new LeaveRequest
                    {
                        UserId = personel2Id,
                        StartDate = DateTime.Today.AddDays(-25),
                        EndDate = DateTime.Today.AddDays(-23),
                        Reason = "Acil durum izni",
                        Status = LeaveStatus.Cancelled,
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-28),
                        UpdatedAt = DateTime.UtcNow.AddHours(3).AddDays(-26)
                    });

                    context.LeaveRequests.AddRange(leaveRequests);
                    await context.SaveChangesAsync();

                    logger.LogInformation("Dummy leave requests created: {Count}", leaveRequests.Count);
                }
            }

            // Staj başvuruları ekle (3 adet)
            var internshipCount = await context.InternshipApplications.CountAsync();
            
            if (internshipCount < 3)
            {
                var internshipApplications = new List<InternshipApplication>
                {
                    new InternshipApplication
                    {
                        FullName = "Mehmet Kaya",
                        Email = "mehmet.kaya@university.edu.tr",
                        Phone = "05321234567",
                        School = "İstanbul Teknik Üniversitesi",
                        Department = "Elektrik Mühendisliği",
                        Year = "3. Sınıf",
                        Message = "Yaz dönemi için staj başvurusu yapmak istiyorum. Güneş enerjisi konusunda deneyim kazanmak istiyorum.",
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-15)
                    },
                    new InternshipApplication
                    {
                        FullName = "Zeynep Şahin",
                        Email = "zeynep.sahin@university.edu.tr",
                        Phone = "05329876543",
                        School = "Orta Doğu Teknik Üniversitesi",
                        Department = "Makine Mühendisliği",
                        Year = "4. Sınıf",
                        Message = "Son sınıf öğrencisiyim ve mezuniyet öncesi staj yapmak istiyorum. Rüzgar enerjisi sistemleri ile ilgileniyorum.",
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-10)
                    },
                    new InternshipApplication
                    {
                        FullName = "Can Öztürk",
                        Email = "can.ozturk@university.edu.tr",
                        Phone = "05431234567",
                        School = "Boğaziçi Üniversitesi",
                        Department = "Endüstri Mühendisliği",
                        Year = "2. Sınıf",
                        Message = "Enerji sektöründe kariyer yapmak istiyorum. Staj imkanı için başvuruyorum.",
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-5)
                    }
                };

                context.InternshipApplications.AddRange(internshipApplications);
                await context.SaveChangesAsync();

                logger.LogInformation("Dummy internship applications created: {Count}", internshipApplications.Count);
            }

            // Onay bekleyen personel kullanıcıları ekle (3 adet)
            var pendingPersonelCount = await context.Users.CountAsync(u => u.Role == UserRole.Personel && !u.IsApproved);
            
            if (pendingPersonelCount < 3)
            {
                var pendingPersonels = new List<User>
                {
                    new User
                    {
                        Email = "onaybekleyen1@zena.com",
                        Name = "Mehmet",
                        Surname = "Kaya",
                        Phone = "05551111111",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Personel123!"),
                        Role = UserRole.Personel,
                        IsApproved = false, // Onay bekliyor
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-5),
                        UpdatedAt = DateTime.UtcNow.AddHours(3).AddDays(-5)
                    },
                    new User
                    {
                        Email = "onaybekleyen2@zena.com",
                        Name = "Fatma",
                        Surname = "Öz",
                        Phone = "05552222222",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Personel123!"),
                        Role = UserRole.Personel,
                        IsApproved = false, // Onay bekliyor
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-3),
                        UpdatedAt = DateTime.UtcNow.AddHours(3).AddDays(-3)
                    },
                    new User
                    {
                        Email = "onaybekleyen3@zena.com",
                        Name = "Ali",
                        Surname = "Çelik",
                        Phone = "05553333333",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Personel123!"),
                        Role = UserRole.Personel,
                        IsApproved = false, // Onay bekliyor
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-1),
                        UpdatedAt = DateTime.UtcNow.AddHours(3).AddDays(-1)
                    }
                };

                context.Users.AddRange(pendingPersonels);
                await context.SaveChangesAsync();

                logger.LogInformation("Dummy pending personel users created: {Count}", pendingPersonels.Count);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }
}
