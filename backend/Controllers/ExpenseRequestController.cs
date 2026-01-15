using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Zenabackend.Common;
using Zenabackend.DTOs;
using Zenabackend.Enums;
using Zenabackend.Services;

namespace Zenabackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExpenseRequestController(ExpenseRequestService expenseRequestService, ILogger<ExpenseRequestController> logger) : ControllerBase
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
    public async Task<ActionResult<ApiResult<ExpenseRequestDto>>> CreateExpenseRequest(
        [FromBody] CreateExpenseRequestDto dto)
    {
        var userId = GetUserId();
        var result = await expenseRequestService.CreateExpenseRequestAsync(userId, dto);

        return Ok(result);
    }

    [HttpPost("request/with-document")]
    public async Task<ActionResult<ApiResult<ExpenseRequestDto>>> CreateExpenseRequestWithDocument(
        [FromForm] IFormFile? document)
    {
        try
        {
            var userId = GetUserId();
            string? documentPath = null;
            string? originalFileName = null;

            // FormData'dan değerleri al
            var requestDateStr = Request.Form["requestDate"].ToString();
            var expenseTypeStr = Request.Form["expenseType"].ToString();
            var requestedAmountStr = Request.Form["requestedAmount"].ToString();
            var description = Request.Form["description"].ToString();

            logger.LogInformation("Creating expense request. RequestDate: {RequestDate}, ExpenseType: {ExpenseType}, RequestedAmount: {RequestedAmount}, Description: {Description}", 
                requestDateStr, expenseTypeStr, requestedAmountStr, description);

            DateTime? requestDate = null;
            if (!string.IsNullOrEmpty(requestDateStr) && DateTime.TryParse(requestDateStr, out DateTime parsedDate))
            {
                requestDate = parsedDate;
            }
            else if (!string.IsNullOrEmpty(requestDateStr))
            {
                logger.LogWarning("Invalid request date format: {RequestDate}", requestDateStr);
            }

            if (string.IsNullOrEmpty(expenseTypeStr) || !int.TryParse(expenseTypeStr, out int expenseType))
            {
                logger.LogWarning("Invalid expense type: {ExpenseType}", expenseTypeStr);
                return Ok(ApiResult<ExpenseRequestDto>.BadRequest("Masraf türü geçerli değil"));
            }

            if (string.IsNullOrEmpty(requestedAmountStr) || !decimal.TryParse(requestedAmountStr.Replace(',', '.'), System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out decimal requestedAmount))
            {
                logger.LogWarning("Invalid requested amount: {RequestedAmount}", requestedAmountStr);
                return Ok(ApiResult<ExpenseRequestDto>.BadRequest("Talep edilen tutar geçerli değil"));
            }

            if (string.IsNullOrEmpty(description))
            {
                logger.LogWarning("Description is empty");
                return Ok(ApiResult<ExpenseRequestDto>.BadRequest("Açıklama girilmelidir"));
            }

            var dto = new CreateExpenseRequestDto
            {
                RequestDate = requestDate,
                ExpenseType = expenseType,
                RequestedAmount = requestedAmount,
                Description = description
            };

            if (document != null && document.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "expenses");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var fileExtension = Path.GetExtension(document.FileName);
                var fileName = $"{userId}_{DateTime.UtcNow:yyyyMMddHHmmss}{fileExtension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await document.CopyToAsync(stream);
                }

                documentPath = $"/uploads/expenses/{fileName}";
                originalFileName = document.FileName;

                logger.LogInformation("Expense document saved: {FilePath} for user {UserId}", filePath, userId);
            }

            var result = await expenseRequestService.CreateExpenseRequestAsync(userId, dto, documentPath, originalFileName);
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error creating expense request with document. UserId: {UserId}, Exception: {Exception}", GetUserId(), ex);
            return Ok(ApiResult<ExpenseRequestDto>.BadRequest($"Masraf talebi oluşturulurken hata oluştu: {ex.Message}"));
        }
    }

    [HttpGet("my-requests")]
    public async Task<ActionResult<ApiResult<PagedResultDto<ExpenseRequestDto>>>> GetMyExpenseRequests(
        [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var userId = GetUserId();
        var result = await expenseRequestService.GetMyExpenseRequestsAsync(userId, pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("all-requests")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<PagedResultDto<ExpenseRequestDto>>>> GetAllExpenseRequests(
        [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var result = await expenseRequestService.GetAllExpenseRequestsAsync(pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResult<ExpenseRequestDto>>> GetExpenseRequest(int id)
    {
        var result = await expenseRequestService.GetExpenseRequestByIdAsync(id);
        return Ok(result);
    }

    [HttpPut("{id:int}/approve")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<ExpenseRequestDto>>> ApproveExpenseRequest(
        int id, [FromBody] UpdateExpenseRequestDto dto)
    {
        var approvedByUserId = GetUserId();
        var result = await expenseRequestService.ApproveExpenseRequestAsync(id, approvedByUserId, dto);
        return Ok(result);
    }

    [HttpPut("{id:int}/reject")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<ExpenseRequestDto>>> RejectExpenseRequest(int id)
    {
        var rejectedByUserId = GetUserId();
        var result = await expenseRequestService.RejectExpenseRequestAsync(id, rejectedByUserId);
        return Ok(result);
    }

    [HttpPut("{id:int}/mark-paid")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<ExpenseRequestDto>>> MarkAsPaid(
        int id, [FromBody] UpdateExpenseRequestDto dto)
    {
        var result = await expenseRequestService.MarkAsPaidAsync(id, dto);
        return Ok(result);
    }

    [HttpGet("{id:int}/document")]
    public async Task<IActionResult> GetDocument(int id)
    {
        var expenseRequest = await expenseRequestService.GetExpenseRequestByIdAsync(id);
        
        if (!expenseRequest.Success || expenseRequest.Data == null)
        {
            return NotFound();
        }

        var userId = GetUserId();
        var isManager = IsManager();

        // Sadece kendi talebi veya yönetici belgeyi görebilir
        if (!isManager && expenseRequest.Data.UserId != userId)
        {
            return Forbid();
        }

        var documentPath = expenseRequest.Data.DocumentPath;
        if (string.IsNullOrEmpty(documentPath))
        {
            return NotFound("Belge bulunamadı");
        }

        var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", documentPath.TrimStart('/'));
        
        if (!System.IO.File.Exists(fullPath))
        {
            return NotFound("Belge dosyası bulunamadı");
        }

        var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath);
        var contentType = "application/octet-stream";
        
        // Dosya uzantısına göre content type belirle
        var extension = Path.GetExtension(fullPath).ToLowerInvariant();
        contentType = extension switch
        {
            ".pdf" => "application/pdf",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            _ => "application/octet-stream"
        };

        return File(fileBytes, contentType, expenseRequest.Data.OriginalFileName ?? "document");
    }
}

