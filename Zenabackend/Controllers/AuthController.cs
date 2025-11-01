using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Zenabackend.Common;
using Zenabackend.DTOs;
using Zenabackend.Services;

namespace Zenabackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResult<AuthResponseDto>>> Register([FromBody] RegisterDto registerDto)
    {
        var result = await _authService.RegisterAsync(registerDto);

        if (result == null)
        {
            // Email kontrolü için tekrar kontrol et
            if (await _authService.CheckEmailExistsAsync(registerDto.Email))
                return Ok(ApiResult<AuthResponseDto>.BadRequest("Email already exists", 400));
            
            // Kayıt başarılı, onay bekleniyor
            return Ok(ApiResult<AuthResponseDto>.Ok(null, "Kayıt başarılı. Yönetici onayından sonra giriş yapabilirsiniz."));
        }

        return Ok(ApiResult<AuthResponseDto>.Ok(result));
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResult<AuthResponseDto>>> Login([FromBody] LoginDto loginDto)
    {
        var result = await _authService.LoginAsync(loginDto);

        if (result == null)
        {
            // Kullanıcı var ama onaylanmamış olabilir
            var isApproved = await _authService.CheckUserApprovalStatusAsync(loginDto.Email);
            if (!isApproved.HasValue)
            {
                return Ok(ApiResult<AuthResponseDto>.Unauthorized("Invalid email or password"));
            }
            if (!isApproved.Value)
            {
                return Ok(ApiResult<AuthResponseDto>.Unauthorized("Hesabınız henüz onaylanmamış. Lütfen yönetici onayı bekleyin."));
            }
            return Ok(ApiResult<AuthResponseDto>.Unauthorized("Invalid email or password"));
        }

        return Ok(ApiResult<AuthResponseDto>.Ok(result));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ApiResult<MeDto>>> GetMe()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            return Ok(ApiResult<MeDto>.Unauthorized("Unauthorized"));

        var result = await _authService.GetMeAsync(userId);
        return Ok(result);
    }

    [HttpGet("pending-users")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<PagedResultDto<UserResponseDto>>>> GetPendingUsers([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _authService.GetPendingUsersAsync(pageNumber, pageSize);
        return Ok(result);
    }

    [HttpPut("approve-user/{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> ApproveUser(int id)
    {
        var result = await _authService.ApproveUserAsync(id);
        return Ok(result);
    }

    [HttpDelete("reject-user/{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> RejectUser(int id)
    {
        var result = await _authService.RejectUserAsync(id);
        return Ok(result);
    }
}