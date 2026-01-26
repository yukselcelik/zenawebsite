using Microsoft.EntityFrameworkCore;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Enums;
using Zenabackend.Models;

namespace Zenabackend.Services;

public class ArchiveService(ApplicationDbContext context, ILogger<ArchiveService> logger)
{
    public async Task<ApiResult<List<ArchiveDocumentDto>>> GetAllArchiveDocumentsAsync()
    {
        try
        {
            var documents = await context.ArchiveDocuments
                .Where(d => !d.isDeleted)
                .Include(d => d.UploadedByUser)
                .OrderBy(d => d.DocumentType)
                .ThenByDescending(d => d.CreatedAt)
                .ToListAsync();

            var documentDtos = documents.Select(d => new ArchiveDocumentDto
            {
                Id = d.Id,
                DocumentType = (int)d.DocumentType,
                DocumentTypeName = GetDocumentTypeName(d.DocumentType),
                DocumentPath = d.DocumentPath,
                OriginalFileName = d.OriginalFileName,
                UploadedByUserId = d.UploadedByUserId,
                UploadedByUserName = d.UploadedByUser?.FirstName + " " + d.UploadedByUser?.LastName,
                CreatedAt = d.CreatedAt,
                UpdatedAt = d.UpdatedAt
            }).ToList();

            return ApiResult<List<ArchiveDocumentDto>>.Success(documentDtos);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting all archive documents");
            return ApiResult<List<ArchiveDocumentDto>>.BadRequest($"Arşiv belgeleri getirilirken hata oluştu: {ex.Message}");
        }
    }

    public async Task<ApiResult<ArchiveDocumentDto>> GetArchiveDocumentByTypeAsync(int documentType)
    {
        try
        {
            var document = await context.ArchiveDocuments
                .Where(d => !d.isDeleted && d.DocumentType == (ArchiveDocumentTypeEnum)documentType)
                .Include(d => d.UploadedByUser)
                .OrderByDescending(d => d.CreatedAt)
                .FirstOrDefaultAsync();

            if (document == null)
            {
                return ApiResult<ArchiveDocumentDto>.BadRequest("Belge bulunamadı");
            }

            var dto = new ArchiveDocumentDto
            {
                Id = document.Id,
                DocumentType = (int)document.DocumentType,
                DocumentTypeName = GetDocumentTypeName(document.DocumentType),
                DocumentPath = document.DocumentPath,
                OriginalFileName = document.OriginalFileName,
                UploadedByUserId = document.UploadedByUserId,
                UploadedByUserName = document.UploadedByUser?.FirstName + " " + document.UploadedByUser?.LastName,
                CreatedAt = document.CreatedAt,
                UpdatedAt = document.UpdatedAt
            };

            return ApiResult<ArchiveDocumentDto>.Success(dto);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting archive document by type: {DocumentType}", documentType);
            return ApiResult<ArchiveDocumentDto>.BadRequest($"Arşiv belgesi getirilirken hata oluştu: {ex.Message}");
        }
    }

    public async Task<ApiResult<ArchiveDocumentDto>> CreateOrUpdateArchiveDocumentAsync(
        int userId, 
        int documentType, 
        string documentPath, 
        string originalFileName)
    {
        try
        {
            var existingDocument = await context.ArchiveDocuments
                .Where(d => !d.isDeleted && d.DocumentType == (ArchiveDocumentTypeEnum)documentType)
                .OrderByDescending(d => d.CreatedAt)
                .FirstOrDefaultAsync();

            if (existingDocument != null)
            {
                // Eski dosyayı sil
                if (!string.IsNullOrEmpty(existingDocument.DocumentPath))
                {
                    var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", existingDocument.DocumentPath.TrimStart('/'));
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        try
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                        catch (Exception ex)
                        {
                            logger.LogWarning(ex, "Error deleting old archive document file: {FilePath}", oldFilePath);
                        }
                    }
                }

                // Mevcut belgeyi güncelle
                existingDocument.DocumentPath = documentPath;
                existingDocument.OriginalFileName = originalFileName;
                existingDocument.UploadedByUserId = userId;
                existingDocument.UpdatedAt = DateTime.UtcNow.AddHours(3);

                await context.SaveChangesAsync();

                var updatedDto = await GetArchiveDocumentByTypeAsync(documentType);
                return updatedDto;
            }
            else
            {
                // Yeni belge oluştur
                var newDocument = new ArchiveDocument
                {
                    DocumentType = (ArchiveDocumentTypeEnum)documentType,
                    DocumentPath = documentPath,
                    OriginalFileName = originalFileName,
                    UploadedByUserId = userId,
                    CreatedAt = DateTime.UtcNow.AddHours(3),
                    UpdatedAt = DateTime.UtcNow.AddHours(3)
                };

                context.ArchiveDocuments.Add(newDocument);
                await context.SaveChangesAsync();

                var newDto = await GetArchiveDocumentByTypeAsync(documentType);
                return newDto;
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error creating/updating archive document. UserId: {UserId}, DocumentType: {DocumentType}", userId, documentType);
            return ApiResult<ArchiveDocumentDto>.BadRequest($"Arşiv belgesi kaydedilirken hata oluştu: {ex.Message}");
        }
    }

