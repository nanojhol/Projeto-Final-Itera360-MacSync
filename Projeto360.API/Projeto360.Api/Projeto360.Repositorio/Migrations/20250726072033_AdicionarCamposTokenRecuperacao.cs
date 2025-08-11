using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projeto360.Repositorio.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarCamposTokenRecuperacao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TokenRecuperacao",
                table: "Usuarios",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Estabelecimento",
                table: "ChamadosSuporte",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(150)",
                oldMaxLength: 150);

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
                onDelete: ReferentialAction.Cascade);
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
                name: "TokenRecuperacao",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "EstabelecimentoId",
                table: "ChamadosSuporte");

            migrationBuilder.AlterColumn<string>(
                name: "Estabelecimento",
                table: "ChamadosSuporte",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
