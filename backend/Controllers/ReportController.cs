using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Zenabackend.Common;
using Zenabackend.DTOs;
using Zenabackend.Services;

namespace Zenabackend.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize]
public class ReportController(ReportService reportService, ILogger<ReportController> logger) : ControllerBase
{
    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }

    private bool IsManager()
    {
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
        return roleClaim == "Manager";
    }

    [HttpGet("all")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<List<ReportDto>>>> GetAllReports()
    {
        var result = await reportService.GetAllReportsAsync();
        return Ok(result);
    }

    [HttpGet("my-reports/{userId:int}")]
    public async Task<ActionResult<ApiResult<List<ReportDto>>>> GetMyReports(int userId)
    {
        // Kullanıcı sadece kendi raporlarını görebilir
        var currentUserId = GetUserId();
        if (currentUserId != userId && !IsManager())
        {
            return Ok(ApiResult<List<ReportDto>>.BadRequest("Bu işlem için yetkiniz bulunmamaktadır"));
        }

        var result = await reportService.GetMyReportsAsync(userId);
        return Ok(result);
    }

    [HttpPost("upload")]
    public async Task<ActionResult<ApiResult<ReportDto>>> UploadReport(
        [FromForm] IFormFile? file,
        [FromForm] int reportType,
        [FromForm] int userId)
    {
        try
        {
            var currentUserId = GetUserId();
            var isManager = IsManager();

            // Çalışan sadece belirli rapor tiplerini yükleyebilir
            // Sadece: ARGE, Proje Geliştirme, İş Geliştirme, Yatırım
            var employeeAllowedTypes = new[] { 2, 3, 4, 5 };
            if (!isManager && !employeeAllowedTypes.Contains(reportType))
            {
                return Ok(ApiResult<ReportDto>.BadRequest("Bu rapor tipini yüklemek için yetkiniz bulunmamaktadır"));
            }

            // Çalışan sadece kendi adına yükleyebilir
            if (!isManager && currentUserId != userId)
            {
                return Ok(ApiResult<ReportDto>.BadRequest("Sadece kendi raporlarınızı yükleyebilirsiniz"));
            }

            if (file == null || file.Length == 0)
            {
                return Ok(ApiResult<ReportDto>.BadRequest("Dosya seçilmedi"));
            }

            // Sadece PDF dosyaları kabul et
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (fileExtension != ".pdf")
            {
                return Ok(ApiResult<ReportDto>.BadRequest("Sadece PDF dosyaları yüklenebilir"));
            }

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "reports");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = $"report_{reportType}_{userId}_{DateTime.UtcNow:yyyyMMddHHmmss}{fileExtension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var documentPath = $"/uploads/reports/{fileName}";
            var originalFileName = file.FileName;

            logger.LogInformation("Report saved: {FilePath} for user {UserId}, ReportType: {ReportType}", filePath, userId, reportType);

            var result = await reportService.CreateReportAsync(
                userId,
                reportType,
                documentPath,
                originalFileName);

            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error uploading report. UserId: {UserId}, ReportType: {ReportType}, Exception: {Exception}", GetUserId(), reportType, ex);
            return Ok(ApiResult<ReportDto>.BadRequest($"Rapor yüklenirken hata oluştu: {ex.Message}"));
        }
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> DeleteReport(int id)
    {
        var result = await reportService.DeleteReportAsync(id);
        return Ok(result);
    }

    [HttpGet("{id:int}/download")]
    public async Task<IActionResult> DownloadReport(int id)
    {
        var allReports = await reportService.GetAllReportsAsync();
        var currentUserId = GetUserId();
        var isManager = IsManager();

        if (!allReports.Success || allReports.Data == null)
        {
            return NotFound();
        }

        var report = allReports.Data.FirstOrDefault(r => r.Id == id);
        if (report == null || string.IsNullOrEmpty(report.DocumentPath))
        {
            return NotFound("Rapor bulunamadı");
        }

        // Çalışan sadece kendi raporlarını görebilir
        if (!isManager && report.UploadedByUserId != currentUserId)
        {
            return Unauthorized("Bu raporu görüntülemek için yetkiniz bulunmamaktadır");
        }

        var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", report.DocumentPath.TrimStart('/'));

        if (!System.IO.File.Exists(fullPath))
        {
            return NotFound("Rapor dosyası bulunamadı");
        }

        var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath);
        return File(fileBytes, "application/pdf", report.OriginalFileName ?? "report.pdf");
    }
}
