using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projeto360.Repositorio.Migrations
{
    /// <inheritdoc />
    public partial class CriarBancoInicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Estabelecimentos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Ativo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estabelecimentos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Maquinas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MacAddress = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IP = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    StatusDispositivo = table.Column<int>(type: "int", nullable: false),
                    StatusUtilizacao = table.Column<int>(type: "int", nullable: false),
                    ValorUtilizacao = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PrimeiraAtivacao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UltimaAtualizacao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Ativo = table.Column<bool>(type: "bit", nullable: false),
                    TipoDispositivo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AcaoPendente = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    EstabelecimentoId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Maquinas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Maquinas_Estabelecimentos_EstabelecimentoId",
                        column: x => x.EstabelecimentoId,
                        principalTable: "Estabelecimentos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Senha = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TipoConta = table.Column<int>(type: "int", nullable: false),
                    Ativo = table.Column<bool>(type: "bit", nullable: false),
                    Saldo = table.Column<decimal>(type: "decimal(18,2)", nullable: false, defaultValue: 0m),
                    DataCriacao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EstabelecimentoId = table.Column<int>(type: "int", nullable: true),
                    TokenRecuperacaoSenha = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    TokenExpiracao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UltimoLogin = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Usuarios_Estabelecimentos_EstabelecimentoId",
                        column: x => x.EstabelecimentoId,
                        principalTable: "Estabelecimentos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChamadosSuporte",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    Estabelecimento = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Tipo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Mensagem = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "Em aberto"),
                    DataCriacao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Ativo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChamadosSuporte", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChamadosSuporte_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LogsDeAcao",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    Acao = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    EntidadeAfetada = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    EntidadeIdAfetada = table.Column<int>(type: "int", nullable: true),
                    DescricaoDetalhada = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    DataHora = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogsDeAcao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LogsDeAcao_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RegistrosUtilizacao",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    MaquinaId = table.Column<int>(type: "int", nullable: false),
                    DataHora = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    ValorCobrado = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistrosUtilizacao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RegistrosUtilizacao_Maquinas_MaquinaId",
                        column: x => x.MaquinaId,
                        principalTable: "Maquinas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RegistrosUtilizacao_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChamadosSuporte_UsuarioId",
                table: "ChamadosSuporte",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_LogsDeAcao_UsuarioId",
                table: "LogsDeAcao",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Maquinas_EstabelecimentoId",
                table: "Maquinas",
                column: "EstabelecimentoId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrosUtilizacao_MaquinaId",
                table: "RegistrosUtilizacao",
                column: "MaquinaId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrosUtilizacao_UsuarioId",
                table: "RegistrosUtilizacao",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_EstabelecimentoId",
                table: "Usuarios",
                column: "EstabelecimentoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChamadosSuporte");

            migrationBuilder.DropTable(
                name: "LogsDeAcao");

            migrationBuilder.DropTable(
                name: "RegistrosUtilizacao");

            migrationBuilder.DropTable(
                name: "Maquinas");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "Estabelecimentos");
        }
    }
}
