using Microsoft.EntityFrameworkCore;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Enums;
using Zenabackend.Models;

namespace Zenabackend.Services;

public class ExpenseRequestService(ApplicationDbContext context, ILogger<ExpenseRequestService> logger)
{
    // Talep numarası oluştur (001, 002, ...)
    private async Task<string> GenerateRequestNumberAsync()
    {
        var lastRequest = await context.ExpenseRequests
            .OrderByDescending(er => er.Id)
            .FirstOrDefaultAsync();

        int nextNumber = 1;
        if (lastRequest != null && !string.IsNullOrEmpty(lastRequest.RequestNumber))
        {
            if (int.TryParse(lastRequest.RequestNumber, out int lastNumber))
            {
                nextNumber = lastNumber + 1;
            }
        }

        return nextNumber.ToString("D3"); // 001, 002, 003 formatında
    }

    public async Task<ApiResult<ExpenseRequestDto>> CreateExpenseRequestAsync(int userId, CreateExpenseRequestDto dto, string? documentPath = null, string? originalFileName = null)
    {
        try
        {
            var requestNumber = await GenerateRequestNumberAsync();
            var now = DateTime.UtcNow;

            // Talep tarihi varsa kullan, yoksa şu anki tarihi kullan
            var requestDate = dto.RequestDate.HasValue 
                ? dto.RequestDate.Value.ToUniversalTime() 
                : now;

            var expenseRequest = new ExpenseRequest
            {
                UserId = userId,
                RequestNumber = requestNumber,
                RequestDate = requestDate,
                ExpenseType = (ExpenseTypeEnum)dto.ExpenseType,
                RequestedAmount = dto.RequestedAmount,
                Description = dto.Description,
                DocumentPath = documentPath,
                OriginalFileName = originalFileName,
                Status = ExpenseStatusEnum.Pending,
                CreatedAt = now,
                UpdatedAt = now
            };

            context.ExpenseRequests.Add(expenseRequest);
            await context.SaveChangesAsync();

            logger.LogInformation("Expense request created: {Id} by user {UserId}", expenseRequest.Id, userId);

            // User bilgisini yükle
            await context.Entry(expenseRequest).Reference(er => er.User).LoadAsync();
            
            var result = await MapToDtoAsync(expenseRequest);
            return ApiResult<ExpenseRequestDto>.Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error creating expense request for user {UserId}. Exception: {Exception}", userId, ex);
            return ApiResult<ExpenseRequestDto>.BadRequest($"Masraf talebi oluşturulurken hata oluştu: {ex.Message}");
        }
    }

    public async Task<ApiResult<PagedResultDto<ExpenseRequestDto>>> GetMyExpenseRequestsAsync(int userId, int pageNumber = 1, int pageSize = 10)
    {
        var query = context.ExpenseRequests
            .AsNoTracking()
            .Include(er => er.User)
            .Where(er => er.UserId == userId && !er.isDeleted)
            .OrderByDescending(er => er.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var expenseRequests = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = new List<ExpenseRequestDto>();
        foreach (var er in expenseRequests)
        {
            items.Add(await MapToDtoAsync(er));
        }

        var response = new PagedResultDto<ExpenseRequestDto>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };

        return ApiResult<PagedResultDto<ExpenseRequestDto>>.Ok(response);
    }

    public async Task<ApiResult<PagedResultDto<ExpenseRequestDto>>> GetAllExpenseRequestsAsync(int pageNumber = 1, int pageSize = 10)
    {
        var query = context.ExpenseRequests
            .AsNoTracking()
            .Include(er => er.User)
            .Include(er => er.ApprovedByUser)
            .Where(er => !er.isDeleted)
            .OrderByDescending(er => er.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var expenseRequests = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = new List<ExpenseRequestDto>();
        foreach (var er in expenseRequests)
        {
            items.Add(await MapToDtoAsync(er));
        }

        var response = new PagedResultDto<ExpenseRequestDto>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };

        return ApiResult<PagedResultDto<ExpenseRequestDto>>.Ok(response);
    }

