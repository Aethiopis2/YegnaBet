using System;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace YegnaBet.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "public");

            migrationBuilder.CreateTable(
                name: "AttributeDeinition",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(260)", maxLength: 260, nullable: false),
                    Key = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    DataType = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsSearchable = table.Column<bool>(type: "boolean", nullable: false),
                    IsFilterable = table.Column<bool>(type: "boolean", nullable: false),
                    Options = table.Column<JsonDocument>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttributeDeinition", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<long>(type: "bigint", nullable: true),
                    EntityType = table.Column<string>(type: "text", nullable: false),
                    EntityId = table.Column<long>(type: "bigint", nullable: false),
                    Action = table.Column<string>(type: "text", nullable: false),
                    OldValues = table.Column<string>(type: "text", nullable: true),
                    NewValues = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Expenses",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Category = table.Column<string>(type: "text", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IncurredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Expenses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Locations",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Country = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    City = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Area = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    SubArea = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Latitude = table.Column<double>(type: "double precision", nullable: true),
                    Longitude = table.Column<double>(type: "double precision", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Taxonomy",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(260)", maxLength: 260, nullable: false),
                    Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Taxonomy", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Role = table.Column<int>(type: "integer", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    PhoneNumber = table.Column<string>(type: "text", nullable: false),
                    IsVerified = table.Column<bool>(type: "boolean", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Avatar = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TaxonomyNode",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TaxonomyId = table.Column<long>(type: "bigint", nullable: false),
                    ParentId = table.Column<long>(type: "bigint", nullable: true),
                    Name = table.Column<string>(type: "character varying(260)", maxLength: 260, nullable: false),
                    Slug = table.Column<string>(type: "character varying(260)", maxLength: 260, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Image = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaxonomyNode", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TaxonomyNode_TaxonomyNode_ParentId",
                        column: x => x.ParentId,
                        principalSchema: "public",
                        principalTable: "TaxonomyNode",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TaxonomyNode_Taxonomy_TaxonomyId",
                        column: x => x.TaxonomyId,
                        principalSchema: "public",
                        principalTable: "Taxonomy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Listings",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProviderId = table.Column<long>(type: "bigint", nullable: false),
                    LocationId = table.Column<long>(type: "bigint", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Price = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: true),
                    PriceUnit = table.Column<string>(type: "text", nullable: true),
                    Method = table.Column<int>(type: "integer", nullable: false),
                    ListingStatus = table.Column<int>(type: "integer", nullable: false),
                    TrustScore = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false),
                    IsVerified = table.Column<bool>(type: "boolean", nullable: false),
                    IsFeatured = table.Column<bool>(type: "boolean", nullable: false),
                    FeaturedUntil = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ViewsCount = table.Column<int>(type: "integer", nullable: false),
                    InquiresCount = table.Column<int>(type: "integer", nullable: false),
                    SuccessfulDeals = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ApprovedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Listings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Listings_Locations_LocationId",
                        column: x => x.LocationId,
                        principalSchema: "public",
                        principalTable: "Locations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Listings_Users_ProviderId",
                        column: x => x.ProviderId,
                        principalSchema: "public",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "NodeAttributeDefinition",
                schema: "public",
                columns: table => new
                {
                    TaxonomyNodeId = table.Column<long>(type: "bigint", nullable: false),
                    AttributeDefinitionId = table.Column<long>(type: "bigint", nullable: false),
                    IsRequired = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NodeAttributeDefinition", x => new { x.TaxonomyNodeId, x.AttributeDefinitionId });
                    table.ForeignKey(
                        name: "FK_NodeAttributeDefinition_AttributeDeinition_AttributeDefinit~",
                        column: x => x.AttributeDefinitionId,
                        principalSchema: "public",
                        principalTable: "AttributeDeinition",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NodeAttributeDefinition_TaxonomyNode_TaxonomyNodeId",
                        column: x => x.TaxonomyNodeId,
                        principalSchema: "public",
                        principalTable: "TaxonomyNode",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Inquiries",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ListingId = table.Column<long>(type: "bigint", nullable: false),
                    EmployeeId = table.Column<long>(type: "bigint", nullable: false),
                    CustomerId = table.Column<long>(type: "bigint", nullable: true),
                    CustomerName = table.Column<string>(type: "text", nullable: true),
                    CustomerPhone = table.Column<string>(type: "text", nullable: true),
                    InquiryStatus = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inquiries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Inquiries_Listings_ListingId",
                        column: x => x.ListingId,
                        principalSchema: "public",
                        principalTable: "Listings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Inquiries_Users_CustomerId",
                        column: x => x.CustomerId,
                        principalSchema: "public",
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Inquiries_Users_EmployeeId",
                        column: x => x.EmployeeId,
                        principalSchema: "public",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ListingAttributeValue",
                schema: "public",
                columns: table => new
                {
                    ListingId = table.Column<long>(type: "bigint", nullable: false),
                    AttributeDefinitionId = table.Column<long>(type: "bigint", nullable: false),
                    Value = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListingAttributeValue", x => new { x.ListingId, x.AttributeDefinitionId });
                    table.ForeignKey(
                        name: "FK_ListingAttributeValue_AttributeDeinition_AttributeDefinitio~",
                        column: x => x.AttributeDefinitionId,
                        principalSchema: "public",
                        principalTable: "AttributeDeinition",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ListingAttributeValue_Listings_ListingId",
                        column: x => x.ListingId,
                        principalSchema: "public",
                        principalTable: "Listings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ListingImages",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ListingId = table.Column<long>(type: "bigint", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    Kind = table.Column<int>(type: "integer", nullable: false),
                    IsPrimary = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListingImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ListingImages_Listings_ListingId",
                        column: x => x.ListingId,
                        principalSchema: "public",
                        principalTable: "Listings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ListingTaxonomyNode",
                schema: "public",
                columns: table => new
                {
                    ListingId = table.Column<long>(type: "bigint", nullable: false),
                    TaxonomyNodeId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListingTaxonomyNode", x => new { x.ListingId, x.TaxonomyNodeId });
                    table.ForeignKey(
                        name: "FK_ListingTaxonomyNode_Listings_ListingId",
                        column: x => x.ListingId,
                        principalSchema: "public",
                        principalTable: "Listings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ListingTaxonomyNode_TaxonomyNode_TaxonomyNodeId",
                        column: x => x.TaxonomyNodeId,
                        principalSchema: "public",
                        principalTable: "TaxonomyNode",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Deals",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    InquiryId = table.Column<long>(type: "bigint", nullable: false),
                    ListingId = table.Column<long>(type: "bigint", nullable: false),
                    EmployeeId = table.Column<long>(type: "bigint", nullable: false),
                    DealValue = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    CommissionRate = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false),
                    CommissionAmount = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    DealStatus = table.Column<int>(type: "integer", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Deals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Deals_Inquiries_InquiryId",
                        column: x => x.InquiryId,
                        principalSchema: "public",
                        principalTable: "Inquiries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Deals_Listings_ListingId",
                        column: x => x.ListingId,
                        principalSchema: "public",
                        principalTable: "Listings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Deals_Users_EmployeeId",
                        column: x => x.EmployeeId,
                        principalSchema: "public",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FinancialTransactions",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DealId = table.Column<long>(type: "bigint", nullable: true),
                    TransactionType = table.Column<string>(type: "text", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    Currency = table.Column<string>(type: "text", nullable: false),
                    ReferenceNumber = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FinancialTransactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FinancialTransactions_Deals_DealId",
                        column: x => x.DealId,
                        principalSchema: "public",
                        principalTable: "Deals",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AttributeDeinition_Key",
                schema: "public",
                table: "AttributeDeinition",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Deals_EmployeeId",
                schema: "public",
                table: "Deals",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Deals_InquiryId",
                schema: "public",
                table: "Deals",
                column: "InquiryId");

            migrationBuilder.CreateIndex(
                name: "IX_Deals_ListingId",
                schema: "public",
                table: "Deals",
                column: "ListingId");

            migrationBuilder.CreateIndex(
                name: "IX_FinancialTransactions_DealId",
                schema: "public",
                table: "FinancialTransactions",
                column: "DealId");

            migrationBuilder.CreateIndex(
                name: "IX_Inquiries_CustomerId",
                schema: "public",
                table: "Inquiries",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Inquiries_EmployeeId",
                schema: "public",
                table: "Inquiries",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Inquiries_InquiryStatus",
                schema: "public",
                table: "Inquiries",
                column: "InquiryStatus");

            migrationBuilder.CreateIndex(
                name: "IX_Inquiries_ListingId",
                schema: "public",
                table: "Inquiries",
                column: "ListingId");

            migrationBuilder.CreateIndex(
                name: "IX_ListingAttributeValue_AttributeDefinitionId",
                schema: "public",
                table: "ListingAttributeValue",
                column: "AttributeDefinitionId");

            migrationBuilder.CreateIndex(
                name: "IX_ListingImages_ListingId",
                schema: "public",
                table: "ListingImages",
                column: "ListingId");

            migrationBuilder.CreateIndex(
                name: "IX_Listings_ListingStatus",
                schema: "public",
                table: "Listings",
                column: "ListingStatus");

            migrationBuilder.CreateIndex(
                name: "IX_Listings_LocationId",
                schema: "public",
                table: "Listings",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Listings_ProviderId",
                schema: "public",
                table: "Listings",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_ListingTaxonomyNode_TaxonomyNodeId",
                schema: "public",
                table: "ListingTaxonomyNode",
                column: "TaxonomyNodeId");

            migrationBuilder.CreateIndex(
                name: "IX_NodeAttributeDefinition_AttributeDefinitionId",
                schema: "public",
                table: "NodeAttributeDefinition",
                column: "AttributeDefinitionId");

            migrationBuilder.CreateIndex(
                name: "IX_TaxonomyNode_ParentId",
                schema: "public",
                table: "TaxonomyNode",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_TaxonomyNode_TaxonomyId_ParentId_Slug",
                schema: "public",
                table: "TaxonomyNode",
                columns: new[] { "TaxonomyId", "ParentId", "Slug" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_PhoneNumber",
                schema: "public",
                table: "Users",
                column: "PhoneNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Expenses",
                schema: "public");

            migrationBuilder.DropTable(
                name: "FinancialTransactions",
                schema: "public");

            migrationBuilder.DropTable(
                name: "ListingAttributeValue",
                schema: "public");

            migrationBuilder.DropTable(
                name: "ListingImages",
                schema: "public");

            migrationBuilder.DropTable(
                name: "ListingTaxonomyNode",
                schema: "public");

            migrationBuilder.DropTable(
                name: "NodeAttributeDefinition",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Deals",
                schema: "public");

            migrationBuilder.DropTable(
                name: "AttributeDeinition",
                schema: "public");

            migrationBuilder.DropTable(
                name: "TaxonomyNode",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Inquiries",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Taxonomy",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Listings",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Locations",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Users",
                schema: "public");
        }
    }
}
