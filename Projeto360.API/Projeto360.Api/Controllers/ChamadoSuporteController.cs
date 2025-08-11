using Microsoft.AspNetCore.Mvc;
using Projeto360Final.Dominio.Entidades;
using Projeto360Final.Repositorio.Interfaces;
using Projeto360Final.API.Models.Resposta;
using Projeto360Final.API.Models.Requisicao;

namespace Projeto360Final.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChamadoSuporteController : ControllerBase
    {
        private readonly IChamadoSuporteRepositorio _repositorio;

        public ChamadoSuporteController(IChamadoSuporteRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] ChamadoSuporte chamado)
        {
            var id = await _repositorio.SalvarAsync(chamado);
            var criado = await _repositorio.ObterPorIdAsync(id);
            // return Ok(criado);
            return Ok(new ChamadoResposta(criado!));
        }


        [HttpGet("listar")]
        public async Task<ActionResult<List<ChamadoResposta>>> ListarTodos()
        {
            try
            {
                var chamados = await _repositorio.ListarTodosAsync();
                return Ok(chamados.Select(c => new ChamadoResposta(c)));
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro ao listar chamados: " + ex);
                return StatusCode(500, "Erro interno ao listar chamados.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] ChamadoSuporte atualizado)
        {
            var existente = await _repositorio.ObterPorIdAsync(id);
            if (existente == null)
                return NotFound("Chamado não encontrado.");

            // Atualiza os campos permitidos
            existente.EstabelecimentoId = atualizado.EstabelecimentoId;
            existente.Tipo = atualizado.Tipo;
            existente.Mensagem = atualizado.Mensagem;
            existente.Status = atualizado.Status;
            existente.Ativo = atualizado.Ativo;

            await _repositorio.AtualizarAsync(existente);

            return Ok(new ChamadoResposta(existente));
        }



        [HttpGet("por-usuario/{usuarioId}")]
        public async Task<IActionResult> ListarPorUsuario(int usuarioId)
        {
            var chamados = await _repositorio.ListarPorUsuarioAsync(usuarioId);
            var resposta = chamados.Select(c => new ChamadoResposta(c)).ToList();
            return Ok(resposta);
        }



        [HttpGet("por-estabelecimento")]
        public async Task<IActionResult> ListarPorEstabelecimento([FromQuery] string nome)
        {
            var todos = await _repositorio.ListarTodosAsync();
            var filtrados = todos.Where(c => c.Estabelecimento.ToLower().Contains(nome.ToLower())).ToList();

            return Ok(filtrados);
        }

        [HttpGet("por-estabelecimento/{estabelecimentoId}")]
        public async Task<IActionResult> ListarPorEstabelecimento(int estabelecimentoId)
        {
            var todos = await _repositorio.ListarTodosAsync();
            var filtrados = todos
                .Where(c => c.EstabelecimentoId == estabelecimentoId)
                .ToList();

            var resposta = filtrados.Select(c => new ChamadoResposta(c)).ToList();
            return Ok(resposta);
        }




        [HttpPut("encerrar/{id}")]
        public async Task<IActionResult> Encerrar(int id)
        {
            var chamado = await _repositorio.ObterPorIdAsync(id);
            if (chamado == null) return NotFound("Chamado não encontrado.");

            chamado.Encerrar();
            await _repositorio.AtualizarAsync(chamado);

            return Ok("Chamado encerrado.");
        }

        [HttpPut("reativar/{id}")]
        public async Task<IActionResult> Reativar(int id)
        {
            var chamado = await _repositorio.ObterPorIdAsync(id);
            if (chamado == null) return NotFound("Chamado não encontrado.");

            chamado.Restaurar();
            await _repositorio.AtualizarAsync(chamado);

            return Ok("Chamado reativado.");
        }

        // [HttpDelete("desativar/{id}")]
        // public async Task<IActionResult> Desativar(int id)
        // {
        //     var chamado = await _repositorio.ObterPorIdAsync(id);
        //     if (chamado == null) return NotFound("Chamado não encontrado.");

        //     chamado.Deletar();
        //     await _repositorio.AtualizarAsync(chamado);

        //     return Ok("Chamado desativado.");
        // }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            var chamado = await _repositorio.ObterMesmoDesativadoAsync(id);
            if (chamado == null) return NotFound("Chamado não encontrado.");

            await _repositorio.RemoverAsync(chamado);
            return Ok("Chamado removido permanentemente.");
        }



        public class ChamadoResposta
        {
            public int Id { get; set; }
            public int UsuarioId { get; set; }
            public string Estabelecimento { get; set; } = string.Empty;
            public int EstabelecimentoId { get; set; }
            public string Tipo { get; set; } = string.Empty;
            public string Mensagem { get; set; } = string.Empty;
            public string Status { get; set; } = string.Empty;
            public DateTime DataCriacao { get; set; }

            public ChamadoResposta(ChamadoSuporte chamado)
            {
                Id = chamado.Id;
                UsuarioId = chamado.UsuarioId;
                Estabelecimento = chamado.Estabelecimento;
                EstabelecimentoId = chamado.EstabelecimentoId;
                Tipo = chamado.Tipo;
                Mensagem = chamado.Mensagem;
                Status = chamado.Status;
                DataCriacao = chamado.DataCriacao;
            }
        }

    }
}