    public async Task<ApiResult<ExpenseRequestDto>> GetExpenseRequestByIdAsync(int id)
    {
        var expenseRequest = await context.ExpenseRequests
            .AsNoTracking()
            .Include(er => er.User)
            .Include(er => er.ApprovedByUser)
            .FirstOrDefaultAsync(er => er.Id == id && !er.isDeleted);

        if (expenseRequest == null)
        {
            return ApiResult<ExpenseRequestDto>.NotFound("Masraf talebi bulunamadı");
        }

        var result = await MapToDtoAsync(expenseRequest);
        return ApiResult<ExpenseRequestDto>.Ok(result);
    }

    public async Task<ApiResult<bool>> DeleteExpenseRequestAsync(int id, int actingUserId, bool isManager)
    {
        var expenseRequest = await context.ExpenseRequests.FirstOrDefaultAsync(er => er.Id == id && !er.isDeleted);
        if (expenseRequest == null)
        {
            return ApiResult<bool>.NotFound("Masraf talebi bulunamadı");
        }

        if (!isManager && expenseRequest.UserId != actingUserId)
        {
            return ApiResult<bool>.Forbidden("Bu masraf talebini silme yetkiniz yok");
        }

        // Personel sadece bekleyen talebini silebilsin
        if (!isManager && expenseRequest.Status != ExpenseStatusEnum.Pending)
        {
            return ApiResult<bool>.BadRequest("Sadece beklemede olan masraf talepleri silinebilir");
        }

        expenseRequest.isDeleted = true;
        expenseRequest.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        logger.LogInformation("Expense request deleted: {Id} by user {UserId} (isManager={IsManager})", id, actingUserId, isManager);
        return ApiResult<bool>.Ok(true);
    }

    public async Task<ApiResult<ExpenseRequestDto>> ApproveExpenseRequestAsync(int id, int approvedByUserId, UpdateExpenseRequestDto dto)
    {
        var expenseRequest = await context.ExpenseRequests
            .FirstOrDefaultAsync(er => er.Id == id);

        if (expenseRequest == null)
        {
            return ApiResult<ExpenseRequestDto>.NotFound("Masraf talebi bulunamadı");
        }

        if (expenseRequest.Status != ExpenseStatusEnum.Pending)
        {
            return ApiResult<ExpenseRequestDto>.BadRequest("Bu masraf talebi zaten işleme alınmış");
        }

        expenseRequest.Status = ExpenseStatusEnum.Approved;
        expenseRequest.ApprovedAmount = dto.ApprovedAmount ?? expenseRequest.RequestedAmount;
        expenseRequest.Department = dto.Department;
        expenseRequest.ApprovedByUserId = approvedByUserId;
        expenseRequest.ApprovedAt = DateTime.UtcNow;
        expenseRequest.UpdatedAt = DateTime.UtcNow;
        
        // Talep tarihi güncellenmişse
        if (dto.RequestDate.HasValue)
        {
            expenseRequest.RequestDate = dto.RequestDate.Value.ToUniversalTime();
        }

        await context.SaveChangesAsync();

        logger.LogInformation("Expense request approved: {Id} by user {UserId}", id, approvedByUserId);

        var result = await MapToDtoAsync(expenseRequest);
        return ApiResult<ExpenseRequestDto>.Ok(result);
    }

    public async Task<ApiResult<ExpenseRequestDto>> RejectExpenseRequestAsync(int id, int rejectedByUserId, string? rejectionReason = null)
    {
        var expenseRequest = await context.ExpenseRequests
            .FirstOrDefaultAsync(er => er.Id == id);

        if (expenseRequest == null)
        {
            return ApiResult<ExpenseRequestDto>.NotFound("Masraf talebi bulunamadı");
        }

        if (expenseRequest.Status != ExpenseStatusEnum.Pending)
        {
            return ApiResult<ExpenseRequestDto>.BadRequest("Bu masraf talebi zaten işleme alınmış");
        }

        expenseRequest.Status = ExpenseStatusEnum.Rejected;
        expenseRequest.ApprovedByUserId = rejectedByUserId;
        expenseRequest.RejectedAt = DateTime.UtcNow;
        expenseRequest.RejectionReason = rejectionReason;
        expenseRequest.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        logger.LogInformation("Expense request rejected: {Id} by user {UserId} with reason: {Reason}", id, rejectedByUserId, rejectionReason ?? "Neden belirtilmedi");

        var result = await MapToDtoAsync(expenseRequest);
        return ApiResult<ExpenseRequestDto>.Ok(result);
    }

