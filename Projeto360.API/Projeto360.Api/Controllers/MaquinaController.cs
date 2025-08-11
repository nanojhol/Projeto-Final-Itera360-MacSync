using Microsoft.AspNetCore.Mvc;
using Projeto360Final.API.Models.Requisicao;
using Projeto360Final.API.Models.Resposta;
using Projeto360Final.Dominio.Entidades;
using Projeto360Final.Dominio.Enumeradores;
using Projeto360Final.Repositorio.Interfaces;
using Projeto360Final.Repositorio.Repositorios;

namespace Projeto360Final.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaquinaController : ControllerBase
    {
        private readonly IMaquinaRepositorio _maquinaRepositorio;
        private readonly IEstabelecimentoRepositorio _estabelecimentoRepositorio;
        private readonly IRegistroUtilizacaoRepositorio _registroUtilizacaoRepositorio;


        public MaquinaController(IMaquinaRepositorio maquinaRepositorio, IEstabelecimentoRepositorio estabelecimentoRepositorio, IRegistroUtilizacaoRepositorio registroUtilizacaoRepositorio)
        {
            _maquinaRepositorio = maquinaRepositorio;
            _estabelecimentoRepositorio = estabelecimentoRepositorio;
            _registroUtilizacaoRepositorio = registroUtilizacaoRepositorio;
        }

        [HttpPost]
        public async Task<ActionResult<MaquinaResposta>> CriarMaquina([FromBody] CriarMaquina req)
        {
            var nova = new Maquina
            {
                MacAddress = req.MacAddress,
                IP = req.IP,
                StatusDispositivo = (StatusDispositivo)req.StatusDispositivo,
                StatusUtilizacao = (StatusUtilizacao)req.StatusUtilizacao,
                ValorUtilizacao = req.ValorUtilizacao,
                TipoDispositivo = req.TipoDispositivo,
                EstabelecimentoId = req.EstabelecimentoId,
                Ativo = true,
                PrimeiraAtivacao = DateTime.Now,
                UltimaAtualizacao = DateTime.Now
            };

            var id = await _maquinaRepositorio.SalvarAsync(nova);
            var criada = await _maquinaRepositorio.ObterPorIdAsync(id);
            return Ok(new MaquinaResposta(criada!));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MaquinaResposta>> ObterPorId(int id)
        {
            var maquina = await _maquinaRepositorio.ObterPorIdAsync(id);
            if (maquina == null) return NotFound("Máquina não encontrada.");
            return Ok(new MaquinaResposta(maquina));
        }

        [HttpGet("listar")]
        public async Task<ActionResult<List<MaquinaResposta>>> Listar()
        {
            var maquinas = await _maquinaRepositorio.ListarTodasAsync();
            return Ok(maquinas.Select(m => new MaquinaResposta(m)));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AtualizarMaquina(int id, [FromBody] AtualizarMaquina req)
        {
            var maquina = await _maquinaRepositorio.ObterPorIdAsync(id);
            if (maquina == null) return NotFound("Máquina não encontrada.");

            maquina.AtualizarCamposEditaveis(
                req.IP,
                req.StatusDispositivo.HasValue ? (StatusDispositivo)req.StatusDispositivo : null,
                req.StatusUtilizacao.HasValue ? (StatusUtilizacao)req.StatusUtilizacao : null,
                req.ValorUtilizacao,
                req.TipoDispositivo,
                req.AcaoPendente,
                req.EstabelecimentoId,
                req.Ativo
            );

            await _maquinaRepositorio.AtualizarAsync(maquina);
            return NoContent();
        }

        [HttpDelete("desativar/{id}")]
        public async Task<IActionResult> Desativar(int id)
        {
            var maquina = await _maquinaRepositorio.ObterPorIdAsync(id);
            if (maquina == null) return NotFound("Máquina não encontrada.");
            if (!maquina.Ativo) return BadRequest("Máquina já está inativa.");

            maquina.Ativo = false;
            await _maquinaRepositorio.AtualizarAsync(maquina);
            return Ok("Máquina desativada com sucesso.");
        }

        [HttpPut("reativar/{id}")]
        public async Task<IActionResult> Reativar(int id)
        {
            var maquina = await _maquinaRepositorio.ObterPorIdAsync(id);
            if (maquina == null) return NotFound("Máquina não encontrada.");
            if (maquina.Ativo) return BadRequest("Máquina já está ativa.");

            maquina.Ativo = true;
            await _maquinaRepositorio.AtualizarAsync(maquina);
            return Ok("Máquina reativada com sucesso.");
        }

        [HttpDelete("remover-definitivo/{id}")]
        public async Task<IActionResult> RemoverDefinitivo(int id)
        {
            var maquina = await _maquinaRepositorio.ObterPorIdAsync(id);
            if (maquina == null) return NotFound("Máquina não encontrada.");

            await _maquinaRepositorio.RemoverAsync(maquina);
            return NoContent();
        }

        [HttpGet("listar-por-estabelecimento/{estabelecimentoId}")]
        public async Task<ActionResult<List<MaquinaResposta>>> ListarPorEstabelecimento(int estabelecimentoId)
        {
            var maquinas = await _maquinaRepositorio.ListarPorEstabelecimentoAsync(estabelecimentoId);
            return Ok(maquinas.Select(m => new MaquinaResposta(m)));
        }

        [HttpGet("listar-ativas")]
        public async Task<ActionResult<List<MaquinaResposta>>> ListarAtivas()
        {
            var maquinas = await _maquinaRepositorio.ListarAtivasAsync();
            return Ok(maquinas.Select(m => new MaquinaResposta(m)));
        }

        [HttpGet("listar-inativas")]
        public async Task<ActionResult<List<MaquinaResposta>>> ListarInativas()
        {
            var maquinas = await _maquinaRepositorio.ListarInativasAsync();
            return Ok(maquinas.Select(m => new MaquinaResposta(m)));
        }

        [HttpPost("comando")]
        public async Task<IActionResult> EnviarComando([FromBody] ComandoMaquina req)
        {
            var usuarioId = int.Parse(User.FindFirst("id")?.Value ?? "0");

            var maquina = await _maquinaRepositorio.ObterPorMacAsync(req.MacAddress);
            if (maquina == null)
                return NotFound("Máquina não encontrada.");

            if (!maquina.Ativo)
                return BadRequest("Máquina está inativa.");

            maquina.MarcarAcionamentosPendentesComoErro();
            maquina.RegistrarNovoAcionamento(req.Acao);

            await _registroUtilizacaoRepositorio.SalvarAsync(
                new RegistroUtilizacao(
                    usuarioId,
                    maquina.Id,
                    DateTime.UtcNow,
                    StatusUtilizacao.Efetivada,
                    maquina.ValorUtilizacao,
                    acaoRealizada: req.Acao
                )
            );



            await _maquinaRepositorio.AtualizarAsync(maquina);

            return Ok(new
            {
                Mensagem = $"Ação '{req.Acao}' enviada para o dispositivo {req.MacAddress}.",
                DataHoraEnvio = maquina.DataHoraEnvioComando
            });
        }


        [HttpPost("status")]
        public async Task<IActionResult> ReceberStatusDispositivo([FromBody] StatusMaquinaRequisicao req)
        {
            var maquina = await _maquinaRepositorio.ObterPorMacAsync(req.MacAddress);
            var novoStatus = (StatusDispositivo)req.Status;

            if (maquina == null)
            {
                // Garantir que o estabelecimento ADMIN exista
                var estabelecimento = await _estabelecimentoRepositorio.ObterPorNomeAsync("ADMIN");
                if (estabelecimento == null)
                {
                    estabelecimento = new Estabelecimento
                    {
                        Nome = "ADMIN",
                        Endereco = "Padrão",
                        Telefone = "0000-0000",
                        Ativo = true
                    };
                    await _estabelecimentoRepositorio.SalvarAsync(estabelecimento);
                }

                // Criar nova máquina com status padrão
                maquina = new Maquina
                {
                    MacAddress = req.MacAddress,
                    IP = req.IP,
                    StatusDispositivo = novoStatus,
                    StatusUtilizacao = StatusUtilizacao.Livre,
                    ValorUtilizacao = 0,
                    TipoDispositivo = "Novo Dispositivo",
                    EstabelecimentoId = estabelecimento.Id,
                    PrimeiraAtivacao = DateTime.Now,
                    UltimaAtualizacao = DateTime.Now,
                    Ativo = true
                };

                await _maquinaRepositorio.SalvarAsync(maquina);
            }
            else
            {
                bool houveAlteracao = false;

                if (maquina.IP != req.IP)
                {
                    maquina.IP = req.IP;
                    houveAlteracao = true;
                }

                if (maquina.StatusDispositivo != novoStatus)
                {
                    maquina.StatusDispositivo = novoStatus;
                    houveAlteracao = true;

                    if (novoStatus == StatusDispositivo.Offline)
                        maquina.UltimaAtualizacao = DateTime.Now;
                }

                if (houveAlteracao)
                {
                    await _maquinaRepositorio.AtualizarAsync(maquina);
                }
            }

            return Ok(new
            {
                acao = maquina.AcaoPendente
            });
        }




        [HttpPost("resposta-acao")]
        public async Task<IActionResult> ReceberRespostaDeAcao([FromBody] RespostaAcaoRequest req)
        {
            var maquina = await _maquinaRepositorio.ObterPorMacAsync(req.MacAddress);
            if (maquina == null)
                return NotFound("Máquina não encontrada.");

            var ultimoAcionamento = maquina.Acionamentos
                .OrderByDescending(a => a.DataHoraEnvio)
                .FirstOrDefault(a => a.DataHoraResposta == null);

            if (ultimoAcionamento == null)
                return BadRequest("Nenhum acionamento pendente encontrado.");

            ultimoAcionamento.DataHoraResposta = DateTime.UtcNow;
            ultimoAcionamento.Sucesso = true;
            ultimoAcionamento.MensagemErro = null;

            maquina.AcaoPendente = string.Empty;
            maquina.AguardandoResposta = false;
            maquina.StatusDispositivo = StatusDispositivo.Online;

            await _maquinaRepositorio.AtualizarAsync(maquina);

            return Ok("Resposta registrada com sucesso.");
        }


    }
}
