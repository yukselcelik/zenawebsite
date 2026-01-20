using System;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Zenabackend.Data;

#nullable disable

namespace Zenabackend.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260120160000_AddBirthInfoToUsers")]
    public class AddBirthInfoToUsers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BirthPlace",
                table: "Users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "BirthDate",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BirthPlace",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "BirthDate",
                table: "Users");
        }
    }
}

