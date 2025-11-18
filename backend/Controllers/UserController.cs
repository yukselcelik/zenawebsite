using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Zenabackend.Common;
using Zenabackend.DTOs;
using Zenabackend.Services;
using Zenabackend.Enums;

namespace Zenabackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController(UserService userService, SocialSecurityService socialSecurityService) : ControllerBase
{

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResult<UserDetailDto>>> GetUserDetail(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userIdClaim == null || !int.TryParse(userIdClaim, out var requestingUserId))
            return Ok(ApiResult<UserDetailDto>.Unauthorized());

        if (!Enum.TryParse<UserRoleEnum>(roleClaim, out var requestingUserRole))
            return Ok(ApiResult<UserDetailDto>.Unauthorized("Invalid role"));

        var result = await userService.GetUserDetailAsync(id, requestingUserId, requestingUserRole);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResult<UserDetailDto>>> UpdateUser(int id, [FromBody] UpdateUserDto updateDto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userIdClaim == null || !int.TryParse(userIdClaim, out var requestingUserId))
            return Ok(ApiResult<UserDetailDto>.Unauthorized());

        if (!Enum.TryParse<UserRoleEnum>(roleClaim, out var requestingUserRole))
            return Ok(ApiResult<UserDetailDto>.Unauthorized("Invalid role"));

        var result = await userService.UpdateUserAsync(id, updateDto, requestingUserId, requestingUserRole);
        return Ok(result);
    }

    [HttpGet("personnel")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<PagedResultDto<UserResponseDto>>>> GetPersonnelList(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await userService.GetPersonnelListAsync(pageNumber, pageSize);
        return Ok(result);
    }

    [HttpPost("employment-info")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<EmploymentInfoDto>>> CreateEmploymentInfo([FromBody] CreateEmploymentInfoDto createDto)
    {
        var result = await userService.CreateEmploymentInfoAsync(createDto);
        return Ok(result);
    }

    [HttpPut("employment-info/{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<EmploymentInfoDto>>> UpdateEmploymentInfo(int id, [FromBody] UpdateEmploymentInfoDto updateDto)
    {
        var result = await userService.UpdateEmploymentInfoAsync(id, updateDto);
        return Ok(result);
    }

    [HttpDelete("employment-info/{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> DeleteEmploymentInfo(int id)
    {
        var result = await userService.DeleteEmploymentInfoAsync(id);
        return Ok(result);
    }

    [HttpPost("{id:int}/photo")]
    public async Task<ActionResult<ApiResult<string>>> UploadProfilePhoto(int id, IFormFile? photo)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userIdClaim == null || !int.TryParse(userIdClaim, out var requestingUserId))
            return Ok(ApiResult<string>.Unauthorized());

        if (!Enum.TryParse<UserRoleEnum>(roleClaim, out var requestingUserRole))
            return Ok(ApiResult<string>.Unauthorized("Invalid role"));

        if (photo == null || photo.Length == 0)
        {
            return Ok(ApiResult<string>.BadRequest("Geçerli bir dosya yükleyiniz"));
        }

        var result = await userService.UploadProfilePhotoAsync(id, photo, requestingUserId, requestingUserRole);
        return Ok(result);
    }

    [HttpDelete("{id:int}/photo")]
    public async Task<ActionResult<ApiResult<bool>>> DeleteProfilePhoto(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userIdClaim == null || !int.TryParse(userIdClaim, out var requestingUserId))
            return Ok(ApiResult<bool>.Unauthorized());

        if (!Enum.TryParse<UserRoleEnum>(roleClaim, out var requestingUserRole))
            return Ok(ApiResult<bool>.Unauthorized("Invalid role"));

        var result = await userService.DeleteProfilePhotoAsync(id, requestingUserId, requestingUserRole);
        return Ok(result);
    }

    [HttpGet("{userId:int}/social-security")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<SocialSecurityDto>>> GetSocialSecurity(int userId)
    {
        var result = await socialSecurityService.GetSocialSecurityByUserIdAsync(userId);
        return Ok(result);
    }

    [HttpPost("social-security")]
    [Authorize(Roles = "Manager")]
    [RequestSizeLimit(10_000_000)] // 10MB limit
    public async Task<ActionResult<ApiResult<SocialSecurityDto>>> CreateOrUpdateSocialSecurity([FromBody] CreateSocialSecurityDto dto)
    {
        var result = await socialSecurityService.CreateOrUpdateSocialSecurityAsync(dto);
        return Ok(result);
    }

    [HttpPost("social-security/document")]
    [Authorize(Roles = "Manager")]
    [RequestSizeLimit(10_000_000)] // 10MB limit
    public async Task<ActionResult<ApiResult<SocialSecurityDocumentDto>>> UploadSocialSecurityDocument(
        [FromForm] int userId,
        [FromForm] SocialSecurityDocumentType documentType,
        [FromForm] IFormFile file)
    {
        var dto = new CreateSocialSecurityDocumentDto
        {
            UserId = userId,
            DocumentType = documentType,
            File = file
        };

        var result = await socialSecurityService.CreateSocialSecurityDocumentAsync(dto, file);
        return Ok(result);
    }

    [HttpDelete("social-security/document/{id:int}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> DeleteSocialSecurityDocument(int id)
    {
        var result = await socialSecurityService.DeleteSocialSecurityDocumentAsync(id);
        return Ok(result);
    }
}

