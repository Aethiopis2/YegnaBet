using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YegnaBet.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBasicIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Listings_ListingStatus",
                schema: "public",
                table: "Listings",
                column: "ListingStatus");

            migrationBuilder.CreateIndex(
                name: "IX_Inquiries_InquiryStatus",
                schema: "public",
                table: "Inquiries",
                column: "InquiryStatus");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Listings_ListingStatus",
                schema: "public",
                table: "Listings");

            migrationBuilder.DropIndex(
                name: "IX_Inquiries_InquiryStatus",
                schema: "public",
                table: "Inquiries");
        }
    }
}
