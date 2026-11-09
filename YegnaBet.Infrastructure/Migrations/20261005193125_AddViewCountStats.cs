using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace YegnaBet.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddViewCountStats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ListingViewsCount",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ListingId = table.Column<long>(type: "bigint", nullable: false),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    Count = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListingViewsCount", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ListingViewsCount_Listings_ListingId",
                        column: x => x.ListingId,
                        principalSchema: "public",
                        principalTable: "Listings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ListingViewsCount_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "public",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ListingViewsDates",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ListingViewsCountId = table.Column<long>(type: "bigint", nullable: false),
                    ViewDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListingViewsDates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ListingViewsDates_ListingViewsCount_ListingViewsCountId",
                        column: x => x.ListingViewsCountId,
                        principalSchema: "public",
                        principalTable: "ListingViewsCount",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ListingViewsCount_ListingId",
                schema: "public",
                table: "ListingViewsCount",
                column: "ListingId");

            migrationBuilder.CreateIndex(
                name: "IX_ListingViewsCount_UserId",
                schema: "public",
                table: "ListingViewsCount",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ListingViewsDates_ListingViewsCountId",
                schema: "public",
                table: "ListingViewsDates",
                column: "ListingViewsCountId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ListingViewsDates",
                schema: "public");

            migrationBuilder.DropTable(
                name: "ListingViewsCount",
                schema: "public");
        }
    }
}
