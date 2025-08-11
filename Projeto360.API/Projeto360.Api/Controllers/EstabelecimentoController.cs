using Microsoft.AspNetCore.Mvc;
using Projeto360Final.API.Models.Requisicao;
using Projeto360Final.API.Models.Resposta;
using Projeto360Final.Dominio.Entidades;
using Projeto360Final.Repositorio.Interfaces;

namespace Projeto360Final.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EstabelecimentoController : ControllerBase
    {
        private readonly IEstabelecimentoRepositorio _repositorio;

        public EstabelecimentoController(IEstabelecimentoRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        [HttpPost]
        public async Task<ActionResult<EstabelecimentoResposta>> Criar([FromBody] CriarEstabelecimento req)
        {
            var novo = new Estabelecimento(req.Nome, req.Endereco, req.Telefone);
            var id = await _repositorio.SalvarAsync(novo);
            var criado = await _repositorio.ObterPorIdAsync(id);
            return Ok(new EstabelecimentoResposta(criado!));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EstabelecimentoResposta>> ObterPorId(int id)
        {
            var est = await _repositorio.ObterPorIdAsync(id);
            if (est == null) return NotFound("Estabelecimento não encontrado.");
            return Ok(new EstabelecimentoResposta(est));
        }

        [HttpGet("listar")]
        public async Task<ActionResult<List<EstabelecimentoResposta>>> Listar()
        {
            var lista = await _repositorio.ListarAsync();
            return Ok(lista.Select(e => new EstabelecimentoResposta(e)));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] AtualizarEstabelecimento req)
        {
            var est = await _repositorio.ObterPorIdAsync(id);
            if (est == null) return NotFound("Estabelecimento não encontrado.");

            est.Atualizar(
                req.Nome,
                req.Endereco,
                req.Telefone,
                req.Ativo
            );
            await _repositorio.AtualizarAsync(est);

            return NoContent();
        }

        [HttpDelete("desativar/{id}")]
        public async Task<IActionResult> Desativar(int id)
        {
            var est = await _repositorio.ObterPorIdAsync(id);
            if (est == null) return NotFound("Estabelecimento não encontrado.");

            est.Desativar();
            await _repositorio.AtualizarAsync(est);

            return Ok("Estabelecimento desativado com sucesso.");
        }

        [HttpPut("reativar/{id}")]
        public async Task<IActionResult> Reativar(int id)
        {
            var est = await _repositorio.ObterPorIdAsync(id);
            if (est == null) return NotFound("Estabelecimento não encontrado.");

            est.Reativar();
            await _repositorio.AtualizarAsync(est);

            return Ok("Estabelecimento reativado com sucesso.");
        }

        [HttpDelete("remover-definitivo/{id}")]
        public async Task<IActionResult> RemoverDefinitivo(int id)
        {
            try
            {
                var est = await _repositorio.ObterPorIdAsync(id);
                if (est == null) return NotFound("Estabelecimento não encontrado.");

                await _repositorio.RemoverAsync(est);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

    }
}
