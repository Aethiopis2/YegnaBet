using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using YegnaBet.Infrastructure.Persistence;

#nullable disable

namespace YegnaBet.Infrastructure.Migrations;

[DbContext(typeof(BrokerDbContext))]
[Migration("20261115000000_AddUserNotificationPreference")]
public sealed class AddUserNotificationPreference : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<bool>(
            name: "ReceiveNotifications",
            schema: "public",
            table: "Users",
            type: "boolean",
            nullable: false,
            defaultValue: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(name: "ReceiveNotifications", schema: "public", table: "Users");
    }
}
