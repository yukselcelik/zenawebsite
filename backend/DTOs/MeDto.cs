#nullable disable

namespace Zenabackend.DTOs
{
    public class MeDto
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string? PhotoPath { get; set; }
        public string Role { get; set; }
    }
}