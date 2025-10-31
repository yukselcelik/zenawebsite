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
            return Ok(ApiResult<AuthResponseDto>.BadRequest("Email already exists", 400));

        return Ok(ApiResult<AuthResponseDto>.Ok(result));
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResult<AuthResponseDto>>> Login([FromBody] LoginDto loginDto)
    {
        var result = await _authService.LoginAsync(loginDto);

        if (result == null)
            return Ok(ApiResult<AuthResponseDto>.Unauthorized("Invalid email or password"));

        return Ok(ApiResult<AuthResponseDto>.Ok(result));
    }

    [HttpGet("me")]
    [Authorize]
    public ActionResult<ApiResult<object>> GetMe()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        
        if (userId == null)
            return Ok(ApiResult<object>.Unauthorized("Unauthorized"));

        var data = new
        {
            UserId = userId,
            Email = email
        };

        return Ok(ApiResult<object>.Ok(data));
    }
}