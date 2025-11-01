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
    public async Task<ActionResult<ApiResult<InternshipApplicationResponseDto>>> Apply([FromBody] CreateInternshipApplicationDto dto)
    {
        var result = await _internshipService.CreateApplicationAsync(dto);

        if (!result.Success)
        {
            return Ok(result);
        }

        return Ok(result);
    }

    [HttpGet("applications")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<PagedResultDto<InternshipApplicationResponseDto>>>> GetAllApplications([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _internshipService.GetAllApplicationsAsync(pageNumber, pageSize);
        return Ok(result);
    }
}