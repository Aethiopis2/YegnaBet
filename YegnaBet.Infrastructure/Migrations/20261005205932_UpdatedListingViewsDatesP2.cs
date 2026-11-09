using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YegnaBet.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedListingViewsDatesP2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ListingViewsDates_UserId",
                schema: "public",
                table: "ListingViewsDates");

            migrationBuilder.CreateIndex(
                name: "IX_ListingViewsDates_UserId",
                schema: "public",
                table: "ListingViewsDates",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ListingViewsDates_UserId",
                schema: "public",
                table: "ListingViewsDates");

            migrationBuilder.CreateIndex(
                name: "IX_ListingViewsDates_UserId",
                schema: "public",
                table: "ListingViewsDates",
                column: "UserId",
                unique: true);
        }
    }
}
