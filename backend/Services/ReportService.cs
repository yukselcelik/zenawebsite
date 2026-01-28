using Microsoft.EntityFrameworkCore;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Enums;
using Zenabackend.Models;

namespace Zenabackend.Services;

public class ReportService(ApplicationDbContext context, ILogger<ReportService> logger)
{
    public async Task<ApiResult<List<ReportDto>>> GetAllReportsAsync()
    {
        try
        {
            var reports = await context.Reports
                .Where(r => !r.isDeleted)
                .Include(r => r.UploadedByUser)
                .OrderBy(r => r.ReportType)
                .ThenByDescending(r => r.CreatedAt)
                .ToListAsync();

            var reportDtos = reports.Select(r => new ReportDto
            {
                Id = r.Id,
                ReportType = (int)r.ReportType,
                ReportTypeName = GetReportTypeName(r.ReportType),
                DocumentPath = r.DocumentPath,
                OriginalFileName = r.OriginalFileName,
                UploadedByUserId = r.UploadedByUserId,
                UploadedByUserName = r.UploadedByUser != null ? $"{r.UploadedByUser.Name} {r.UploadedByUser.Surname}" : null,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt
            }).ToList();

            return ApiResult<List<ReportDto>>.Ok(reportDtos);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting all reports");
            return ApiResult<List<ReportDto>>.BadRequest($"Raporlar getirilirken hata oluştu: {ex.Message}");
        }
    }

    public async Task<ApiResult<List<ReportDto>>> GetMyReportsAsync(int userId)
    {
        try
        {
            var reports = await context.Reports
                .Where(r => !r.isDeleted && r.UploadedByUserId == userId)
                .Include(r => r.UploadedByUser)
                .OrderBy(r => r.ReportType)
                .ThenByDescending(r => r.CreatedAt)
                .ToListAsync();

            var reportDtos = reports.Select(r => new ReportDto
            {
                Id = r.Id,
                ReportType = (int)r.ReportType,
                ReportTypeName = GetReportTypeName(r.ReportType),
                DocumentPath = r.DocumentPath,
                OriginalFileName = r.OriginalFileName,
                UploadedByUserId = r.UploadedByUserId,
                UploadedByUserName = r.UploadedByUser != null ? $"{r.UploadedByUser.Name} {r.UploadedByUser.Surname}" : null,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt
            }).ToList();

            return ApiResult<List<ReportDto>>.Ok(reportDtos);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting my reports for userId: {UserId}", userId);
            return ApiResult<List<ReportDto>>.BadRequest($"Raporlar getirilirken hata oluştu: {ex.Message}");
        }
    }

    public async Task<ApiResult<ReportDto>> CreateReportAsync(
        int userId,
        int reportType,
        string documentPath,
        string originalFileName)
    {
        try
        {
            var newReport = new Report
            {
                ReportType = (ReportTypeEnum)reportType,
                DocumentPath = documentPath,
                OriginalFileName = originalFileName,
                UploadedByUserId = userId,
                CreatedAt = DateTime.UtcNow.AddHours(3),
                UpdatedAt = DateTime.UtcNow.AddHours(3)
            };

            context.Reports.Add(newReport);
            await context.SaveChangesAsync();

            var savedReport = await context.Reports
                .Include(r => r.UploadedByUser)
                .FirstOrDefaultAsync(r => r.Id == newReport.Id);

            if (savedReport == null)
            {
                return ApiResult<ReportDto>.BadRequest("Rapor kaydedilemedi");
            }

            var dto = new ReportDto
            {
                Id = savedReport.Id,
                ReportType = (int)savedReport.ReportType,
                ReportTypeName = GetReportTypeName(savedReport.ReportType),
                DocumentPath = savedReport.DocumentPath,
                OriginalFileName = savedReport.OriginalFileName,
                UploadedByUserId = savedReport.UploadedByUserId,
                UploadedByUserName = savedReport.UploadedByUser != null ? $"{savedReport.UploadedByUser.Name} {savedReport.UploadedByUser.Surname}" : null,
                CreatedAt = savedReport.CreatedAt,
                UpdatedAt = savedReport.UpdatedAt
            };

            return ApiResult<ReportDto>.Ok(dto);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error creating report. UserId: {UserId}, ReportType: {ReportType}", userId, reportType);
            return ApiResult<ReportDto>.BadRequest($"Rapor kaydedilirken hata oluştu: {ex.Message}");
        }
    }

    public async Task<ApiResult<bool>> DeleteReportAsync(int reportId)
    {
        try
        {
            var report = await context.Reports
                .FirstOrDefaultAsync(r => r.Id == reportId && !r.isDeleted);

            if (report == null)
            {
                return ApiResult<bool>.BadRequest("Rapor bulunamadı");
            }

            // Dosyayı sil
            if (!string.IsNullOrEmpty(report.DocumentPath))
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", report.DocumentPath.TrimStart('/'));
                if (System.IO.File.Exists(filePath))
                {
                    try
                    {
                        System.IO.File.Delete(filePath);
                    }
                    catch (Exception ex)
                    {
                        logger.LogWarning(ex, "Error deleting report file: {FilePath}", filePath);
                    }
                }
            }

            report.isDeleted = true;
            report.UpdatedAt = DateTime.UtcNow.AddHours(3);

            await context.SaveChangesAsync();

            return ApiResult<bool>.Ok(true);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting report. ReportId: {ReportId}", reportId);
            return ApiResult<bool>.BadRequest($"Rapor silinirken hata oluştu: {ex.Message}");
        }
    }

    private string GetReportTypeName(ReportTypeEnum reportType)
    {
        return reportType switch
        {
            ReportTypeEnum.PerformansDegerlendirmeRaporu => "Performans Değerlendirme Raporu",
            ReportTypeEnum.ArgeCalismaRaporu => "AR-GE Çalışma Raporu",
            ReportTypeEnum.ProjeProjeGelistirmeCalismaRaporu => "Proje / Proje Geliştirme Çalışma Raporu",
            ReportTypeEnum.IsGelistirmeCalismaRaporu => "İş Geliştirme Çalışma Raporu",
            ReportTypeEnum.YatirimCalismaRaporu => "Yatırım Çalışma Raporu",
            ReportTypeEnum.IsgRaporu => "İSG Raporu",
            ReportTypeEnum.AracRaporu => "Araç Raporu",
            ReportTypeEnum.TasinmazRaporu => "Taşınmaz Raporu",
            ReportTypeEnum.FinansRaporu => "Finans Raporu",
            ReportTypeEnum.MuhasebeRaporu => "Muhasebe Raporu",
            ReportTypeEnum.CalisanDevamTakipRaporu => "Çalışan Devam Takip Raporu",
            _ => "Bilinmeyen"
        };
    }
}
