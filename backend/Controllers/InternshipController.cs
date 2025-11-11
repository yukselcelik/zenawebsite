using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Zenabackend.Common;
using Zenabackend.DTOs;
using Zenabackend.Services;

namespace Zenabackend.Controllers;

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
    public async Task<ActionResult<ApiResult<InternshipApplicationResponseDto>>> Apply(ApplyInternshipApplicationFormDto request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.FullName) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Phone))
            {
                return Ok(ApiResult<InternshipApplicationResponseDto>.BadRequest("Zorunlu alanlar eksik: Ad Soyad, E-posta, Telefon"));
            }

            var result = await _internshipService.CreateApplicationAsync(request);

            if (!result.Success || result.Data == null)
            {
                return Ok(result);
            }

            var cvFile = request.CvFile;
            if (cvFile is not { Length: > 0 }) return Ok(result);
            try
            {
                var cvFilePath = await _internshipService.SaveCvFileAsync(cvFile, result.Data.Id);
                    
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
}