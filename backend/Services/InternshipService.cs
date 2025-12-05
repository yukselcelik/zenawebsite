using Microsoft.EntityFrameworkCore;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Models;

namespace Zenabackend.Services;

public class InternshipService(
    ApplicationDbContext context,
    ILogger<InternshipService> logger,
    IConfiguration configuration)
{
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
            OriginalFileName = null, // Will be set when file is saved
            CreatedAt = DateTime.UtcNow.AddHours(3)
        };

        context.InternshipApplications.Add(application);
        await context.SaveChangesAsync();

        logger.LogInformation("Internship application created: {Id} by {FullName}", application.Id,
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
            CvFilePath = !string.IsNullOrEmpty(application.CvFilePath) 
                ? configuration["FileStorage:BaseUrl"] + "/uploads/cvs/" + application.CvFilePath 
                : null,
            OriginalFileName = application.OriginalFileName,
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

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "cvs");
        var fileName = $"{applicationId}_{DateTime.UtcNow:yyyyMMddHHmmss}_{Path.GetFileName(file.FileName)}";
        var filePath = Path.Combine(uploadsPath, fileName);
        
        if (!Directory.Exists(uploadsPath))
        {
            Directory.CreateDirectory(uploadsPath);
        }

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        logger.LogInformation("CV file saved: {FilePath} for application {ApplicationId}", filePath, applicationId);

        return fileName;
    }

    public async Task<ApiResult<PagedResultDto<InternshipApplicationResponseDto>>> GetAllApplicationsAsync(
        int pageNumber = 1, int pageSize = 10)
    {
        var query = context.InternshipApplications
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
            CvFilePath = !string.IsNullOrEmpty(a.CvFilePath) 
                ? configuration["FileStorage:BaseUrl"] + "/uploads/cvs/" + a.CvFilePath 
                : null,
            OriginalFileName = a.OriginalFileName,
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
        return await context.InternshipApplications
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task UpdateApplicationAsync(InternshipApplication application)
    {
        context.InternshipApplications.Update(application);
        await context.SaveChangesAsync();
    }

    public async Task<ApiResult<bool>> DeleteApplicationAsync(int id)
    {
        var application = await context.InternshipApplications
            .FirstOrDefaultAsync(a => a.Id == id);

        if (application == null)
        {
            return ApiResult<bool>.NotFound("Başvuru bulunamadı");
        }

        // CV dosyasını sil
        if (!string.IsNullOrEmpty(application.CvFilePath))
        {
            try
            {
                var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "cvs");
                var filePath = Path.Combine(uploadsPath, application.CvFilePath);
                
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    logger.LogInformation("CV file deleted: {FilePath} for application {ApplicationId}", filePath, id);
                }
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to delete CV file for application {ApplicationId}", id);
                // Dosya silinemediyse de devam et, sadece logla
            }
        }

        // Veritabanından sil
        context.InternshipApplications.Remove(application);
        await context.SaveChangesAsync();

        logger.LogInformation("Internship application deleted: {Id}", id);

        return ApiResult<bool>.Ok(true);
    }
}