    public async Task<ApiResult<ExpenseRequestDto>> MarkAsPaidAsync(int id, UpdateExpenseRequestDto dto)
    {
        var expenseRequest = await context.ExpenseRequests
            .FirstOrDefaultAsync(er => er.Id == id);

        if (expenseRequest == null)
        {
            return ApiResult<ExpenseRequestDto>.NotFound("Masraf talebi bulunamadı");
        }

        if (expenseRequest.Status != ExpenseStatusEnum.Approved)
        {
            return ApiResult<ExpenseRequestDto>.BadRequest("Sadece onaylanmış masraf talepleri ödenmiş olarak işaretlenebilir");
        }

        expenseRequest.Status = ExpenseStatusEnum.Paid;
        expenseRequest.PaymentMethod = dto.PaymentMethod.HasValue ? (PaymentMethodEnum?)dto.PaymentMethod.Value : null;
        expenseRequest.PaidAt = DateTime.UtcNow;
        expenseRequest.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        logger.LogInformation("Expense request marked as paid: {Id}", id);

        var result = await MapToDtoAsync(expenseRequest);
        return ApiResult<ExpenseRequestDto>.Ok(result);
    }

    public async Task<ApiResult<ExpenseRequestDto>> UpdateExpenseStatusAsync(int id, int actingUserId, UpdateExpenseStatusDto dto)
    {
        var expenseRequest = await context.ExpenseRequests
            .Include(er => er.User)
            .Include(er => er.ApprovedByUser)
            .FirstOrDefaultAsync(er => er.Id == id);

        if (expenseRequest == null)
        {
            return ApiResult<ExpenseRequestDto>.NotFound("Masraf talebi bulunamadı");
        }

        if (!Enum.TryParse<ExpenseStatusEnum>(dto.Status, true, out var newStatus))
        {
            return ApiResult<ExpenseRequestDto>.BadRequest("Geçersiz durum");
        }

        // Allow manager to set any status among Pending/Approved/Rejected/Paid.
        // Apply minimal state housekeeping so UI stays consistent.
        expenseRequest.Status = newStatus;
        expenseRequest.UpdatedAt = DateTime.UtcNow;

        if (newStatus == ExpenseStatusEnum.Pending)
        {
            expenseRequest.ApprovedAmount = null;
            expenseRequest.ApprovedAt = null;
            expenseRequest.RejectedAt = null;
            expenseRequest.RejectionReason = null;
            expenseRequest.PaidAt = null;
            expenseRequest.PaymentMethod = null;
            expenseRequest.ApprovedByUserId = null;
        }
        else if (newStatus == ExpenseStatusEnum.Approved)
        {
            expenseRequest.ApprovedAmount ??= expenseRequest.RequestedAmount;
            expenseRequest.ApprovedAt ??= DateTime.UtcNow;
            expenseRequest.RejectedAt = null;
            expenseRequest.RejectionReason = null;
            expenseRequest.PaidAt = null;
            expenseRequest.ApprovedByUserId = actingUserId;
        }
        else if (newStatus == ExpenseStatusEnum.Rejected)
        {
            expenseRequest.RejectedAt ??= DateTime.UtcNow;
            expenseRequest.PaidAt = null;
            expenseRequest.ApprovedByUserId = actingUserId;
        }
        else if (newStatus == ExpenseStatusEnum.Paid)
        {
            // If not approved yet, auto-approve first (best-effort)
            expenseRequest.ApprovedAmount ??= expenseRequest.RequestedAmount;
            expenseRequest.ApprovedAt ??= DateTime.UtcNow;
            expenseRequest.PaidAt ??= DateTime.UtcNow;
            expenseRequest.ApprovedByUserId = actingUserId;
        }

        await context.SaveChangesAsync();

        logger.LogInformation("Expense request status updated: {Id} -> {Status} by {UserId}", id, newStatus, actingUserId);

        var mapped = await MapToDtoAsync(expenseRequest);
        return ApiResult<ExpenseRequestDto>.Ok(mapped);
    }

