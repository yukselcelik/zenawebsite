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
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    private readonly SocialSecurityService _socialSecurityService;
    private readonly LegalDocumentService _legalDocumentService;
    private readonly OffBoardingService _offBoardingService;
    private readonly RightsAndReceivablesService _rightsAndReceivablesService;
    private readonly ILogger<UserController> _logger;

    public UserController(UserService userService, SocialSecurityService socialSecurityService, LegalDocumentService legalDocumentService, OffBoardingService offBoardingService, RightsAndReceivablesService rightsAndReceivablesService, ILogger<UserController> logger)
    {
        _userService = userService;
        _socialSecurityService = socialSecurityService;
        _legalDocumentService = legalDocumentService;
        _offBoardingService = offBoardingService;
        _rightsAndReceivablesService = rightsAndReceivablesService;
        _logger = logger;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResult<UserDetailDto>>> GetUserDetail(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userIdClaim == null || !int.TryParse(userIdClaim, out var requestingUserId))
            return Ok(ApiResult<UserDetailDto>.Unauthorized());

        if (!Enum.TryParse<UserRoleEnum>(roleClaim, out var requestingUserRole))
            return Ok(ApiResult<UserDetailDto>.Unauthorized("Invalid role"));

        var result = await _userService.GetUserDetailAsync(id, requestingUserId, requestingUserRole);
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

        var result = await _userService.UpdateUserAsync(id, updateDto, requestingUserId, requestingUserRole);
        return Ok(result);
    }

    [HttpGet("personnel")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<PagedResultDto<UserResponseDto>>>> GetPersonnelList(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await _userService.GetPersonnelListAsync(pageNumber, pageSize);
        return Ok(result);
    }

    [HttpPost("employment-info")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<EmploymentInfoDto>>> CreateEmploymentInfo([FromBody] CreateEmploymentInfoDto createDto)
    {
        var result = await _userService.CreateEmploymentInfoAsync(createDto);
        return Ok(result);
    }

    [HttpPut("employment-info/{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<EmploymentInfoDto>>> UpdateEmploymentInfo(int id, [FromBody] UpdateEmploymentInfoDto updateDto)
    {
        var result = await _userService.UpdateEmploymentInfoAsync(id, updateDto);
        return Ok(result);
    }

    [HttpDelete("employment-info/{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> DeleteEmploymentInfo(int id)
    {
        var result = await _userService.DeleteEmploymentInfoAsync(id);
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

        var result = await _userService.UploadProfilePhotoAsync(id, photo, requestingUserId, requestingUserRole);
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

        var result = await _userService.DeleteProfilePhotoAsync(id, requestingUserId, requestingUserRole);
        return Ok(result);
    }

    [HttpGet("{userId:int}/social-security")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<SocialSecurityDto>>> GetSocialSecurity(int userId)
    {
        var result = await _socialSecurityService.GetSocialSecurityByUserIdAsync(userId);
        return Ok(result);
    }

    [HttpPost("social-security")]
    [Authorize(Roles = "Manager")]
    [RequestSizeLimit(10_000_000)] // 10MB limit
    public async Task<ActionResult<ApiResult<SocialSecurityDto>>> CreateOrUpdateSocialSecurity([FromBody] CreateSocialSecurityDto dto)
    {
        var result = await _socialSecurityService.CreateOrUpdateSocialSecurityAsync(dto);
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

        var result = await _socialSecurityService.CreateSocialSecurityDocumentAsync(dto, file);
        return Ok(result);
    }

    [HttpDelete("social-security/document/{id:int}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> DeleteSocialSecurityDocument(int id)
    {
        var result = await _socialSecurityService.DeleteSocialSecurityDocumentAsync(id);
        return Ok(result);
    }

    [HttpGet("social-security/document/{id:int}/download")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> DownloadSocialSecurityDocument(int id)
    {
        var result = await _socialSecurityService.DownloadSocialSecurityDocumentAsync(id);
        
        if (result.Data == null)
        {
            return NotFound(result.Message ?? "Belge bulunamadı");
        }

        Response.Headers.Append("Content-Disposition", $"attachment; filename=\"{result.Data.FileName}\"");
        return File(result.Data.FileBytes, result.Data.ContentType, result.Data.FileName);
    }

    [HttpGet("{userId:int}/legal-documents")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<LegalDocumentDto>>> GetLegalDocuments(int userId)
    {
        var result = await _legalDocumentService.GetLegalDocumentsByUserIdAsync(userId);
        return Ok(result);
    }

    [HttpPost("legal-documents/document")]
    [Authorize(Roles = "Manager")]
    [RequestSizeLimit(10_000_000)] // 10MB limit
    public async Task<ActionResult<ApiResult<LegalDocumentItemDto>>> UploadLegalDocument(
        [FromForm] int userId,
        [FromForm] LegalDocumentTypeEnum legalDocumentType,
        [FromForm] IFormFile file)
    {
        var dto = new CreateLegalDocumentDto
        {
            UserId = userId,
            LegalDocumentType = legalDocumentType,
            File = file
        };

        var result = await _legalDocumentService.CreateLegalDocumentAsync(dto, file);
        return Ok(result);
    }

    [HttpDelete("legal-documents/document/{id:int}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> DeleteLegalDocument(int id)
    {
        var result = await _legalDocumentService.DeleteLegalDocumentAsync(id);
        return Ok(result);
    }

    [HttpGet("legal-documents/document/{id:int}/download")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> DownloadLegalDocument(int id)
    {
        var result = await _legalDocumentService.DownloadLegalDocumentAsync(id);
        
        if (result.Data == null)
        {
            return NotFound(result.Message ?? "Belge bulunamadı");
        }

        Response.Headers.Append("Content-Disposition", $"attachment; filename=\"{result.Data.FileName}\"");
        return File(result.Data.FileBytes, result.Data.ContentType, result.Data.FileName);
    }

    [HttpGet("{userId:int}/offboarding")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<OffBoardingDto>>> GetOffBoarding(int userId)
    {
        var result = await _offBoardingService.GetOffBoardingByUserIdAsync(userId);
        return Ok(result);
    }

    [HttpPost("offboarding")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<OffBoardingDto>>> CreateOrUpdateOffBoarding([FromBody] CreateOffBoardingDto dto)
    {
        var result = await _offBoardingService.CreateOrUpdateOffBoardingAsync(dto);
        return Ok(result);
    }

    [HttpPost("offboarding/document")]
    [Authorize(Roles = "Manager")]
    [RequestSizeLimit(10_000_000)] // 10MB limit
    public async Task<ActionResult<ApiResult<OffBoardingDocumentDto>>> UploadOffBoardingDocument(
        [FromForm] int userId,
        [FromForm] OffBoardingDocumentTypeEnum documentType,
        [FromForm] IFormFile file)
    {
        var dto = new CreateOffBoardingDocumentDto
        {
            UserId = userId,
            DocumentType = documentType,
            File = file
        };

        var result = await _offBoardingService.CreateOffBoardingDocumentAsync(dto, file);
        return Ok(result);
    }

    [HttpDelete("offboarding/document/{id:int}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> DeleteOffBoardingDocument(int id)
    {
        var result = await _offBoardingService.DeleteOffBoardingDocumentAsync(id);
        return Ok(result);
    }

    [HttpGet("offboarding/document/{id:int}/download")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> DownloadOffBoardingDocument(int id)
    {
        var result = await _offBoardingService.DownloadOffBoardingDocumentAsync(id);
        
        if (result.Data == null)
        {
            return NotFound(result.Message ?? "Belge bulunamadı");
        }

        Response.Headers.Append("Content-Disposition", $"attachment; filename=\"{result.Data.FileName}\"");
        return File(result.Data.FileBytes, result.Data.ContentType, result.Data.FileName);
    }

    [HttpGet("{userId:int}/rights-and-receivables")]
    public async Task<ActionResult<ApiResult<RightsAndReceivablesDto>>> GetRightsAndReceivables(int userId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userIdClaim == null || !int.TryParse(userIdClaim, out var requestingUserId))
            return Ok(ApiResult<RightsAndReceivablesDto>.Unauthorized());

        if (!Enum.TryParse<UserRoleEnum>(roleClaim, out var requestingUserRole))
            return Ok(ApiResult<RightsAndReceivablesDto>.Unauthorized("Invalid role"));

        // Personel sadece kendi bilgilerini görebilir, Yönetici herkesi görebilir
        if (requestingUserRole != UserRoleEnum.Manager && userId != requestingUserId)
            return Ok(ApiResult<RightsAndReceivablesDto>.Unauthorized("Sadece kendi bilgilerinizi görüntüleyebilirsiniz"));

        var result = await _rightsAndReceivablesService.GetRightsAndReceivablesByUserIdAsync(userId);
        return Ok(result);
    }

    [HttpPut("{userId:int}/rights-and-receivables")]
    public async Task<ActionResult<ApiResult<RightsAndReceivablesDto>>> UpdateRightsAndReceivables(
        int userId, 
        [FromBody] UpdateRightsAndReceivablesDto updateDto)
    {
        try
        {
            _logger.LogInformation("UpdateRightsAndReceivables called for userId: {UserId}", userId);
            
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userIdClaim == null || !int.TryParse(userIdClaim, out var requestingUserId))
            {
                _logger.LogWarning("Unauthorized: userIdClaim is null or invalid");
                return Ok(ApiResult<RightsAndReceivablesDto>.Unauthorized());
            }

            if (!Enum.TryParse<UserRoleEnum>(roleClaim, out var requestingUserRole))
            {
                _logger.LogWarning("Unauthorized: Invalid role - {Role}", roleClaim);
                return Ok(ApiResult<RightsAndReceivablesDto>.Unauthorized("Invalid role"));
            }

            // Sadece Yönetici düzenleyebilir
            if (requestingUserRole != UserRoleEnum.Manager)
            {
                _logger.LogWarning("Unauthorized: User {RequestingUserId} is not a Manager", requestingUserId);
                return Ok(ApiResult<RightsAndReceivablesDto>.Unauthorized("Sadece yöneticiler bu bilgileri düzenleyebilir"));
            }

            _logger.LogInformation("Updating rights and receivables for user {UserId}", userId);
            var result = await _rightsAndReceivablesService.CreateOrUpdateRightsAndReceivablesAsync(userId, updateDto);
            _logger.LogInformation("Successfully updated rights and receivables for user {UserId}", userId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating rights and receivables for user {UserId}", userId);
            return Ok(ApiResult<RightsAndReceivablesDto>.BadRequest($"Bir hata oluştu: {ex.Message}"));
        }
    }
}

