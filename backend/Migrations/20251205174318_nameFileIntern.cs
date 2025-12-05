using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zenabackend.Migrations
{
    /// <inheritdoc />
    public partial class nameFileIntern : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OriginalFileName",
                table: "InternshipApplications",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OriginalFileName",
                table: "InternshipApplications");
        }
    }
}