    private async Task<ExpenseRequestDto> MapToDtoAsync(ExpenseRequest er)
    {
        var dto = new ExpenseRequestDto
        {
            Id = er.Id,
            UserId = er.UserId,
            UserName = er.User?.Name,
            UserSurname = er.User?.Surname,
            RequestNumber = er.RequestNumber,
            RequestDate = er.RequestDate,
            ExpenseType = (int)er.ExpenseType,
            ExpenseTypeName = GetExpenseTypeName(er.ExpenseType),
            RequestedAmount = er.RequestedAmount,
            ApprovedAmount = er.ApprovedAmount,
            Description = er.Description,
            Department = er.Department,
            DocumentPath = er.DocumentPath,
            OriginalFileName = er.OriginalFileName,
            Status = (int)er.Status,
            StatusName = GetStatusName(er.Status),
            ApprovedAt = er.ApprovedAt,
            RejectedAt = er.RejectedAt,
            RejectionReason = er.RejectionReason,
            PaidAt = er.PaidAt,
            PaymentMethod = er.PaymentMethod.HasValue ? (int?)er.PaymentMethod.Value : null,
            PaymentMethodName = er.PaymentMethod.HasValue ? GetPaymentMethodName(er.PaymentMethod.Value) : null,
            ApprovedByUserId = er.ApprovedByUserId,
            ApprovedByUserName = er.ApprovedByUser != null ? $"{er.ApprovedByUser.Name} {er.ApprovedByUser.Surname}" : null
        };

        return dto;
    }

    private string GetExpenseTypeName(ExpenseTypeEnum type)
    {
        return type switch
        {
            ExpenseTypeEnum.Yemek => "Yemek",
            ExpenseTypeEnum.Konaklama => "Konaklama",
            ExpenseTypeEnum.Ulasim => "Ulaşım",
            ExpenseTypeEnum.Agirlama => "Ağırlama",
            ExpenseTypeEnum.OfisGiderleri => "Ofis Giderleri",
            ExpenseTypeEnum.IletisimVeTeknolojiGiderleri => "İletişim ve Teknoloji Giderleri",
            ExpenseTypeEnum.PersonelVeOrganizasyonGiderleri => "Personel ve Organizasyon Giderleri",
            ExpenseTypeEnum.BakimOnarimVeHizmetGiderleri => "Bakım, Onarım ve Hizmet Giderleri",
            ExpenseTypeEnum.FinansalVeResmiGiderler => "Finansal ve Resmi Giderler",
            ExpenseTypeEnum.DigerGiderler => "Diğer Giderler",
            _ => type.ToString()
        };
    }

    private string GetStatusName(ExpenseStatusEnum status)
    {
        return status switch
        {
            ExpenseStatusEnum.Pending => "Beklemede",
            ExpenseStatusEnum.Approved => "Onaylandı",
            ExpenseStatusEnum.Rejected => "Reddedildi",
            ExpenseStatusEnum.Paid => "Ödendi",
            _ => status.ToString()
        };
    }

    private string GetPaymentMethodName(PaymentMethodEnum method)
    {
        return method switch
        {
            PaymentMethodEnum.Nakit => "Nakit",
            PaymentMethodEnum.Havale => "Havale",
            PaymentMethodEnum.EFT => "EFT",
            PaymentMethodEnum.KrediKarti => "Kredi Kartı",
            PaymentMethodEnum.Diger => "Diğer",
            _ => method.ToString()
        };
    }
}

