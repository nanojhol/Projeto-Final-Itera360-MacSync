using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projeto360.Repositorio.Migrations
{
    /// <inheritdoc />
    public partial class AjusteChamadoSuporteRelacionamentos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Estabelecimento",
                table: "ChamadosSuporte");

            migrationBuilder.AddColumn<int>(
                name: "EstabelecimentoId",
                table: "ChamadosSuporte",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ChamadosSuporte_EstabelecimentoId",
                table: "ChamadosSuporte",
                column: "EstabelecimentoId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChamadosSuporte_Estabelecimentos_EstabelecimentoId",
                table: "ChamadosSuporte",
                column: "EstabelecimentoId",
                principalTable: "Estabelecimentos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChamadosSuporte_Estabelecimentos_EstabelecimentoId",
                table: "ChamadosSuporte");

            migrationBuilder.DropIndex(
                name: "IX_ChamadosSuporte_EstabelecimentoId",
                table: "ChamadosSuporte");

            migrationBuilder.DropColumn(
                name: "EstabelecimentoId",
                table: "ChamadosSuporte");

            migrationBuilder.AddColumn<string>(
                name: "Estabelecimento",
                table: "ChamadosSuporte",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");
        }
    }
}
