using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projeto360.Repositorio.Migrations
{
    /// <inheritdoc />
    public partial class CriarTabelaMaquinasComRelacionamentos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AguardandoResposta",
                table: "Maquinas",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "DataHoraEnvioComando",
                table: "Maquinas",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "RegistrosAcionamento",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Acao = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DataHoraEnvio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataHoraResposta = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Sucesso = table.Column<bool>(type: "bit", nullable: false),
                    MensagemErro = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    MaquinaId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistrosAcionamento", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RegistrosAcionamento_Maquinas_MaquinaId",
                        column: x => x.MaquinaId,
                        principalTable: "Maquinas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RegistrosAcionamento_MaquinaId",
                table: "RegistrosAcionamento",
                column: "MaquinaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RegistrosAcionamento");

            migrationBuilder.DropColumn(
                name: "AguardandoResposta",
                table: "Maquinas");

            migrationBuilder.DropColumn(
                name: "DataHoraEnvioComando",
                table: "Maquinas");
        }
    }
}
