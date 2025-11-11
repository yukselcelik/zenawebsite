using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Zenabackend.Common;
using Zenabackend.DTOs;
using Zenabackend.Models;
using Zenabackend.Services;

namespace Zenabackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LeaveController : ControllerBase
{
    private readonly LeaveService _leaveService;
    private readonly ILogger<LeaveController> _logger;

    public LeaveController(LeaveService leaveService, ILogger<LeaveController> logger)
    {
        _leaveService = leaveService;
        _logger = logger;
    }

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

    [HttpPost("request")]
    public async Task<ActionResult<ApiResult<LeaveRequestResponseDto>>> CreateLeaveRequest(
        [FromBody] CreateLeaveRequestDto dto)
    {
        var userId = GetUserId();
        var result = await _leaveService.CreateLeaveRequestAsync(userId, dto);

        if (!result.Success)
        {
            return Ok(result);
        }

        return Ok(result);
    }

    [HttpGet("my-requests")]
    public async Task<ActionResult<ApiResult<PagedResultDto<LeaveRequestResponseDto>>>> GetMyLeaveRequests(
        [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var userId = GetUserId();
        var result = await _leaveService.GetMyLeaveRequestsAsync(userId, pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("all-requests")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<PagedResultDto<LeaveRequestResponseDto>>>> GetAllLeaveRequests(
        [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _leaveService.GetAllLeaveRequestsAsync(pageNumber, pageSize);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResult<bool>>> CancelLeaveRequest(int id)
    {
        var userId = GetUserId();
        var isManager = IsManager();
        var result = await _leaveService.CancelLeaveRequestAsync(id, userId, isManager);

        return Ok(result);
    }

    [HttpPut("{id}/approve")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> ApproveLeaveRequest(int id)
    {
        var result = await _leaveService.ApproveLeaveRequestAsync(id);

        return Ok(result);
    }

    [HttpPut("{id}/reject")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> RejectLeaveRequest(int id)
    {
        var result = await _leaveService.RejectLeaveRequestAsync(id);

        return Ok(result);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> UpdateLeaveStatus(int id, [FromBody] UpdateLeaveStatusDto dto)
    {
        if (!Enum.TryParse<LeaveStatus>(dto.Status, out var status))
        {
            return Ok(ApiResult<bool>.BadRequest("Geçersiz durum"));
        }

        var result = await _leaveService.UpdateLeaveStatusAsync(id, status);

        return Ok(result);
    }
}