using Microsoft.EntityFrameworkCore;
using Zenabackend.Enums;
using Zenabackend.Models;

namespace Zenabackend.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        try
        {
            if (!await context.Users.AnyAsync(u => u.Role == UserRoleEnum.Manager))
            {
                var adminUser = new User
                {
                    Email = "admin@zena.com",
                    Name = "Yönetici",
                    Surname = "Kullanıcı",
                    Phone = "5550001122",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                    Role = UserRoleEnum.Manager,
                    IsApproved = true, 
                    CreatedAt = DateTime.UtcNow.AddHours(3),
                    UpdatedAt = DateTime.UtcNow.AddHours(3),
                    PhotoPath = "2_ad0e380b8ac54b42b4cd8305a4469331.jpg"
                };

                context.Users.Add(adminUser);
                await context.SaveChangesAsync();

                logger.LogInformation("Default admin user created: admin@zena.com / Admin123!");
            }

            // Sadece belirli email'ler yoksa seed data oluştur (email bazlı kontrol)
            var personel1Exists = await context.Users.AnyAsync(u => u.Email == "personel1@zena.com");
            var personel2Exists = await context.Users.AnyAsync(u => u.Email == "personel2@zena.com");
            
            if (!personel1Exists)
            {
                var personel1 = new User
                {
                    Email = "personel1@zena.com",
                    Name = "Ahmet",
                    Surname = "Yılmaz",
                    Phone = "5649871515",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Personel123!"),
                    Role = UserRoleEnum.Personel,
                    IsApproved = true, 
                    ApprovedAt = DateTime.UtcNow.AddHours(3).AddDays(-28),
                    CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-30),
                    UpdatedAt = DateTime.UtcNow.AddHours(3).AddDays(-28),
                    PhotoPath = "2_c87f251715b247e2aa4987d0cf7f407b.jpg"
                };

                context.Users.Add(personel1);
                await context.SaveChangesAsync();
                
                // Personel1 için ilişkili verileri oluştur
                var contactInfo1 = new ContactInfo
                {
                    UserId = personel1.Id,
                    Address = "İstanbul, Türkiye",
                    PhoneNumber = "5550001122",
                    Mail = "personel1@zena.com"
                };
                context.ContactInfos.Add(contactInfo1);
                
                var emergencyContact1 = new EmergencyContact
                {
                    UserId = personel1.Id,
                    FullName = "Ahmet Yılmaz",
                    PhoneNumber = "5550001122",
                    Address = "İstanbul, Türkiye"
                };
                context.EmergencyContacts.Add(emergencyContact1);
                
                var employmentInfo1 = new EmploymentInfo
                {
                    UserId = personel1.Id,
                    StartDate = DateTime.UtcNow.AddHours(3).AddDays(-30),
                    Position = "Yazılım Geliştirici",
                    WorkType = WorkTypeEnum.FullTime,
                    ContractType = ContractTypeEnum.FixedTerm,
                    WorkplaceNumber = "1234567890"
                };
                context.EmploymentInfos.Add(employmentInfo1);
                
                var educationInfo1 = new EducationInfo
                {
                    UserId = personel1.Id,
                    University = "İstanbul Teknik Üniversitesi",
                    Department = "Yazılım Mühendisliği",
                    GraduationYear = 2025,
                    Certification = "Yazılım Mühendisliği"
                };
                context.EducationInfos.Add(educationInfo1);
                
                await context.SaveChangesAsync();
                logger.LogInformation("Dummy personel1 user created");
            }

            if (!personel2Exists)
            {
                var personel2 = new User
                {
                    Email = "personel2@zena.com",
                    Name = "Ayşe",
                    Surname = "Demir",
                    Phone = "5551112233",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Personel123!"),
                    Role = UserRoleEnum.Personel,
                    IsApproved = true, 
                    ApprovedAt = DateTime.UtcNow.AddHours(3).AddDays(-23),
                    CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-25),
                    UpdatedAt = DateTime.UtcNow.AddHours(3).AddDays(-23)
                };

                context.Users.Add(personel2);
                await context.SaveChangesAsync();
                
                // Personel2 için ilişkili verileri oluştur
                var contactInfo2 = new ContactInfo
                {
                    UserId = personel2.Id,
                    Address = "İstanbul, Türkiye",
                    PhoneNumber = "5551112233",
                    Mail = "personel2@zena.com"
                };
                context.ContactInfos.Add(contactInfo2);
                
                var emergencyContact2 = new EmergencyContact
                {
                    UserId = personel2.Id,
                    FullName = "Ayşe Demir",
                    PhoneNumber = "5551112233",
                    Address = "İstanbul, Türkiye"
                };
                context.EmergencyContacts.Add(emergencyContact2);
                
                var employmentInfo2 = new EmploymentInfo
                {
                    UserId = personel2.Id,
                    StartDate = DateTime.UtcNow.AddHours(3).AddDays(-30),
                    Position = "Yazılım Geliştirici",
                    WorkType = WorkTypeEnum.FullTime,
                    ContractType = ContractTypeEnum.FixedTerm,
                    WorkplaceNumber = "1234567890"
                };
                context.EmploymentInfos.Add(employmentInfo2);
                
                var educationInfo2 = new EducationInfo
                {
                    UserId = personel2.Id,
                    University = "İstanbul Teknik Üniversitesi",
                    Department = "Yazılım Mühendisliği",
                    GraduationYear = 2025,
                    Certification = "Yazılım Mühendisliği"
                };
                context.EducationInfos.Add(educationInfo2);
                
                await context.SaveChangesAsync();
                logger.LogInformation("Dummy personel2 user created");
            }
            
            // İlişkili verileri sadece yoksa oluştur
            var personelUsers = await context.Users
                .Where(u => u.Role == UserRoleEnum.Personel && u.IsApproved)
                .OrderBy(u => u.CreatedAt)
                .ToListAsync();
            
            if (personelUsers.Count >= 2)
            {
                // ContactInfo kontrolü
                var personel1User = personelUsers.FirstOrDefault(u => u.Email == "personel1@zena.com");
                var personel2User = personelUsers.FirstOrDefault(u => u.Email == "personel2@zena.com");
                
                if (personel1User != null && !await context.ContactInfos.AnyAsync(c => c.UserId == personel1User.Id))
                {
                    var contactInfo1 = new ContactInfo
                    {
                        UserId = personel1User.Id,
                        Address = "İstanbul, Türkiye",
                        PhoneNumber = "5550001122",
                        Mail = "personel1@zena.com"
                    };
                    context.ContactInfos.Add(contactInfo1);
                }
                
                if (personel2User != null && !await context.ContactInfos.AnyAsync(c => c.UserId == personel2User.Id))
                {
                    var contactInfo2 = new ContactInfo
                    {
                        UserId = personel2User.Id,
                        Address = "İstanbul, Türkiye",
                        PhoneNumber = "5551112233",
                        Mail = "personel2@zena.com"
                    };
                    context.ContactInfos.Add(contactInfo2);
                }
                
                await context.SaveChangesAsync();
                logger.LogInformation("Dummy contact info checked/created");
                
                // EmergencyContact kontrolü
                if (personel1User != null && !await context.EmergencyContacts.AnyAsync(e => e.UserId == personel1User.Id))
                {
                    var emergencyContact1 = new EmergencyContact
                    {
                        UserId = personel1User.Id,
                        FullName = "Ahmet Yılmaz",
                        PhoneNumber = "5550001122",
                        Address = "İstanbul, Türkiye"
                    };
                    context.EmergencyContacts.Add(emergencyContact1);
                }
                
                if (personel2User != null && !await context.EmergencyContacts.AnyAsync(e => e.UserId == personel2User.Id))
                {
                    var emergencyContact2 = new EmergencyContact
                    {
                        UserId = personel2User.Id,
                        FullName = "Ayşe Demir",
                        PhoneNumber = "5551112233",
                        Address = "İstanbul, Türkiye"
                    };
                    context.EmergencyContacts.Add(emergencyContact2);
                }
                
                await context.SaveChangesAsync();
                logger.LogInformation("Dummy emergency contact checked/created");
                
                // EmploymentInfo kontrolü
                if (personel1User != null && !await context.EmploymentInfos.AnyAsync(e => e.UserId == personel1User.Id))
                {
                    var employmentInfo1 = new EmploymentInfo
                    {
                        UserId = personel1User.Id,
                        StartDate = DateTime.UtcNow.AddHours(3).AddDays(-30),
                        Position = "Yazılım Geliştirici",
                        WorkType = WorkTypeEnum.FullTime,
                        ContractType = ContractTypeEnum.FixedTerm,
                        WorkplaceNumber = "1234567890"
                    };
                    context.EmploymentInfos.Add(employmentInfo1);
                }
                
                if (personel2User != null && !await context.EmploymentInfos.AnyAsync(e => e.UserId == personel2User.Id))
                {
                    var employmentInfo2 = new EmploymentInfo
                    {
                        UserId = personel2User.Id,
                        StartDate = DateTime.UtcNow.AddHours(3).AddDays(-30),
                        Position = "Yazılım Geliştirici",
                        WorkType = WorkTypeEnum.FullTime,
                        ContractType = ContractTypeEnum.FixedTerm,
                        WorkplaceNumber = "1234567890"
                    };
                    context.EmploymentInfos.Add(employmentInfo2);
                }
                
                await context.SaveChangesAsync();
                logger.LogInformation("Dummy employment info checked/created");
                
                // EducationInfo kontrolü
                if (personel1User != null && !await context.EducationInfos.AnyAsync(e => e.UserId == personel1User.Id))
                {
                    var educationInfo1 = new EducationInfo
                    {
                        UserId = personel1User.Id,
                        University = "İstanbul Teknik Üniversitesi",
                        Department = "Yazılım Mühendisliği",
                        GraduationYear = 2025,
                        Certification = "Yazılım Mühendisliği"
                    };
                    context.EducationInfos.Add(educationInfo1);
                }
                
                if (personel2User != null && !await context.EducationInfos.AnyAsync(e => e.UserId == personel2User.Id))
                {
                    var educationInfo2 = new EducationInfo
                    {
                        UserId = personel2User.Id,
                        University = "İstanbul Teknik Üniversitesi",
                        Department = "Yazılım Mühendisliği",
                        GraduationYear = 2025,
                        Certification = "Yazılım Mühendisliği"
                    };
                    context.EducationInfos.Add(educationInfo2);
                }
                
                await context.SaveChangesAsync();
                logger.LogInformation("Dummy education info checked/created");
            }
            
            // Leave requests için personel kullanıcıları al
            var personelUsers = await context.Users
                .Where(u => u.Role == UserRoleEnum.Personel && u.IsApproved)
                .OrderBy(u => u.CreatedAt)
                .ToListAsync();

                if (personelUsers.Count >= 2)
                {
                    var leaveRequests = new List<LeaveRequest>();

                    var personel1Id = personelUsers[0].Id;
                    leaveRequests.Add(new LeaveRequest
                    {
                        UserId = personel1Id,
                        StartDate = DateTime.UtcNow.Date.AddDays(5),
                        EndDate = DateTime.UtcNow.Date.AddDays(7),
                        Reason = "Aile ziyareti için izin talebi",
                        Status = LeaveStatusEnum.Pending,
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-10),
                        UpdatedAt = DateTime.UtcNow.AddHours(3).AddDays(-10)
                    });

                    leaveRequests.Add(new LeaveRequest
                    {
                        UserId = personel1Id,
                        StartDate = DateTime.UtcNow.Date.AddDays(-15),
                        EndDate = DateTime.UtcNow.Date.AddDays(-12),
                        Reason = "Sağlık kontrolü için izin",
                        Status = LeaveStatusEnum.Approved,
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-20),
                        UpdatedAt = DateTime.UtcNow.AddHours(3).AddDays(-15)
                    });

                    var personel2Id = personelUsers[1].Id;
                    leaveRequests.Add(new LeaveRequest
                    {
                        UserId = personel2Id,
                        StartDate = DateTime.UtcNow.Date.AddDays(10),
                        EndDate = DateTime.UtcNow.Date.AddDays(12),
                        Reason = "Tatil planı için izin talebi",
                        Status = LeaveStatusEnum.Pending,
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-8),
                        UpdatedAt = DateTime.UtcNow.AddHours(3).AddDays(-8)
                    });

                    leaveRequests.Add(new LeaveRequest
                    {
                        UserId = personel2Id,
                        StartDate = DateTime.UtcNow.Date.AddDays(-25),
                        EndDate = DateTime.UtcNow.Date.AddDays(-23),
                        Reason = "Acil durum izni",
                        Status = LeaveStatusEnum.Cancelled,
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-28),
                        UpdatedAt = DateTime.UtcNow.AddHours(3).AddDays(-26)
                    });

                    context.LeaveRequests.AddRange(leaveRequests);
                    await context.SaveChangesAsync();

                    logger.LogInformation("Dummy leave requests created: {Count}", leaveRequests.Count);
                }
            }

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
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-15),
                        CvFilePath = "example.pdf",
                        OriginalFileName = "example1.pdf",
                        Position = "Stajyer",
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
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-10),
                        CvFilePath = "example.pdf",
                        OriginalFileName = "example2.pdf",
                        Position = "Stajyer",
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
                        CreatedAt = DateTime.UtcNow.AddHours(3).AddDays(-5),
                        CvFilePath = "example.pdf",
                        OriginalFileName = "example3.pdf",
                        Position = "Stajyer",
                    },
                    // is basvurusu
                    new InternshipApplication
                    {
                        FullName = "Ahmet Yılmaz",
                        Email = "ahmet.yilmaz@university.edu.tr",
                        Phone = "05551234567",
                        
                    }
                };

                context.InternshipApplications.AddRange(internshipApplications);
                await context.SaveChangesAsync();

                logger.LogInformation("Dummy internship applications created: {Count}", internshipApplications.Count);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }
}
