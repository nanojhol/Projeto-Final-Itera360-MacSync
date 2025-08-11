using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projeto360.Repositorio.Migrations
{
    /// <inheritdoc />
    public partial class AIGenerativa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SugestoesIA",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Disco = table.Column<int>(type: "int", nullable: false),
                    Memoria = table.Column<int>(type: "int", nullable: false),
                    TipoInsight = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DataGeracao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MaquinaId = table.Column<int>(type: "int", nullable: false),
                    EstabelecimentoId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SugestoesIA", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SugestoesIA_Estabelecimentos_EstabelecimentoId",
                        column: x => x.EstabelecimentoId,
                        principalTable: "Estabelecimentos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SugestoesIA_Maquinas_MaquinaId",
                        column: x => x.MaquinaId,
                        principalTable: "Maquinas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SugestoesIA_EstabelecimentoId",
                table: "SugestoesIA",
                column: "EstabelecimentoId");

            migrationBuilder.CreateIndex(
                name: "IX_SugestoesIA_MaquinaId",
                table: "SugestoesIA",
                column: "MaquinaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SugestoesIA");
        }
    }
}
