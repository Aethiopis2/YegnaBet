using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YegnaBet.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RestoreLatLongBacktoListing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                schema: "public",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "Longitude",
                schema: "public",
                table: "Locations");

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                schema: "public",
                table: "Listings",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                schema: "public",
                table: "Listings",
                type: "double precision",
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

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                schema: "public",
                table: "Locations",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                schema: "public",
                table: "Locations",
                type: "double precision",
                nullable: true);
        }
    }
}
