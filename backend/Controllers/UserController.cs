using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Zenabackend.Common;
using Zenabackend.DTOs;
using Zenabackend.Models;
using Zenabackend.Services;

namespace Zenabackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    private readonly ILogger<UserController> _logger;

    public UserController(UserService userService, ILogger<UserController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    // Kullanıcı detaylarını getir
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResult<UserDetailDto>>> GetUserDetail(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userIdClaim == null || !int.TryParse(userIdClaim, out int requestingUserId))
            return Ok(ApiResult<UserDetailDto>.Unauthorized("Unauthorized"));

        if (!Enum.TryParse<UserRole>(roleClaim, out var requestingUserRole))
            return Ok(ApiResult<UserDetailDto>.Unauthorized("Invalid role"));

        var result = await _userService.GetUserDetailAsync(id, requestingUserId, requestingUserRole);
        return Ok(result);
    }

    // Kullanıcı bilgilerini güncelle
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResult<UserDetailDto>>> UpdateUser(int id, [FromBody] UpdateUserDto updateDto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userIdClaim == null || !int.TryParse(userIdClaim, out int requestingUserId))
            return Ok(ApiResult<UserDetailDto>.Unauthorized("Unauthorized"));

        if (!Enum.TryParse<UserRole>(roleClaim, out var requestingUserRole))
            return Ok(ApiResult<UserDetailDto>.Unauthorized("Invalid role"));

        var result = await _userService.UpdateUserAsync(id, updateDto, requestingUserId, requestingUserRole);
        return Ok(result);
    }

    // Yönetici için personel listesi
    [HttpGet("personnel")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<PagedResultDto<UserResponseDto>>>> GetPersonnelList(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await _userService.GetPersonnelListAsync(pageNumber, pageSize);
        return Ok(result);
    }

    // Yönetici için EmploymentInfo ekleme
    [HttpPost("employment-info")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<EmploymentInfoDto>>> CreateEmploymentInfo([FromBody] CreateEmploymentInfoDto createDto)
    {
        var result = await _userService.CreateEmploymentInfoAsync(createDto);
        return Ok(result);
    }

    // Yönetici için EmploymentInfo güncelleme
    [HttpPut("employment-info/{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<EmploymentInfoDto>>> UpdateEmploymentInfo(int id, [FromBody] UpdateEmploymentInfoDto updateDto)
    {
        var result = await _userService.UpdateEmploymentInfoAsync(id, updateDto);
        return Ok(result);
    }

    // Yönetici için EmploymentInfo silme
    [HttpDelete("employment-info/{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> DeleteEmploymentInfo(int id)
    {
        var result = await _userService.DeleteEmploymentInfoAsync(id);
        return Ok(result);
    }

    // Profil fotoğrafı yükleme
    [HttpPost("{id}/photo")]
    public async Task<ActionResult<ApiResult<string>>> UploadProfilePhoto(int id, IFormFile photo)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userIdClaim == null || !int.TryParse(userIdClaim, out int requestingUserId))
            return Ok(ApiResult<string>.Unauthorized("Unauthorized"));

        if (!Enum.TryParse<UserRole>(roleClaim, out var requestingUserRole))
            return Ok(ApiResult<string>.Unauthorized("Invalid role"));

        if (photo == null || photo.Length == 0)
        {
            return Ok(ApiResult<string>.BadRequest("Geçerli bir dosya yükleyiniz"));
        }

        var result = await _userService.UploadProfilePhotoAsync(id, photo, requestingUserId, requestingUserRole);
        return Ok(result);
    }

    // Profil fotoğrafını silme
    [HttpDelete("{id}/photo")]
    public async Task<ActionResult<ApiResult<bool>>> DeleteProfilePhoto(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userIdClaim == null || !int.TryParse(userIdClaim, out int requestingUserId))
            return Ok(ApiResult<bool>.Unauthorized("Unauthorized"));

        if (!Enum.TryParse<UserRole>(roleClaim, out var requestingUserRole))
            return Ok(ApiResult<bool>.Unauthorized("Invalid role"));

        var result = await _userService.DeleteProfilePhotoAsync(id, requestingUserId, requestingUserRole);
        return Ok(result);
    }

}

