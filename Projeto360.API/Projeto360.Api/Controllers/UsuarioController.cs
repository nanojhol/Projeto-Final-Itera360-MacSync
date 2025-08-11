using Microsoft.AspNetCore.Mvc;
using Projeto360Final.Servicos;
using Projeto360Final.Dominio.Entidades;
using Projeto360Final.API.Models.Resposta;
using Projeto360Final.Repositorio.Contexto;
using Projeto360Final.Dominio.Enumeradores;
using Projeto360Final.API.Models.Requisicao;
using Projeto360Final.Repositorio.Interfaces;
using Projeto360Final.Repositorio.Repositorios;


namespace Projeto360Final.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepositorio _usuarioRepositorio;
        private readonly IMaquinaRepositorio _maquinaRepositorio;

        public UsuarioController(IUsuarioRepositorio usuarioRepositorio)
        {
            _usuarioRepositorio = usuarioRepositorio;
        }

        [HttpPost]
        public async Task<ActionResult<UsuarioResposta>> CriarUsuario([FromBody] CriarUsuario requisicao)
        {
            var novoUsuario = new Usuario
            {
                Nome = requisicao.Nome,
                Email = requisicao.Email,
                Senha = requisicao.Senha,
                TipoConta = (TipoConta)requisicao.TipoConta,
                EstabelecimentoId = requisicao.EstabelecimentoId,
                Ativo = true,
                DataCriacao = DateTime.Now,
                Saldo = 0
            };

            var id = await _usuarioRepositorio.SalvarAsync(novoUsuario);
            var usuario = await _usuarioRepositorio.ObterPorIdAsync(id);

            return Ok(new UsuarioResposta(usuario!));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioResposta>> ObterUsuario(int id)
        {
            var usuario = await _usuarioRepositorio.ObterPorIdAsync(id);
            if (usuario == null) return NotFound("Usuário não encontrado.");

            return Ok(new UsuarioResposta(usuario));
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> AtualizarUsuario(int id, [FromBody] AtualizarUsuario requisicao)
        {
            var usuario = await _usuarioRepositorio.ObterPorIdAsync(id);
            if (usuario == null) return NotFound();

            usuario.Nome = requisicao.Nome ?? usuario.Nome;
            usuario.Email = requisicao.Email ?? usuario.Email;
            usuario.Senha = requisicao.Senha ?? usuario.Senha;
            usuario.TipoConta = requisicao.TipoConta.HasValue ? (TipoConta)requisicao.TipoConta : usuario.TipoConta;
            usuario.Saldo = requisicao.Saldo ?? usuario.Saldo;
            usuario.EstabelecimentoId = requisicao.EstabelecimentoId ?? usuario.EstabelecimentoId;
            usuario.Ativo = requisicao.Ativo ?? usuario.Ativo;

            await _usuarioRepositorio.AtualizarAsync(usuario);
            return NoContent();
        }

        [HttpGet("listar")]
        public async Task<ActionResult<List<UsuarioResposta>>> ListarUsuarios()
        {
            var usuarios = await _usuarioRepositorio.ObterUsuariosAsync();
            return Ok(usuarios.Select(u => new UsuarioResposta(u)));
        }

        [HttpGet("listar-por-estabelecimento/{estabelecimentoId}")]
        public async Task<ActionResult<List<UsuarioResposta>>> ListarPorEstabelecimento(int estabelecimentoId, [FromQuery] int? tipoConta = null)
        {
            var usuarios = await _usuarioRepositorio.ObterUsuariosAsync();

            var filtrados = usuarios
                .Where(u => u.EstabelecimentoId == estabelecimentoId && (!tipoConta.HasValue || (int)u.TipoConta == tipoConta))
                .Select(u => new UsuarioResposta(u))
                .ToList();

            return Ok(filtrados);
        }

        [HttpDelete("Desativa/{id}")]
        public async Task<IActionResult> DeletarUsuario(int id)
        {
            var usuario = await _usuarioRepositorio.ObterPorIdAsync(id);
            if (usuario == null)
                return NotFound("Usuário não encontrado.");

            if (!usuario.Ativo)
                return BadRequest("Usuário já está inativo.");

            usuario.Ativo = false;
            await _usuarioRepositorio.AtualizarAsync(usuario);

            return NoContent(); // ou Ok("Usuário desativado com sucesso.");
        }

        [HttpPut("reativar/{id}")]
        public async Task<IActionResult> ReativarUsuario(int id)
        {
            var usuario = await _usuarioRepositorio.ObterPorIdAsync(id);
            if (usuario == null)
                return NotFound("Usuário não encontrado.");

            if (usuario.Ativo)
                return BadRequest("O usuário já está ativo.");

            usuario.Ativo = true;
            await _usuarioRepositorio.AtualizarAsync(usuario);

            return Ok("Usuário reativado com sucesso.");
        }


        [HttpDelete("remover-definitivo/{id}")]
        public async Task<IActionResult> DeletarUsuarioDefinitivo(int id)
        {
            var usuario = await _usuarioRepositorio.ObterPorIdAsync(id);
            if (usuario == null)
                return NotFound("Usuário não encontrado.");

            await _usuarioRepositorio.RemoverAsync(usuario);
            return NoContent(); // Ou: return Ok("Usuário removido com sucesso.");
        }

        [HttpGet("listar-tipos")]
        public IActionResult ListarTipos()
        {
            var tipos = Enum.GetValues(typeof(TipoConta))
                .Cast<TipoConta>()
                .Select(e => new
                {
                    id = (int)e,
                    nome = e.ToString()
                });
            return Ok(tipos);
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResposta>> LoginAsync(
            [FromBody] Login requisicao,
            [FromServices] UsuarioAutenticacaoService autenticacaoService,
            [FromServices] IUsuarioRepositorio usuarioRepositorio)
        {
            var (sucesso, token, usuario) = await autenticacaoService.TentarLoginAsync(requisicao.Email, requisicao.Senha);

            if (!sucesso || token is null || usuario is null)
                return Unauthorized("Email ou senha inválidos, ou usuário inativo.");

            // Atualiza o UltimoLogin agora
            usuario.UltimoLogin = DateTime.Now;
            await usuarioRepositorio.AtualizarAsync(usuario);

            return Ok(new LoginResposta
            {
                Token = token,
                UsuarioId = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                TipoUsuario = usuario.TipoConta.ToString(),
                UltimoLogin = usuario.UltimoLogin,
                EstabelecimentoId = usuario.EstabelecimentoId
                // EstabelecimentoId = usuario.TipoConta == TipoConta.Master ? null : usuario.EstabelecimentoId
            });
        }


        [HttpPost("verificar-email")]
        public async Task<ActionResult> VerificarEmail([FromBody] EmailRequisicao requisicao, [FromServices] IUsuarioRepositorio repo)
        {
            var usuario = await repo.ObterUsuarioCompletoPorEmailAsync(requisicao.Email); // novo método sem filtro de Ativo

            if (usuario == null)
                return NotFound("Usuário não encontrado.");

            if (!usuario.Ativo)
                return StatusCode(423, "Usuário bloqueado ou inativo."); // HTTP 423: Locked

            return Ok(true);
        }


        [HttpPost("inativar-por-email")]
        public async Task<IActionResult> InativarPorEmail(
            [FromBody] EmailRequisicao requisicao,
            [FromServices] IUsuarioRepositorio repo)
        {
            var usuario = await repo.ObterPorEmailAsync(requisicao.Email);
            if (usuario == null)
                return NotFound("Usuário não encontrado.");

            usuario.Ativo = false;
            await repo.AtualizarAsync(usuario);
            return Ok("Usuário inativado.");
        }




        [HttpPost("recuperar-senha")]
        public async Task<IActionResult> RecuperarSenhaAsync(
            [FromBody] RecuperacaoSenha requisicao,
            [FromServices] IUsuarioRepositorio usuarioRepositorio,
            [FromServices] SmtpEmailService emailService)
        {
            var usuario = await usuarioRepositorio.ObterPorEmailAsync(requisicao.Email);
            if (usuario == null || !usuario.Ativo)
                return NotFound("Usuário não encontrado ou inativo.");

            var token = Guid.NewGuid().ToString();
            var expiracao = DateTime.UtcNow.AddHours(2);

            await usuarioRepositorio.DefinirTokenRecuperacaoAsync(usuario.Id, token, expiracao);

            // var link = $"https://localhost:3000/nova-senha?token={token}"; // podemos ajustar essa URL
            var link = $"http://localhost:3000/login/nova-senha?token={token}";
            var corpo = $@"
                <p>Olá, {usuario.Nome}!</p>
                <p>Você solicitou a recuperação de senha.</p>
                <p><a href=""{link}"">Clique aqui para redefinir sua senha</a></p>
                <p>Este link expira em 5 Minutos.</p>";

            emailService.Enviar(usuario.Email, "Recuperação de senha - MacSync", corpo);

            return Ok("Instruções de recuperação enviadas para seu e-mail.");
        }


        [HttpPost("nova-senha")]
        public async Task<IActionResult> AtualizarSenhaComToken(
            [FromBody] AtualizacaoSenhaRequisicao requisicao,
            [FromServices] IUsuarioRepositorio usuarioRepositorio)
        {
            var usuario = await usuarioRepositorio.ObterPorTokenAsync(requisicao.Token);
            if (usuario == null || usuario.TokenExpiracao < DateTime.UtcNow)
                return BadRequest("Token inválido ou expirado.");

            usuario.Senha = requisicao.NovaSenha; // Aqui deve haver hashing
            usuario.TokenRecuperacaoSenha = null;
            usuario.TokenExpiracao = null;

            await usuarioRepositorio.AtualizarAsync(usuario);
            return Ok("Senha atualizada com sucesso.");
        }


        [HttpPost("{id}/adicionar-saldo")]
        public async Task<IActionResult> AdicionarSaldo(int id, [FromBody] AdicionarSaldoRequest req)
        {
            var usuario = await _usuarioRepositorio.ObterPorIdAsync(id);
            if (usuario == null) return NotFound();

            usuario.Saldo += req.Valor;
            await _usuarioRepositorio.AtualizarAsync(usuario);

            return Ok("Saldo atualizado com sucesso.");
        }

        public class AdicionarSaldoRequest
        {
            public decimal Valor { get; set; }
        }

        [HttpPost("descontar-saldo/{id}")]
        public async Task<IActionResult> DescontarSaldo(int id, [FromBody] AdicionarSaldoRequest req)
        {
            var usuario = await _usuarioRepositorio.ObterPorIdAsync(id);
            if (usuario == null) return NotFound();

            if (usuario.Saldo < req.Valor)
                return BadRequest("Saldo insuficiente.");

            usuario.Saldo -= req.Valor;
            await _usuarioRepositorio.AtualizarAsync(usuario);

            return Ok("Saldo descontado com sucesso.");
        }

    }

}
