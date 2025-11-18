using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Zenabackend.Migrations
{
    /// <inheritdoc />
    public partial class Documents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "isDeleted",
                table: "LeaveRequests",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "InternshipApplications",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "isDeleted",
                table: "InternshipApplications",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "LegalDocuments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DocumentPath = table.Column<string>(type: "text", nullable: true),
                    LegalDocumentType = table.Column<int>(type: "integer", nullable: false),
                    LegalDocumentTypeName = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    isDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LegalDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LegalDocuments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SocialSecurities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    SocialSecurityNumber = table.Column<string>(type: "text", nullable: true),
                    TaxNumber = table.Column<string>(type: "text", nullable: false),
                    isDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "SocialSecurityDocuments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DocumentPath = table.Column<string>(type: "text", nullable: true),
                    DocumentType = table.Column<int>(type: "integer", nullable: false),
                    DocumentTypeName = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    SocialSecurityId = table.Column<int>(type: "integer", nullable: true),
                    isDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SocialSecurityDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SocialSecurityDocuments_SocialSecurities_SocialSecurityId",
                        column: x => x.SocialSecurityId,
                        principalTable: "SocialSecurities",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SocialSecurityDocuments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LegalDocuments_UserId",
                table: "LegalDocuments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SocialSecurities_UserId",
                table: "SocialSecurities",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SocialSecurityDocuments_SocialSecurityId",
                table: "SocialSecurityDocuments",
                column: "SocialSecurityId");

            migrationBuilder.CreateIndex(
                name: "IX_SocialSecurityDocuments_UserId",
                table: "SocialSecurityDocuments",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LegalDocuments");

            migrationBuilder.DropTable(
                name: "SocialSecurityDocuments");

            migrationBuilder.DropTable(
                name: "SocialSecurities");

            migrationBuilder.DropColumn(
                name: "isDeleted",
                table: "LeaveRequests");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "InternshipApplications");

            migrationBuilder.DropColumn(
                name: "isDeleted",
                table: "InternshipApplications");
        }
    }
}
