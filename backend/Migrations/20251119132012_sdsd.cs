using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zenabackend.Migrations
{
    /// <inheritdoc />
    public partial class sdsd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OriginalFileName",
                table: "SocialSecurityDocuments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OriginalFileName",
                table: "LegalDocuments",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OriginalFileName",
                table: "SocialSecurityDocuments");

            migrationBuilder.DropColumn(
                name: "OriginalFileName",
                table: "LegalDocuments");
        }
    }
}
