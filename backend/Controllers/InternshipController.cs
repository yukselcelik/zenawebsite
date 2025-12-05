using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Zenabackend.Common;
using Zenabackend.DTOs;
using Zenabackend.Services;

namespace Zenabackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InternshipController(
    InternshipService internshipService, 
    ILogger<InternshipController> logger,
    IConfiguration configuration)
    : ControllerBase
{
    [HttpPost("apply")]
    [RequestSizeLimit(10_000_000)] // 10MB limit
    public async Task<ActionResult<ApiResult<InternshipApplicationResponseDto>>> Apply(
        [FromForm] ApplyInternshipApplicationFormDto request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.FullName) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Phone))
            {
                return Ok(ApiResult<InternshipApplicationResponseDto>.BadRequest(
                    "Zorunlu alanlar eksik: Ad Soyad, E-posta, Telefon"));
            }

            var result = await internshipService.CreateApplicationAsync(request);

            if (!result.Success || result.Data == null)
            {
                return Ok(result);
            }

            var cvFile = request.CvFile;
            if (cvFile is not { Length: > 0 }) return Ok(result);
            try
            {
                var originalFileName = cvFile.FileName;
                var cvFileName = await internshipService.SaveCvFileAsync(cvFile, result.Data.Id);

                var application = await internshipService.GetApplicationByIdAsync(result.Data.Id);
                if (application != null)
                {
                    application.CvFilePath = cvFileName;
                    application.OriginalFileName = originalFileName;
                    await internshipService.UpdateApplicationAsync(application);
                }

                // Build full URL for response
                var baseUrl = configuration["FileStorage:BaseUrl"]?.TrimEnd('/') ?? "http://localhost:5133";
                result.Data.CvFilePath = $"{baseUrl}/uploads/cvs/{cvFileName}";
                result.Data.OriginalFileName = originalFileName;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to save CV file for application {ApplicationId}", result.Data.Id);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error creating internship application");
            return Ok(ApiResult<InternshipApplicationResponseDto>.BadRequest("Başvuru oluşturulurken hata oluştu"));
        }
    }

    [HttpGet("applications")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<PagedResultDto<InternshipApplicationResponseDto>>>> GetAllApplications(
        [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var result = await internshipService.GetAllApplicationsAsync(pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("{applicationId}/cv")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> DownloadCv(int applicationId)
    {
        try
        {
            var application = await internshipService.GetApplicationByIdAsync(applicationId);
            if (application == null || string.IsNullOrEmpty(application.CvFilePath))
            {
                return NotFound("CV dosyası bulunamadı");
            }

            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "cvs");
            var filePath = Path.Combine(uploadsPath, application.CvFilePath);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("CV dosyası bulunamadı");
            }

            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            // Use original file name if available, otherwise use stored file name
            var fileName = !string.IsNullOrEmpty(application.OriginalFileName) 
                ? application.OriginalFileName 
                : Path.GetFileName(application.CvFilePath);
            var contentType = GetContentType(fileName);

            Response.Headers.Append("Content-Disposition", $"attachment; filename=\"{fileName}\"");
            return File(fileBytes, contentType, fileName);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error downloading CV for application {ApplicationId}", applicationId);
            return StatusCode(500, "CV dosyası indirilirken hata oluştu");
        }
    }

    private string GetContentType(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        return extension switch
        {
            ".pdf" => "application/pdf",
            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            _ => "application/octet-stream"
        };
    }
}