using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Zenabackend.Common;
using Zenabackend.DTOs;
using Zenabackend.Services;

namespace Zenabackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OtherRequestController(OtherRequestService otherRequestService) : ControllerBase
{
    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }

    [HttpPost("request")]
    public async Task<ActionResult<ApiResult<OtherRequestResponseDto>>> CreateOtherRequest(
        [FromBody] CreateOtherRequestDto dto)
    {
        var userId = GetUserId();
        var result = await otherRequestService.CreateOtherRequestAsync(userId, dto);

        return Ok(result);
    }

    [HttpGet("my-requests")]
    public async Task<ActionResult<ApiResult<PagedResultDto<OtherRequestResponseDto>>>> GetMyOtherRequests(
        [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var userId = GetUserId();
        var result = await otherRequestService.GetMyOtherRequestsAsync(userId, pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("all-requests")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<PagedResultDto<OtherRequestResponseDto>>>> GetAllOtherRequests(
        [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var result = await otherRequestService.GetAllOtherRequestsAsync(pageNumber, pageSize);
        return Ok(result);
    }
}

