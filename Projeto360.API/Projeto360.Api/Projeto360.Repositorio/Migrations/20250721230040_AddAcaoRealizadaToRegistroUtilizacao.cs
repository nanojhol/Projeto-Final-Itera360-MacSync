using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projeto360.Repositorio.Migrations
{
    /// <inheritdoc />
    public partial class AddAcaoRealizadaToRegistroUtilizacao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AcaoRealizada",
                table: "RegistrosUtilizacao",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AcaoRealizada",
                table: "RegistrosUtilizacao");
        }
    }
}
