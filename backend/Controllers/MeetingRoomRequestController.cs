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
public class MeetingRoomRequestController(MeetingRoomRequestService meetingRoomRequestService) : ControllerBase
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

    [HttpPost("request")]
    public async Task<ActionResult<ApiResult<MeetingRoomRequestResponseDto>>> CreateMeetingRoomRequest(
        [FromBody] CreateMeetingRoomRequestDto dto)
    {
        var userId = GetUserId();
        var result = await meetingRoomRequestService.CreateMeetingRoomRequestAsync(userId, dto);

        return Ok(result);
    }

    [HttpGet("my-requests")]
    public async Task<ActionResult<ApiResult<PagedResultDto<MeetingRoomRequestResponseDto>>>> GetMyMeetingRoomRequests(
        [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var userId = GetUserId();
        var result = await meetingRoomRequestService.GetMyMeetingRoomRequestsAsync(userId, pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("all-requests")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<PagedResultDto<MeetingRoomRequestResponseDto>>>> GetAllMeetingRoomRequests(
        [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var result = await meetingRoomRequestService.GetAllMeetingRoomRequestsAsync(pageNumber, pageSize);
        return Ok(result);
    }

    [HttpPut("{id:int}/approve")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> ApproveMeetingRoomRequest(int id)
    {
        var result = await meetingRoomRequestService.ApproveMeetingRoomRequestAsync(id);
        return Ok(result);
    }

    [HttpPut("{id:int}/reject")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> RejectMeetingRoomRequest(int id)
    {
        var result = await meetingRoomRequestService.RejectMeetingRoomRequestAsync(id);
        return Ok(result);
    }
}

