using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zenabackend.Migrations
{
    /// <inheritdoc />
    public partial class jobpositions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Position",
                table: "InternshipApplications",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Position",
                table: "InternshipApplications");
        }
    }
}