    public async Task<ApiResult<bool>> DeleteArchiveDocumentAsync(int documentId)
    {
        try
        {
            var document = await context.ArchiveDocuments
                .FirstOrDefaultAsync(d => d.Id == documentId && !d.isDeleted);

            if (document == null)
            {
                return ApiResult<bool>.BadRequest("Belge bulunamadı");
            }

            // Dosyayı sil
            if (!string.IsNullOrEmpty(document.DocumentPath))
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", document.DocumentPath.TrimStart('/'));
                if (System.IO.File.Exists(filePath))
                {
                    try
                    {
                        System.IO.File.Delete(filePath);
                    }
                    catch (Exception ex)
                    {
                        logger.LogWarning(ex, "Error deleting archive document file: {FilePath}", filePath);
                    }
                }
            }

            document.isDeleted = true;
            document.UpdatedAt = DateTime.UtcNow.AddHours(3);

            await context.SaveChangesAsync();

            return ApiResult<bool>.Success(true);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting archive document. DocumentId: {DocumentId}", documentId);
            return ApiResult<bool>.BadRequest($"Arşiv belgesi silinirken hata oluştu: {ex.Message}");
        }
    }

    private string GetDocumentTypeName(ArchiveDocumentTypeEnum documentType)
    {
        return documentType switch
        {
            ArchiveDocumentTypeEnum.Diploma => "Diploma",
            ArchiveDocumentTypeEnum.Bordro => "Bordro",
            ArchiveDocumentTypeEnum.AvansFormu => "Avans Formu",
            ArchiveDocumentTypeEnum.FisFormu => "Fiş Formu",
            ArchiveDocumentTypeEnum.NoterBelgeleri => "Noter Belgeleri",
            ArchiveDocumentTypeEnum.Vekaletname => "Vekaletname",
            ArchiveDocumentTypeEnum.Bilanco => "Bilanço",
            ArchiveDocumentTypeEnum.GelirTablosu => "Gelir Tablosu",
            ArchiveDocumentTypeEnum.IsSozlesmesi => "İş Sözleşmesi",
            ArchiveDocumentTypeEnum.IsKurallari => "İş Kuralları",
            ArchiveDocumentTypeEnum.OrganizasyonSemasi => "Organizasyon Şeması",
            ArchiveDocumentTypeEnum.IsAkisCizelgesi => "İş Akış Çizelgesi",
            ArchiveDocumentTypeEnum.ToplantiNotlari => "Toplantı Notları",
            ArchiveDocumentTypeEnum.ArgeCalismaRaporu => "ARGE Çalışma Raporu",
            ArchiveDocumentTypeEnum.ProjeProjeGelistirmeCalismaRaporu => "Proje - Proje Geliştirme Çalışma Raporu",
            ArchiveDocumentTypeEnum.IsGelistirmeCalismaRaporu => "İş Geliştirme Çalışma Raporu",
            ArchiveDocumentTypeEnum.YatirimCalismaRaporu => "Yatırım Çalışma Raporu",
            ArchiveDocumentTypeEnum.IsgRaporu => "İSG Raporu",
            _ => "Bilinmeyen"
        };
    }
}

