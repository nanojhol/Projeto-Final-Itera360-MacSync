using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projeto360.Repositorio.Migrations
{
    /// <inheritdoc />
    public partial class Ajuste_RegistroUtilizacao_AcaoCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RegistrosUtilizacao_Maquinas_MaquinaId",
                table: "RegistrosUtilizacao");

            migrationBuilder.AddForeignKey(
                name: "FK_RegistrosUtilizacao_Maquinas_MaquinaId",
                table: "RegistrosUtilizacao",
                column: "MaquinaId",
                principalTable: "Maquinas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RegistrosUtilizacao_Maquinas_MaquinaId",
                table: "RegistrosUtilizacao");

            migrationBuilder.AddForeignKey(
                name: "FK_RegistrosUtilizacao_Maquinas_MaquinaId",
                table: "RegistrosUtilizacao",
                column: "MaquinaId",
                principalTable: "Maquinas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
