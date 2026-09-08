using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YegnaBet.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPreciseLisitingLocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Latitude",
                schema: "public",
                table: "Listings",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Longitude",
                schema: "public",
                table: "Listings",
                type: "numeric",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                schema: "public",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "Longitude",
                schema: "public",
                table: "Listings");
        }
    }
}
