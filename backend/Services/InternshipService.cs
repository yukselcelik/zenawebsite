using Microsoft.EntityFrameworkCore;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Models;

namespace Zenabackend.Services;

public class InternshipService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<InternshipService> _logger;
    private readonly IConfiguration _configuration;
    private readonly string _uploadsPath;

    public InternshipService(ApplicationDbContext context, ILogger<InternshipService> logger, IWebHostEnvironment env,
        IConfiguration configuration)
    {
        _context = context;
        _logger = logger;
        _configuration = configuration;
        _uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "cvs");

        if (!Directory.Exists(_uploadsPath))
        {
            Directory.CreateDirectory(_uploadsPath);
        }
    }

    public async Task<ApiResult<InternshipApplicationResponseDto>> CreateApplicationAsync(
        ApplyInternshipApplicationFormDto dto, string? cvFilePath = null)
    {
        var application = new InternshipApplication
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Phone = dto.Phone,
            School = dto.School ?? "",
            Department = dto.Department ?? "",
            Year = dto.Year ?? "",
            Message = dto.Message ?? "",
            CvFilePath = cvFilePath,
            CreatedAt = DateTime.UtcNow.AddHours(3)
        };

        _context.InternshipApplications.Add(application);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Internship application created: {Id} by {FullName}", application.Id,
            application.FullName);

        var response = new InternshipApplicationResponseDto
        {
            Id = application.Id,
            FullName = application.FullName,
            Email = application.Email,
            Phone = application.Phone,
            School = application.School,
            Department = application.Department,
            Year = application.Year,
            Message = application.Message,
            CvFilePath = _configuration[""] + "/uploads/cvs" + application.CvFilePath,
            CreatedAt = application.CreatedAt
        };

        return ApiResult<InternshipApplicationResponseDto>.Ok(response);
    }

    public async Task<string> SaveCvFileAsync(IFormFile file, int applicationId)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is empty");
        }

        var allowedExtensions = new[] { ".pdf", ".doc", ".docx" };
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(fileExtension))
        {
            throw new ArgumentException("Invalid file type. Only PDF, DOC, and DOCX files are allowed.");
        }

        var fileName = $"{applicationId}_{DateTime.UtcNow:yyyyMMddHHmmss}_{Path.GetFileName(file.FileName)}";
        var filePath = Path.Combine(_uploadsPath, fileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        _logger.LogInformation("CV file saved: {FilePath} for application {ApplicationId}", filePath, applicationId);

        return fileName;
    }

    public async Task<ApiResult<PagedResultDto<InternshipApplicationResponseDto>>> GetAllApplicationsAsync(
        int pageNumber = 1, int pageSize = 10)
    {
        var query = _context.InternshipApplications
            .AsNoTracking()
            .OrderByDescending(a => a.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var applications = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = applications.Select(a => new InternshipApplicationResponseDto
        {
            Id = a.Id,
            FullName = a.FullName,
            Email = a.Email,
            Phone = a.Phone,
            School = a.School,
            Department = a.Department,
            Year = a.Year,
            Message = a.Message,
            CvFilePath = _configuration["FileStorage:BaseUrl"] + "/uploads/cvs" + a.CvFilePath,
            CreatedAt = a.CreatedAt
        }).ToList();

        var response = new PagedResultDto<InternshipApplicationResponseDto>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };

        return ApiResult<PagedResultDto<InternshipApplicationResponseDto>>.Ok(response);
    }

    public async Task<InternshipApplication?> GetApplicationByIdAsync(int id)
    {
        return await _context.InternshipApplications
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task UpdateApplicationAsync(InternshipApplication application)
    {
        _context.InternshipApplications.Update(application);
        await _context.SaveChangesAsync();
    }
}