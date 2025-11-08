using Microsoft.AspNetCore.Hosting;
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
    private readonly string _uploadsPath;

    public InternshipService(ApplicationDbContext context, ILogger<InternshipService> logger, IWebHostEnvironment env)
    {
        _context = context;
        _logger = logger;
        _uploadsPath = Path.Combine(env.ContentRootPath, "uploads", "cvs");
        
        // Uploads klasörünü oluştur
        if (!Directory.Exists(_uploadsPath))
        {
            Directory.CreateDirectory(_uploadsPath);
        }
    }

    public async Task<ApiResult<InternshipApplicationResponseDto>> CreateApplicationAsync(CreateInternshipApplicationDto dto, string? cvFilePath = null)
    {
        var application = new InternshipApplication
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Phone = dto.Phone,
            School = dto.School,
            Department = dto.Department,
            Year = dto.Year,
            Message = dto.Message,
            CvFilePath = cvFilePath,
            CreatedAt = DateTime.UtcNow.AddHours(3)
        };

        _context.InternshipApplications.Add(application);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Internship application created: {Id} by {FullName}", application.Id, application.FullName);

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
            CvFilePath = application.CvFilePath,
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

        // Dosya uzantısını kontrol et
        var allowedExtensions = new[] { ".pdf", ".doc", ".docx" };
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        
        if (!allowedExtensions.Contains(fileExtension))
        {
            throw new ArgumentException("Invalid file type. Only PDF, DOC, and DOCX files are allowed.");
        }

        // Dosya adını oluştur: applicationId_timestamp_originalname
        var fileName = $"{applicationId}_{DateTime.UtcNow:yyyyMMddHHmmss}_{Path.GetFileName(file.FileName)}";
        var filePath = Path.Combine(_uploadsPath, fileName);

        // Dosyayı kaydet
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        _logger.LogInformation("CV file saved: {FilePath} for application {ApplicationId}", filePath, applicationId);

        return filePath;
    }

    public async Task<(byte[] fileBytes, string fileName, string contentType)> GetCvFileAsync(int applicationId)
    {
        var application = await _context.InternshipApplications
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == applicationId);

        if (application == null || string.IsNullOrEmpty(application.CvFilePath))
        {
            throw new FileNotFoundException("CV file not found for this application");
        }

        if (!File.Exists(application.CvFilePath))
        {
            throw new FileNotFoundException("CV file not found on disk");
        }

        var fileBytes = await File.ReadAllBytesAsync(application.CvFilePath);
        var fileName = Path.GetFileName(application.CvFilePath);
        var contentType = GetContentType(Path.GetExtension(fileName));

        return (fileBytes, fileName, contentType);
    }

    private string GetContentType(string extension)
    {
        return extension.ToLowerInvariant() switch
        {
            ".pdf" => "application/pdf",
            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            _ => "application/octet-stream"
        };
    }

    public async Task<ApiResult<PagedResultDto<InternshipApplicationResponseDto>>> GetAllApplicationsAsync(int pageNumber = 1, int pageSize = 10)
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
            CvFilePath = a.CvFilePath,
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