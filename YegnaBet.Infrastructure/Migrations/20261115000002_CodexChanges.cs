using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YegnaBet.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CodexChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Inquiries_Users_CustomerId",
                schema: "public",
                table: "Inquiries");

            migrationBuilder.DropIndex(
                name: "IX_PasswordResetTokens_TokenHash",
                schema: "public",
                table: "PasswordResetTokens");

            migrationBuilder.DropIndex(
                name: "IX_Deals_InquiryId",
                schema: "public",
                table: "Deals");

            migrationBuilder.DropColumn(
                name: "CustomerName",
                schema: "public",
                table: "Inquiries");

            migrationBuilder.DropColumn(
                name: "CustomerPhone",
                schema: "public",
                table: "Inquiries");

            migrationBuilder.AlterColumn<bool>(
                name: "ReceiveNotifications",
                schema: "public",
                table: "Users",
                type: "boolean",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<long>(
                name: "CustomerId",
                schema: "public",
                table: "Inquiries",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Deals_InquiryId",
                schema: "public",
                table: "Deals",
                column: "InquiryId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Inquiries_Users_CustomerId",
                schema: "public",
                table: "Inquiries",
                column: "CustomerId",
                principalSchema: "public",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Inquiries_Users_CustomerId",
                schema: "public",
                table: "Inquiries");

            migrationBuilder.DropIndex(
                name: "IX_Deals_InquiryId",
                schema: "public",
                table: "Deals");

            migrationBuilder.AlterColumn<bool>(
                name: "ReceiveNotifications",
                schema: "public",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AlterColumn<long>(
                name: "CustomerId",
                schema: "public",
                table: "Inquiries",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<string>(
                name: "CustomerName",
                schema: "public",
                table: "Inquiries",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomerPhone",
                schema: "public",
                table: "Inquiries",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResetTokens_TokenHash",
                schema: "public",
                table: "PasswordResetTokens",
                column: "TokenHash",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Deals_InquiryId",
                schema: "public",
                table: "Deals",
                column: "InquiryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Inquiries_Users_CustomerId",
                schema: "public",
                table: "Inquiries",
                column: "CustomerId",
                principalSchema: "public",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
