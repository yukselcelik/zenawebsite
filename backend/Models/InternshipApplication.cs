using System.ComponentModel.DataAnnotations;

namespace Zenabackend.Models;

public class InternshipApplication : BaseEntity
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string School { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string Department { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string Year { get; set; } = string.Empty;
    
    [MaxLength(2000)]
    public string Message { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? CvFilePath { get; set; }
}