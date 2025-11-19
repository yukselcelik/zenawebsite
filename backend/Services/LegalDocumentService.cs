using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Models;
using Zenabackend.Enums;

namespace Zenabackend.Services;

public class LegalDocumentService(
    ApplicationDbContext context,
    ILogger<LegalDocumentService> logger,
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

        return $"{baseUrl}/uploads/legal-documents/{trimmed}";
    }

    public async Task<ApiResult<LegalDocumentDto>> GetLegalDocumentsByUserIdAsync(int userId)
    {
        var user = await context.Users
            .Include(u => u.LegalDocuments!.Where(d => !d.isDeleted))
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId && !u.isDeleted);

        if (user == null)
        {
            return ApiResult<LegalDocumentDto>.NotFound("Kullanıcı bulunamadı");
        }

        var documents = user.LegalDocuments?.Select(d => new LegalDocumentItemDto
        {
            Id = d.Id,
            DocumentPath = d.DocumentPath,
            DocumentUrl = BuildPublicDocumentUrl(d.DocumentPath),
            OriginalFileName = d.OriginalFileName,
            LegalDocumentType = d.LegalDocumentType,
            LegalDocumentTypeName = d.LegalDocumentTypeName,
            UserId = d.UserId,
            CreatedAt = d.CreatedAt
        }).ToList();

        var dto = new LegalDocumentDto
        {
            UserId = user.Id,
            Documents = documents ?? new List<LegalDocumentItemDto>()
        };

        return ApiResult<LegalDocumentDto>.Ok(dto);
    }

    public async Task<ApiResult<LegalDocumentItemDto>> CreateLegalDocumentAsync(
        CreateLegalDocumentDto dto, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return ApiResult<LegalDocumentItemDto>.BadRequest("Dosya boş olamaz");
        }

        var allowedExtensions = new[] { ".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png" };
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(fileExtension))
        {
            return ApiResult<LegalDocumentItemDto>.BadRequest(
                "Geçersiz dosya tipi. Sadece PDF, DOC, DOCX ve resim dosyaları kabul edilir.");
        }

        // Create document record first to get ID
        var document = new LegalDocument
        {
            UserId = dto.UserId,
            LegalDocumentType = dto.LegalDocumentType,
            LegalDocumentTypeName = CommonHelper.GetEnumDescription(dto.LegalDocumentType),
            OriginalFileName = file.FileName,
            CreatedAt = DateTime.UtcNow.AddHours(3),
            UpdatedAt = DateTime.UtcNow.AddHours(3)
        };

        context.LegalDocuments.Add(document);
        await context.SaveChangesAsync();

        // Save file with document ID
        var fileName = await SaveDocumentFileAsync(file, dto.UserId, document.Id);
        document.DocumentPath = fileName;
        await context.SaveChangesAsync();

        logger.LogInformation("LegalDocument created: {Id} for user {UserId}", document.Id, dto.UserId);

        var documentDto = new LegalDocumentItemDto
        {
            Id = document.Id,
            DocumentPath = document.DocumentPath,
            DocumentUrl = BuildPublicDocumentUrl(document.DocumentPath),
            OriginalFileName = document.OriginalFileName,
            LegalDocumentType = document.LegalDocumentType,
            LegalDocumentTypeName = document.LegalDocumentTypeName,
            UserId = document.UserId,
            CreatedAt = document.CreatedAt
        };

        return ApiResult<LegalDocumentItemDto>.Ok(documentDto);
    }

    public async Task<ApiResult<FileResult>> DownloadLegalDocumentAsync(int documentId)
    {
        var document = await context.LegalDocuments
            .FirstOrDefaultAsync(d => d.Id == documentId && !d.isDeleted);

        if (document == null)
        {
            return ApiResult<FileResult>.NotFound("Belge bulunamadı");
        }

        if (string.IsNullOrWhiteSpace(document.DocumentPath))
        {
            return ApiResult<FileResult>.NotFound("Dosya yolu bulunamadı");
        }

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "legal-documents");
        var filePath = Path.Combine(uploadsPath, document.DocumentPath);

        if (!File.Exists(filePath))
        {
            return ApiResult<FileResult>.NotFound("Dosya bulunamadı");
        }

        var fileBytes = await File.ReadAllBytesAsync(filePath);
        var originalFileName = document.OriginalFileName ?? $"document_{document.Id}{Path.GetExtension(document.DocumentPath)}";
        
        var fileResult = new FileResult
        {
            FileBytes = fileBytes,
            ContentType = GetContentType(Path.GetExtension(originalFileName)),
            FileName = originalFileName
        };

        return ApiResult<FileResult>.Ok(fileResult);
    }

    private string GetContentType(string extension)
    {
        return extension.ToLowerInvariant() switch
        {
            ".pdf" => "application/pdf",
            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".jpg" => "image/jpeg",
            ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            _ => "application/octet-stream"
        };
    }

    public async Task<ApiResult<bool>> DeleteLegalDocumentAsync(int documentId)
    {
        var document = await context.LegalDocuments
            .FirstOrDefaultAsync(d => d.Id == documentId && !d.isDeleted);

        if (document == null)
        {
            return ApiResult<bool>.NotFound("Belge bulunamadı");
        }

        // Delete physical file
        if (!string.IsNullOrWhiteSpace(document.DocumentPath))
        {
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "legal-documents");
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

        logger.LogInformation("LegalDocument deleted: {Id}", documentId);

        return ApiResult<bool>.Ok(true, "Belge başarıyla silindi");
    }

    public async Task<string> SaveDocumentFileAsync(IFormFile file, int userId, int documentId)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is empty");
        }

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "legal-documents");
        
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

        logger.LogInformation("LegalDocument file saved: {FilePath} for user {UserId}, document {DocumentId}", 
            filePath, userId, documentId);

        return fileName;
    }
}

