using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Models;
using Zenabackend.Enums;

namespace Zenabackend.Services;

public class SocialSecurityService(
    ApplicationDbContext context,
    ILogger<SocialSecurityService> logger,
    IConfiguration configuration)
{
    private string BuildPublicDocumentUrl(string? stored)
    {
        if (string.IsNullOrWhiteSpace(stored)) return string.Empty;
        var trimmed = stored.Trim();
        if (trimmed.StartsWith("http", StringComparison.OrdinalIgnoreCase))
        {
            return trimmed;
        }

        var baseUrl = configuration["FileStorage:BaseUrl"]?.TrimEnd('/') ?? "http://localhost:5133";
        if (trimmed.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
        {
            return $"{baseUrl}{trimmed}";
        }

        if (trimmed.StartsWith("uploads/", StringComparison.OrdinalIgnoreCase))
        {
            return $"{baseUrl}/{trimmed}";
        }

        return $"{baseUrl}/uploads/social-security/{trimmed}";
    }

    public async Task<ApiResult<SocialSecurityDto>> GetSocialSecurityByUserIdAsync(int userId)
    {
        var user = await context.Users
            .Include(u => u.SocialSecurityDocuments!.Where(d => !d.isDeleted))
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId && !u.isDeleted);

        if (user == null)
        {
            return ApiResult<SocialSecurityDto>.NotFound("Kullanıcı bulunamadı");
        }

        var documents = user.SocialSecurityDocuments?.Select(d => new SocialSecurityDocumentDto
        {
            Id = d.Id,
            DocumentPath = d.DocumentPath,
            DocumentUrl = BuildPublicDocumentUrl(d.DocumentPath),
            DocumentType = d.DocumentType,
            DocumentTypeName = d.DocumentTypeName,
            UserId = d.UserId,
            CreatedAt = d.CreatedAt
        }).ToList();

        var dto = new SocialSecurityDto
        {
            UserId = user.Id,
            SocialSecurityNumber = user.SocialSecurityNumber,
            TaxNumber = user.TaxNumber,
            Documents = documents ?? new List<SocialSecurityDocumentDto>()
        };

        return ApiResult<SocialSecurityDto>.Ok(dto);
    }

    public async Task<ApiResult<SocialSecurityDto>> CreateOrUpdateSocialSecurityAsync(CreateSocialSecurityDto dto)
    {
        var user = await context.Users
            .Include(u => u.SocialSecurityDocuments!.Where(d => !d.isDeleted))
            .FirstOrDefaultAsync(u => u.Id == dto.UserId && !u.isDeleted);

        if (user == null)
        {
            return ApiResult<SocialSecurityDto>.NotFound("Kullanıcı bulunamadı");
        }

        // Update user's social security fields
        user.SocialSecurityNumber = dto.SocialSecurityNumber;
        user.TaxNumber = dto.TaxNumber;
        user.UpdatedAt = DateTime.UtcNow.AddHours(3);

        await context.SaveChangesAsync();

        logger.LogInformation("SocialSecurity updated for user {UserId}", dto.UserId);

        var documents = user.SocialSecurityDocuments?.Select(d => new SocialSecurityDocumentDto
        {
            Id = d.Id,
            DocumentPath = d.DocumentPath,
            DocumentUrl = BuildPublicDocumentUrl(d.DocumentPath),
            DocumentType = d.DocumentType,
            DocumentTypeName = d.DocumentTypeName,
            UserId = d.UserId,
            CreatedAt = d.CreatedAt
        }).ToList();

        return ApiResult<SocialSecurityDto>.Ok(new SocialSecurityDto
        {
            UserId = user.Id,
            SocialSecurityNumber = user.SocialSecurityNumber,
            TaxNumber = user.TaxNumber,
            Documents = documents ?? new List<SocialSecurityDocumentDto>()
        });
    }

    public async Task<ApiResult<SocialSecurityDocumentDto>> CreateSocialSecurityDocumentAsync(
        CreateSocialSecurityDocumentDto dto, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return ApiResult<SocialSecurityDocumentDto>.BadRequest("Dosya boş olamaz");
        }

        var allowedExtensions = new[] { ".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png" };
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(fileExtension))
        {
            return ApiResult<SocialSecurityDocumentDto>.BadRequest(
                "Geçersiz dosya tipi. Sadece PDF, DOC, DOCX ve resim dosyaları kabul edilir.");
        }

        // Create document record first to get ID
        var document = new SocialSecurityDocument
        {
            UserId = dto.UserId,
            DocumentType = dto.DocumentType,
            DocumentTypeName = CommonHelper.GetEnumDescription(dto.DocumentType),
            CreatedAt = DateTime.UtcNow.AddHours(3),
            UpdatedAt = DateTime.UtcNow.AddHours(3)
        };

        context.SocialSecurityDocuments.Add(document);
        await context.SaveChangesAsync();

        // Save file with document ID
        var fileName = await SaveDocumentFileAsync(file, dto.UserId, document.Id);
        document.DocumentPath = fileName;
        await context.SaveChangesAsync();

        logger.LogInformation("SocialSecurityDocument created: {Id} for user {UserId}", document.Id, dto.UserId);

        var documentDto = new SocialSecurityDocumentDto
        {
            Id = document.Id,
            DocumentPath = document.DocumentPath,
            DocumentUrl = BuildPublicDocumentUrl(document.DocumentPath),
            DocumentType = document.DocumentType,
            DocumentTypeName = document.DocumentTypeName,
            UserId = document.UserId,
            CreatedAt = document.CreatedAt
        };

        return ApiResult<SocialSecurityDocumentDto>.Ok(documentDto);
    }

    public async Task<ApiResult<bool>> DeleteSocialSecurityDocumentAsync(int documentId)
    {
        var document = await context.SocialSecurityDocuments
            .FirstOrDefaultAsync(d => d.Id == documentId && !d.isDeleted);

        if (document == null)
        {
            return ApiResult<bool>.NotFound("Belge bulunamadı");
        }

        // Delete physical file
        if (!string.IsNullOrWhiteSpace(document.DocumentPath))
        {
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "social-security");
            var filePath = Path.Combine(uploadsPath, document.DocumentPath);
            
            if (File.Exists(filePath))
            {
                try
                {
                    File.Delete(filePath);
                    logger.LogInformation("Deleted file: {FilePath}", filePath);
                }
                catch (Exception ex)
                {
                    logger.LogWarning(ex, "Failed to delete file: {FilePath}", filePath);
                }
            }
        }

        // Soft delete document
        document.isDeleted = true;
        document.UpdatedAt = DateTime.UtcNow.AddHours(3);
        await context.SaveChangesAsync();

        logger.LogInformation("SocialSecurityDocument deleted: {Id}", documentId);

        return ApiResult<bool>.Ok(true, "Belge başarıyla silindi");
    }

    public async Task<string> SaveDocumentFileAsync(IFormFile file, int userId, int documentId)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is empty");
        }

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "social-security");
        
        if (!Directory.Exists(uploadsPath))
        {
            Directory.CreateDirectory(uploadsPath);
        }

        var fileExtension = Path.GetExtension(file.FileName);
        var fileName = $"{userId}_{documentId}_{DateTime.UtcNow:yyyyMMddHHmmss}{fileExtension}";
        var filePath = Path.Combine(uploadsPath, fileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        logger.LogInformation("SocialSecurity document file saved: {FilePath} for user {UserId}, document {DocumentId}", 
            filePath, userId, documentId);

        return fileName;
    }
}

