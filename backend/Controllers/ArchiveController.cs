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
public class ArchiveController(ArchiveService archiveService, ILogger<ArchiveController> logger) : ControllerBase
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

    [HttpGet("all")]
    // Controller seviyesinde [Authorize] var, tüm authenticated kullanıcılar erişebilir
    public async Task<ActionResult<ApiResult<List<ArchiveDocumentDto>>>> GetAllArchiveDocuments()
    {
        var result = await archiveService.GetAllArchiveDocumentsAsync();
        return Ok(result);
    }

    [HttpGet("by-type/{documentType:int}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<ArchiveDocumentDto>>> GetArchiveDocumentByType(int documentType)
    {
        var result = await archiveService.GetArchiveDocumentByTypeAsync(documentType);
        return Ok(result);
    }

    [HttpPost("upload")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<ArchiveDocumentDto>>> UploadArchiveDocument(
        [FromForm] IFormFile? document,
        [FromForm] int documentType)
    {
        try
        {
            if (document == null || document.Length == 0)
            {
                return Ok(ApiResult<ArchiveDocumentDto>.BadRequest("Dosya seçilmedi"));
            }

            // PDF ve Excel dosyaları kabul et
            var fileExtension = Path.GetExtension(document.FileName).ToLowerInvariant();
            var allowedExtensions = new[] { ".pdf", ".xlsx", ".xls" };
            if (!allowedExtensions.Contains(fileExtension))
            {
                return Ok(ApiResult<ArchiveDocumentDto>.BadRequest("Sadece PDF ve Excel dosyaları yüklenebilir"));
            }

            var userId = GetUserId();

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "archive");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = $"archive_{documentType}_{userId}_{DateTime.UtcNow:yyyyMMddHHmmss}{fileExtension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await document.CopyToAsync(stream);
            }

            var documentPath = $"/uploads/archive/{fileName}";
            var originalFileName = document.FileName;

            logger.LogInformation("Archive document saved: {FilePath} for user {UserId}, DocumentType: {DocumentType}", filePath, userId, documentType);

            var result = await archiveService.CreateOrUpdateArchiveDocumentAsync(
                userId, 
                documentType, 
                documentPath, 
                originalFileName);

            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error uploading archive document. UserId: {UserId}, DocumentType: {DocumentType}, Exception: {Exception}", GetUserId(), documentType, ex);
            return Ok(ApiResult<ArchiveDocumentDto>.BadRequest($"Arşiv belgesi yüklenirken hata oluştu: {ex.Message}"));
        }
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ApiResult<bool>>> DeleteArchiveDocument(int id)
    {
        var result = await archiveService.DeleteArchiveDocumentAsync(id);
        return Ok(result);
    }

    [HttpGet("{id:int}/document")]
    // Controller seviyesinde [Authorize] var, tüm authenticated kullanıcılar erişebilir
    public async Task<IActionResult> GetDocument(int id)
    {
        var allDocuments = await archiveService.GetAllArchiveDocumentsAsync();
        
        if (!allDocuments.Success || allDocuments.Data == null)
        {
            return NotFound();
        }

        var document = allDocuments.Data.FirstOrDefault(d => d.Id == id);
        if (document == null || string.IsNullOrEmpty(document.DocumentPath))
        {
            return NotFound("Belge bulunamadı");
        }

        var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", document.DocumentPath.TrimStart('/'));
        
        if (!System.IO.File.Exists(fullPath))
        {
            return NotFound("Belge dosyası bulunamadı");
        }

        var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath);
        
        // Dosya uzantısına göre content type belirle
        var fileExtension = Path.GetExtension(document.DocumentPath).ToLowerInvariant();
        var contentType = fileExtension switch
        {
            ".pdf" => "application/pdf",
            ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ".xls" => "application/vnd.ms-excel",
            _ => "application/octet-stream"
        };
        
        var defaultFileName = fileExtension switch
        {
            ".pdf" => "document.pdf",
            ".xlsx" => "document.xlsx",
            ".xls" => "document.xls",
            _ => "document"
        };
        
        return File(fileBytes, contentType, document.OriginalFileName ?? defaultFileName);
    }
}

