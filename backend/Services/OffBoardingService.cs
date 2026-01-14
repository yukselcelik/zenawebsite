using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Models;
using Zenabackend.Enums;

namespace Zenabackend.Services;

public class OffBoardingService(
    ApplicationDbContext context,
    ILogger<OffBoardingService> logger,
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

        return $"{baseUrl}/uploads/offboarding/{trimmed}";
    }

    public async Task<ApiResult<OffBoardingDto>> GetOffBoardingByUserIdAsync(int userId)
    {
        var user = await context.Users
            .Include(u => u.OffBoarding)
            .Include(u => u.OffBoardingDocuments!.Where(d => !d.isDeleted))
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId && !u.isDeleted);

        if (user == null)
        {
            return ApiResult<OffBoardingDto>.NotFound("Kullanıcı bulunamadı");
        }

        var offBoarding = user.OffBoarding;
        if (offBoarding == null || offBoarding.isDeleted)
        {
            return ApiResult<OffBoardingDto>.Ok(new OffBoardingDto
            {
                UserId = userId,
                IsActive = false,
                Documents = new List<OffBoardingDocumentDto>()
            });
        }

        var documents = user.OffBoardingDocuments?.Select(d => new OffBoardingDocumentDto
        {
            Id = d.Id,
            DocumentPath = d.DocumentPath,
            DocumentUrl = BuildPublicDocumentUrl(d.DocumentPath),
            OriginalFileName = d.OriginalFileName,
            DocumentType = d.DocumentType,
            DocumentTypeName = d.DocumentTypeName,
            UserId = d.UserId,
            CreatedAt = d.CreatedAt
        }).ToList();

        var dto = new OffBoardingDto
        {
            Id = offBoarding.Id,
            UserId = offBoarding.UserId,
            OffBoardingDate = offBoarding.OffBoardingDate,
            OffBoardingReason = offBoarding.OffBoardingReason,
            OffBoardingReasonName = offBoarding.OffBoardingReason.HasValue 
                ? CommonHelper.GetEnumDescription(offBoarding.OffBoardingReason.Value) 
                : null,
            IsActive = offBoarding.OffBoardingDate.HasValue,
            Documents = documents ?? new List<OffBoardingDocumentDto>()
        };

        return ApiResult<OffBoardingDto>.Ok(dto);
    }

    public async Task<ApiResult<OffBoardingDto>> CreateOrUpdateOffBoardingAsync(CreateOffBoardingDto dto)
    {
        var user = await context.Users
            .Include(u => u.OffBoarding)
            .Include(u => u.OffBoardingDocuments!.Where(d => !d.isDeleted))
            .FirstOrDefaultAsync(u => u.Id == dto.UserId && !u.isDeleted);

        if (user == null)
        {
            return ApiResult<OffBoardingDto>.NotFound("Kullanıcı bulunamadı");
        }

        OffBoarding offBoarding;
        if (user.OffBoarding == null || user.OffBoarding.isDeleted)
        {
            offBoarding = new OffBoarding
            {
                UserId = dto.UserId,
                OffBoardingDate = dto.OffBoardingDate,
                OffBoardingReason = dto.OffBoardingReason,
                CreatedAt = DateTime.UtcNow.AddHours(3),
                UpdatedAt = DateTime.UtcNow.AddHours(3)
            };
            context.OffBoardings.Add(offBoarding);
        }
        else
        {
            offBoarding = user.OffBoarding;
            offBoarding.OffBoardingDate = dto.OffBoardingDate;
            offBoarding.OffBoardingReason = dto.OffBoardingReason;
            offBoarding.UpdatedAt = DateTime.UtcNow.AddHours(3);
        }

        await context.SaveChangesAsync();

        logger.LogInformation("OffBoarding updated for user {UserId}", dto.UserId);

        var documents = user.OffBoardingDocuments?.Select(d => new OffBoardingDocumentDto
        {
            Id = d.Id,
            DocumentPath = d.DocumentPath,
            DocumentUrl = BuildPublicDocumentUrl(d.DocumentPath),
            OriginalFileName = d.OriginalFileName,
            DocumentType = d.DocumentType,
            DocumentTypeName = d.DocumentTypeName,
            UserId = d.UserId,
            CreatedAt = d.CreatedAt
        }).ToList();

        return ApiResult<OffBoardingDto>.Ok(new OffBoardingDto
        {
            Id = offBoarding.Id,
            UserId = offBoarding.UserId,
            OffBoardingDate = offBoarding.OffBoardingDate,
            OffBoardingReason = offBoarding.OffBoardingReason,
            OffBoardingReasonName = offBoarding.OffBoardingReason.HasValue 
                ? CommonHelper.GetEnumDescription(offBoarding.OffBoardingReason.Value) 
                : null,
            IsActive = offBoarding.OffBoardingDate.HasValue,
            Documents = documents ?? new List<OffBoardingDocumentDto>()
        });
    }

    public async Task<ApiResult<OffBoardingDocumentDto>> CreateOffBoardingDocumentAsync(
        CreateOffBoardingDocumentDto dto, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return ApiResult<OffBoardingDocumentDto>.BadRequest("Dosya boş olamaz");
        }

        var allowedExtensions = new[] { ".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png" };
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(fileExtension))
        {
            return ApiResult<OffBoardingDocumentDto>.BadRequest(
                "Geçersiz dosya tipi. Sadece PDF, DOC, DOCX ve resim dosyaları kabul edilir.");
        }

        var user = await context.Users
            .Include(u => u.OffBoarding)
            .FirstOrDefaultAsync(u => u.Id == dto.UserId && !u.isDeleted);

        if (user == null)
        {
            return ApiResult<OffBoardingDocumentDto>.NotFound("Kullanıcı bulunamadı");
        }

        // Eğer OffBoarding kaydı yoksa oluştur
        if (user.OffBoarding == null || user.OffBoarding.isDeleted)
        {
            user.OffBoarding = new OffBoarding
            {
                UserId = dto.UserId,
                OffBoardingDate = null,
                OffBoardingReason = null,
                CreatedAt = DateTime.UtcNow.AddHours(3),
                UpdatedAt = DateTime.UtcNow.AddHours(3)
            };
            context.OffBoardings.Add(user.OffBoarding);
            await context.SaveChangesAsync();
            logger.LogInformation("OffBoarding record created for user {UserId}", dto.UserId);
        }

        // Create document record first to get ID
        var document = new OffBoardingDocument
        {
            UserId = dto.UserId,
            DocumentType = dto.DocumentType,
            DocumentTypeName = CommonHelper.GetEnumDescription(dto.DocumentType),
            OriginalFileName = file.FileName,
            CreatedAt = DateTime.UtcNow.AddHours(3),
            UpdatedAt = DateTime.UtcNow.AddHours(3)
        };

        context.OffBoardingDocuments.Add(document);
        await context.SaveChangesAsync();

        // Save file with document ID
        var fileName = await SaveDocumentFileAsync(file, dto.UserId, document.Id);
        document.DocumentPath = fileName;
        await context.SaveChangesAsync();

        logger.LogInformation("OffBoardingDocument created: {Id} for user {UserId}", document.Id, dto.UserId);

        var documentDto = new OffBoardingDocumentDto
        {
            Id = document.Id,
            DocumentPath = document.DocumentPath,
            DocumentUrl = BuildPublicDocumentUrl(document.DocumentPath),
            OriginalFileName = document.OriginalFileName,
            DocumentType = document.DocumentType,
            DocumentTypeName = document.DocumentTypeName,
            UserId = document.UserId,
            CreatedAt = document.CreatedAt
        };

        return ApiResult<OffBoardingDocumentDto>.Ok(documentDto);
    }

    public async Task<ApiResult<FileResult>> DownloadOffBoardingDocumentAsync(int documentId)
    {
        var document = await context.OffBoardingDocuments
            .FirstOrDefaultAsync(d => d.Id == documentId && !d.isDeleted);

        if (document == null)
        {
            return ApiResult<FileResult>.NotFound("Belge bulunamadı");
        }

        if (string.IsNullOrWhiteSpace(document.DocumentPath))
        {
            return ApiResult<FileResult>.NotFound("Dosya yolu bulunamadı");
        }

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "offboarding");
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

    public async Task<ApiResult<bool>> DeleteOffBoardingDocumentAsync(int documentId)
    {
        var document = await context.OffBoardingDocuments
            .FirstOrDefaultAsync(d => d.Id == documentId && !d.isDeleted);

        if (document == null)
        {
            return ApiResult<bool>.NotFound("Belge bulunamadı");
        }

        // Delete physical file
        if (!string.IsNullOrWhiteSpace(document.DocumentPath))
        {
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "offboarding");
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

        logger.LogInformation("OffBoardingDocument deleted: {Id}", documentId);

        return ApiResult<bool>.Ok(true, "Belge başarıyla silindi");
    }

    public async Task<string> SaveDocumentFileAsync(IFormFile file, int userId, int documentId)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is empty");
        }

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "offboarding");
        
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

        logger.LogInformation("OffBoarding document file saved: {FilePath} for user {UserId}, document {DocumentId}", 
            filePath, userId, documentId);

        return fileName;
    }
}

