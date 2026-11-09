using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YegnaBet.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedListingViewsDatesP3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ListingViewsCount_UserId",
                schema: "public",
                table: "ListingViewsCount");

            migrationBuilder.CreateIndex(
                name: "IX_ListingViewsCount_UserId",
                schema: "public",
                table: "ListingViewsCount",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ListingViewsCount_UserId",
                schema: "public",
                table: "ListingViewsCount");

            migrationBuilder.CreateIndex(
                name: "IX_ListingViewsCount_UserId",
                schema: "public",
                table: "ListingViewsCount",
                column: "UserId",
                unique: true);
        }
    }
}
