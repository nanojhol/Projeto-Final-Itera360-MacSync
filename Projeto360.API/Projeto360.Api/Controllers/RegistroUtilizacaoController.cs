using Projeto360Final.Repositorio.Interfaces;
using Projeto360Final.API.Models.Requisicao;
using Projeto360Final.Dominio.Enumeradores;
using Projeto360Final.API.Models.Resposta;
using Projeto360Final.Dominio.Entidades;
using Microsoft.AspNetCore.Mvc;

namespace Projeto360Final.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistroUtilizacaoController : ControllerBase
    {
        private readonly IRegistroUtilizacaoRepositorio _repositorio;

        public RegistroUtilizacaoController(IRegistroUtilizacaoRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        [HttpPost]
        public async Task<ActionResult<RegistroUtilizacaoResposta>> Criar([FromBody] CriarRegistroUtilizacao req)
        {
            var novo = new RegistroUtilizacao(
                req.UsuarioId,
                req.MaquinaId,
                DateTime.Now,
                (StatusUtilizacao)req.Status,
                req.ValorCobrado,
                req.AcaoRealizada 
            );

            var id = await _repositorio.SalvarAsync(novo);
            var criado = await _repositorio.ObterPorIdAsync(id);

            return Ok(new RegistroUtilizacaoResposta(criado!));
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<RegistroUtilizacaoResposta>> Obter(int id)
        {
            var registro = await _repositorio.ObterPorIdAsync(id);
            if (registro == null) return NotFound("Registro não encontrado.");
            return Ok(new RegistroUtilizacaoResposta(registro));
        }

        [HttpGet("listar")]
        public async Task<ActionResult<List<RegistroUtilizacaoResposta>>> ListarTodos()
        {
            var registros = await _repositorio.ListarTodosAsync();
            return Ok(registros.Select(r => new RegistroUtilizacaoResposta(r)));
        }

        [HttpGet("por-usuario/{usuarioId}")]
        public async Task<ActionResult<List<RegistroUtilizacaoResposta>>> PorUsuario(int usuarioId)
        {
            var registros = await _repositorio.ListarPorUsuarioAsync(usuarioId);
            return Ok(registros.Select(r => new RegistroUtilizacaoResposta(r)));
        }

        [HttpGet("por-maquina/{maquinaId}")]
        public async Task<ActionResult<List<RegistroUtilizacaoResposta>>> PorMaquina(int maquinaId)
        {
            var registros = await _repositorio.ListarPorMaquinaAsync(maquinaId);
            return Ok(registros.Select(r => new RegistroUtilizacaoResposta(r)));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] AtualizarRegistroUtilizacao req)
        {
            var registro = await _repositorio.ObterPorIdAsync(id);
            if (registro == null) return NotFound("Registro não encontrado.");

            if (req.Status.HasValue)
                registro.AtualizarStatus((StatusUtilizacao)req.Status.Value);

            if (req.ValorCobrado.HasValue)
                registro.AtualizarValor(req.ValorCobrado.Value);

            await _repositorio.AtualizarAsync(registro);
            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Remover(int id)
        {
            var registro = await _repositorio.ObterPorIdAsync(id);
            if (registro == null) return NotFound("Registro não encontrado.");

            await _repositorio.RemoverAsync(registro);
            return Ok("Registro removido com sucesso.");
        }
    }
}
