using Microsoft.AspNetCore.Mvc;
using Projeto360Final.Servicos;
using Projeto360Final.Dominio.Entidades;
using Projeto360Final.Repositorio.Interfaces;

namespace Projeto360Final.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SugestaoIAController : ControllerBase
    {
        private readonly SugestaoIAAplicacao _aplicacao;
        private readonly ISugestaoIARepositorio _repositorio;

        public SugestaoIAController(SugestaoIAAplicacao aplicacao, ISugestaoIARepositorio repositorio)
        {
            _aplicacao = aplicacao;
            _repositorio = repositorio;
        }

        [HttpPost("gerar/{maquinaId}")]
        public async Task<IActionResult> Gerar(int maquinaId)
        {
            try
            {
                var sugestao = await _aplicacao.GerarSugestaoParaMaquinaAsync(maquinaId);
                return Ok(sugestao);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro na sugestão IA do usuário: {ex.Message}");
                return BadRequest(new { erro = ex.Message });
            }
        }

        [HttpGet("maquina/{maquinaId}")]
        public async Task<IActionResult> ListarPorMaquina(int maquinaId)
        {
            var sugestoes = await _repositorio.ListarPorMaquinaAsync(maquinaId);
            return Ok(sugestoes);
        }

        [HttpGet]
        public async Task<IActionResult> ListarTodas()
        {
            var sugestoes = await _repositorio.ListarTodasAsync();
            return Ok(sugestoes);
        }

        [HttpPost("usuario/{usuarioId}")]
        public async Task<IActionResult> GerarParaUsuario(int usuarioId)
        {
            try
            {
                var resposta = await _aplicacao.GerarSugestaoParaUsuarioAsync(usuarioId); // método na aplicação

                // Console.WriteLine("Resposta IA:");
                // Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(resposta));
                return Ok(resposta);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro na sugestão IA do usuário: {ex.Message}");
                return BadRequest(new { erro = ex.Message });
            }
        }

    }
}
