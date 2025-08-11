using System;
using System.Security.Claims;
using System.Collections.Generic;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Projeto360Final.Dominio.Entidades;
using Projeto360Final.Repositorio.Interfaces;


namespace Projeto360Final.Servicos
{
    public class UsuarioAutenticacaoService
    {
        private readonly IUsuarioRepositorio _usuarioRepositorio;
        private readonly JwtService _jwtService;

        public UsuarioAutenticacaoService(IUsuarioRepositorio usuarioRepositorio, JwtService jwtService)
        {
            _usuarioRepositorio = usuarioRepositorio;
            _jwtService = jwtService;
        }

        public async Task<(bool sucesso, string? token, Usuario? usuario)> TentarLoginAsync(string email, string senha)
        {
            var usuario = await _usuarioRepositorio.ObterPorEmailAsync(email);

            if (usuario == null || usuario.Senha != senha || !usuario.Ativo)
                return (false, null, null);

            // 👇 Aqui adiciona as claims
            var claims = new List<Claim>
            {
                new Claim("id", usuario.Id.ToString()), // <- ESSENCIAL para saber quem acionou
                new Claim(ClaimTypes.Name, usuario.Nome),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.TipoConta.ToString()),

                // opcional
                new Claim("estabelecimentoId", usuario.EstabelecimentoId.ToString())
            };

            var identity = new ClaimsIdentity(claims, "login");
            var principal = new ClaimsPrincipal(identity);

            var token = _jwtService.GenerateToken(usuario);
            return (true, token, usuario);
        }
    }
}
