using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Zenabackend.Common;
using Zenabackend.DTOs;
using Zenabackend.Services;

namespace Zenabackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AuthService authService) : ControllerBase
{

    [HttpPost("register")]
    public async Task<ActionResult<ApiResult<AuthResponseDto>>> Register([FromBody] RegisterDto registerDto)
    {
        var result = await authService.RegisterAsync(registerDto);

        if (result != null)
            return Ok(ApiResult<AuthResponseDto>.Ok(result,
                "Kayıt işleminiz başarıyla tamamlandı. Hesabınız yönetici onayı bekliyor."));
        
        if (await authService.CheckEmailExistsAsync(registerDto.Email))
            return Ok(ApiResult<AuthResponseDto>.BadRequest("Email already exists"));

        return Ok(ApiResult<AuthResponseDto>.Ok(null!,
            "Kayıt başarılı. Yönetici onayından sonra giriş yapabilirsiniz."));

    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResult<AuthResponseDto>>> Login([FromBody] LoginDto loginDto)
    {
        // Önce kullanıcının onay durumunu kontrol et
        var isApproved = await authService.CheckUserApprovalStatusAsync(loginDto.Email);
        
        // Kullanıcı varsa ve onaylanmamışsa direkt engelle
        if (isApproved.HasValue && !isApproved.Value)
        {
            return Ok(ApiResult<AuthResponseDto>.Unauthorized(
                "Hesabınız henüz onaylanmamış. Lütfen yönetici onayı bekleyin."));
        }

        // Login işlemini gerçekleştir
        var result = await authService.LoginAsync(loginDto);

        if (result == null)
        {
            // Kullanıcı bulunamadı veya şifre yanlış
            return Ok(ApiResult<AuthResponseDto>.Unauthorized("Invalid email or password"));
        }

        return Ok(ApiResult<AuthResponseDto>.Ok(result));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ApiResult<MeDto>>> GetMe()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
            return Ok(ApiResult<MeDto>.Unauthorized());

        var result = await authService.GetMeAsync(userId);
        return Ok(result);
    }

    [HttpGet("pending-users")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<PagedResultDto<UserResponseDto>>>> GetPendingUsers(
        [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var result = await authService.GetPendingUsersAsync(pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("users")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<PagedResultDto<UserResponseDto>>>> GetAllPersonnelUsers(
        [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var result = await authService.GetAllPersonnelUsersAsync(pageNumber, pageSize);
        return Ok(result);
    }

    [HttpPut("approve-user/{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> ApproveUser(int id)
    {
        var result = await authService.ApproveUserAsync(id);
        return Ok(result);
    }

    [HttpDelete("reject-user/{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> RejectUser(int id)
    {
        var result = await authService.RejectUserAsync(id);
        return Ok(result);
    }

    [HttpPut("update-user-approval/{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> UpdateUserApproval(int id, [FromBody] UpdateUserApprovalDto dto)
    {
        var result = await authService.UpdateUserApprovalStatusAsync(id, dto.IsApproved);
        return Ok(result);
    }

    [HttpDelete("delete-user/{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> DeleteUser(int id)
    {
        var result = await authService.DeleteUserAsync(id);
        return Ok(result);
    }
}