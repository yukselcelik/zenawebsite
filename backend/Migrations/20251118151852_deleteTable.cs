using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Zenabackend.Migrations
{
    /// <inheritdoc />
    public partial class deleteTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SocialSecurityDocuments_SocialSecurities_SocialSecurityId",
                table: "SocialSecurityDocuments");

            migrationBuilder.DropTable(
                name: "SocialSecurities");

            migrationBuilder.DropIndex(
                name: "IX_SocialSecurityDocuments_SocialSecurityId",
                table: "SocialSecurityDocuments");

            migrationBuilder.DropColumn(
                name: "SocialSecurityId",
                table: "SocialSecurityDocuments");

            migrationBuilder.AddColumn<string>(
                name: "SocialSecurityNumber",
                table: "Users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxNumber",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SocialSecurityNumber",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "TaxNumber",
                table: "Users");

            migrationBuilder.AddColumn<int>(
                name: "SocialSecurityId",
                table: "SocialSecurityDocuments",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SocialSecurities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SocialSecurityNumber = table.Column<string>(type: "text", nullable: true),
                    TaxNumber = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    isDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SocialSecurities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SocialSecurities_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SocialSecurityDocuments_SocialSecurityId",
                table: "SocialSecurityDocuments",
                column: "SocialSecurityId");

            migrationBuilder.CreateIndex(
                name: "IX_SocialSecurities_UserId",
                table: "SocialSecurities",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_SocialSecurityDocuments_SocialSecurities_SocialSecurityId",
                table: "SocialSecurityDocuments",
                column: "SocialSecurityId",
                principalTable: "SocialSecurities",
                principalColumn: "Id");
        }
    }
}
