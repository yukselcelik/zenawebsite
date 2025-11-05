using Microsoft.EntityFrameworkCore;
using Zenabackend.Common;
using Zenabackend.Data;
using Zenabackend.DTOs;
using Zenabackend.Models;

namespace Zenabackend.Services;

public class InternshipService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<InternshipService> _logger;

    public InternshipService(ApplicationDbContext context, ILogger<InternshipService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<ApiResult<InternshipApplicationResponseDto>> CreateApplicationAsync(CreateInternshipApplicationDto dto)
    {
        var application = new InternshipApplication
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Phone = dto.Phone,
            School = dto.School,
            Department = dto.Department,
            Year = dto.Year,
            Message = dto.Message,
            CreatedAt = DateTime.UtcNow.AddHours(3)
        };

        _context.InternshipApplications.Add(application);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Internship application created: {Id} by {FullName}", application.Id, application.FullName);

        var response = new InternshipApplicationResponseDto
        {
            Id = application.Id,
            FullName = application.FullName,
            Email = application.Email,
            Phone = application.Phone,
            School = application.School,
            Department = application.Department,
            Year = application.Year,
            Message = application.Message,
            CreatedAt = application.CreatedAt
        };

        return ApiResult<InternshipApplicationResponseDto>.Ok(response);
    }

    public async Task<ApiResult<PagedResultDto<InternshipApplicationResponseDto>>> GetAllApplicationsAsync(int pageNumber = 1, int pageSize = 10)
    {
        var query = _context.InternshipApplications
            .AsNoTracking()
            .OrderByDescending(a => a.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var applications = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = applications.Select(a => new InternshipApplicationResponseDto
        {
            Id = a.Id,
            FullName = a.FullName,
            Email = a.Email,
            Phone = a.Phone,
            School = a.School,
            Department = a.Department,
            Year = a.Year,
            Message = a.Message,
            CreatedAt = a.CreatedAt
        }).ToList();

        var response = new PagedResultDto<InternshipApplicationResponseDto>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };

        return ApiResult<PagedResultDto<InternshipApplicationResponseDto>>.Ok(response);
    }
}