using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projeto360.Repositorio.Migrations
{
    /// <inheritdoc />
    public partial class NovoCampoMaquina : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Disco",
                table: "Maquinas",
                type: "float",
                maxLength: 25,
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Memoria",
                table: "Maquinas",
                type: "float",
                maxLength: 25,
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Disco",
                table: "Maquinas");

            migrationBuilder.DropColumn(
                name: "Memoria",
                table: "Maquinas");
        }
    }
}
