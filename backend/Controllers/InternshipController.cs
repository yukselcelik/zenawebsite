using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Zenabackend.Common;
using Zenabackend.DTOs;
using Zenabackend.Services;
using System.Text.Json;

namespace Zenabackend.Controllers;

public record ApplyInternshipApplicationRequest(IFormFile? cvFile, string applicationData);

[ApiController]
[Route("api/[controller]")]
public class InternshipController : ControllerBase
{
    private readonly InternshipService _internshipService;
    private readonly ILogger<InternshipController> _logger;

    public InternshipController(InternshipService internshipService, ILogger<InternshipController> logger)
    {
        _internshipService = internshipService;
        _logger = logger;
    }

    [HttpPost("apply")]
    [RequestSizeLimit(10_000_000)] // 10MB limit
    public async Task<ActionResult<ApiResult<InternshipApplicationResponseDto>>> Apply(ApplyInternshipApplicationRequest request)
    {
        try
        {
            CreateInternshipApplicationDto? dto;
            
            // JSON verisini parse et
            try
            {
                dto = JsonSerializer.Deserialize<CreateInternshipApplicationDto>(request.applicationData, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Failed to parse application data");
                return Ok(ApiResult<InternshipApplicationResponseDto>.BadRequest("Geçersiz başvuru verisi"));
            }

            if (dto == null)
            {
                return Ok(ApiResult<InternshipApplicationResponseDto>.BadRequest("Başvuru verisi boş olamaz"));
            }

            // Önce başvuruyu oluştur
            var result = await _internshipService.CreateApplicationAsync(dto);

            if (!result.Success || result.Data == null)
            {
                return Ok(result);
            }

            // Eğer dosya varsa kaydet
            string? cvFilePath = null;
            if (request.cvFile != null && request.cvFile.Length > 0)
            {
                try
                {
                    cvFilePath = await _internshipService.SaveCvFileAsync(request.cvFile, result.Data.Id);
                    
                    // Başvuruyu güncelle (dosya yolunu ekle)
                    var application = await _internshipService.GetApplicationByIdAsync(result.Data.Id);
                    if (application != null)
                    {
                        application.CvFilePath = cvFilePath;
                        await _internshipService.UpdateApplicationAsync(application);
                    }
                    
                    result.Data.CvFilePath = cvFilePath;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to save CV file for application {ApplicationId}", result.Data.Id);
                    // Dosya kaydetme hatası olsa bile başvuruyu döndür
                }
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating internship application");
            return Ok(ApiResult<InternshipApplicationResponseDto>.BadRequest("Başvuru oluşturulurken hata oluştu"));
        }
    }

    [HttpGet("applications")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<PagedResultDto<InternshipApplicationResponseDto>>>> GetAllApplications([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _internshipService.GetAllApplicationsAsync(pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("{id}/cv")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> DownloadCv(int id)
    {
        try
        {
            var (fileBytes, fileName, contentType) = await _internshipService.GetCvFileAsync(id);
            return File(fileBytes, contentType, fileName);
        }
        catch (FileNotFoundException ex)
        {
            _logger.LogWarning(ex, "CV file not found for application {ApplicationId}", id);
            return NotFound(ApiResult<object>.NotFound("CV dosyası bulunamadı"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading CV for application {ApplicationId}", id);
            return StatusCode(500, ApiResult<object>.BadRequest("CV dosyası indirilirken hata oluştu"));
        }
    }
}