using Microsoft.AspNetCore.Mvc;
using Projeto360Final.API.Models.Requisicao;
using Projeto360Final.API.Models.Resposta;
using Projeto360Final.Dominio.Entidades;
using Projeto360Final.Repositorio.Interfaces;

namespace Projeto360Final.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogDeAcaoController : ControllerBase
    {
        private readonly ILogDeAcaoRepositorio _repositorio;

        public LogDeAcaoController(ILogDeAcaoRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        [HttpPost]
        public async Task<ActionResult<LogDeAcaoResposta>> Criar([FromBody] CriarLogDeAcao req)
        {
            var log = new LogDeAcao(req.UsuarioId, req.Acao, req.EntidadeAfetada, req.EntidadeIdAfetada, req.DescricaoDetalhada);

            var id = await _repositorio.SalvarAsync(log);
            var criado = await _repositorio.ObterPorIdAsync(id);

            return Ok(new LogDeAcaoResposta(criado!));
        }

        [HttpGet("listar")]
        public async Task<ActionResult<List<LogDeAcaoResposta>>> ListarTodos()
        {
            var logs = await _repositorio.ListarTodosAsync();
            return Ok(logs.Select(l => new LogDeAcaoResposta(l)));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LogDeAcaoResposta>> ObterPorId(int id)
        {
            var log = await _repositorio.ObterPorIdAsync(id);
            if (log == null) return NotFound("Log não encontrado.");

            return Ok(new LogDeAcaoResposta(log));
        }

        [HttpGet("por-usuario/{usuarioId}")]
        public async Task<ActionResult<List<LogDeAcaoResposta>>> PorUsuario(int usuarioId)
        {
            var logs = await _repositorio.ListarPorUsuarioAsync(usuarioId);
            return Ok(logs.Select(l => new LogDeAcaoResposta(l)));
        }

        [HttpGet("por-entidade")]
        public async Task<ActionResult<List<LogDeAcaoResposta>>> PorEntidade([FromQuery] string nome)
        {
            var logs = await _repositorio.ListarPorEntidadeAsync(nome);
            return Ok(logs.Select(l => new LogDeAcaoResposta(l)));
        }

        [HttpGet("por-periodo")]
        public async Task<ActionResult<List<LogDeAcaoResposta>>> PorPeriodo([FromQuery] DateTime inicio, [FromQuery] DateTime fim)
        {
            var logs = await _repositorio.ListarPorPeriodoAsync(inicio, fim);
            return Ok(logs.Select(l => new LogDeAcaoResposta(l)));
        }
    }
}
