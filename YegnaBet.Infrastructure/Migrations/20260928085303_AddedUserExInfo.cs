using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YegnaBet.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedUserExInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UsersEx",
                schema: "public",
                columns: table => new
                {
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    LocationId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsersEx", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_UsersEx_Locations_LocationId",
                        column: x => x.LocationId,
                        principalSchema: "public",
                        principalTable: "Locations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UsersEx_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "public",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Locations_Country_City_Area_SubArea",
                schema: "public",
                table: "Locations",
                columns: new[] { "Country", "City", "Area", "SubArea" },
                unique: true)
                .Annotation("Npgsql:NullsDistinct", false);

            migrationBuilder.CreateIndex(
                name: "IX_UsersEx_LocationId",
                schema: "public",
                table: "UsersEx",
                column: "LocationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UsersEx",
                schema: "public");

            migrationBuilder.DropIndex(
                name: "IX_Locations_Country_City_Area_SubArea",
                schema: "public",
                table: "Locations");
        }
    }
}
