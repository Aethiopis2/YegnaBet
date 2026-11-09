using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YegnaBet.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedListingViewsDates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ListingViewsDates_ListingViewsCount_ListingViewsCountId",
                schema: "public",
                table: "ListingViewsDates");

            migrationBuilder.RenameColumn(
                name: "ListingViewsCountId",
                schema: "public",
                table: "ListingViewsDates",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_ListingViewsDates_ListingViewsCountId",
                schema: "public",
                table: "ListingViewsDates",
                newName: "IX_ListingViewsDates_UserId");

            migrationBuilder.AddColumn<long>(
                name: "ListingId",
                schema: "public",
                table: "ListingViewsDates",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_ListingViewsDates_ListingId",
                schema: "public",
                table: "ListingViewsDates",
                column: "ListingId");

            migrationBuilder.AddForeignKey(
                name: "FK_ListingViewsDates_Listings_ListingId",
                schema: "public",
                table: "ListingViewsDates",
                column: "ListingId",
                principalSchema: "public",
                principalTable: "Listings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ListingViewsDates_Users_UserId",
                schema: "public",
                table: "ListingViewsDates",
                column: "UserId",
                principalSchema: "public",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ListingViewsDates_Listings_ListingId",
                schema: "public",
                table: "ListingViewsDates");

            migrationBuilder.DropForeignKey(
                name: "FK_ListingViewsDates_Users_UserId",
                schema: "public",
                table: "ListingViewsDates");

            migrationBuilder.DropIndex(
                name: "IX_ListingViewsDates_ListingId",
                schema: "public",
                table: "ListingViewsDates");

            migrationBuilder.DropColumn(
                name: "ListingId",
                schema: "public",
                table: "ListingViewsDates");

            migrationBuilder.RenameColumn(
                name: "UserId",
                schema: "public",
                table: "ListingViewsDates",
                newName: "ListingViewsCountId");

            migrationBuilder.RenameIndex(
                name: "IX_ListingViewsDates_UserId",
                schema: "public",
                table: "ListingViewsDates",
                newName: "IX_ListingViewsDates_ListingViewsCountId");

            migrationBuilder.AddForeignKey(
                name: "FK_ListingViewsDates_ListingViewsCount_ListingViewsCountId",
                schema: "public",
                table: "ListingViewsDates",
                column: "ListingViewsCountId",
                principalSchema: "public",
                principalTable: "ListingViewsCount",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
