using Projeto360Final.Dominio.Entidades;
using Projeto360Final.Repositorio.Contexto;
using Microsoft.EntityFrameworkCore;
using Projeto360Final.Repositorio.Repositorios;
using Projeto360Final.Repositorio.Interfaces;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using System.Linq; // Add this if IUsuarioRepositorio is in this namespace

namespace Projeto360Final.Repositorio.Repositorios
{
    public class UsuarioRepositorio : BaseRepositorio, IUsuarioRepositorio
    {
        public UsuarioRepositorio(Projeto360FinalContexto contexto) : base(contexto)
        {
        }

        public async Task<int> SalvarAsync(Usuario usuario)
        {
            await _contexto.Usuarios.AddAsync(usuario);
            await _contexto.SaveChangesAsync();
            return usuario.Id;
        }

        public async Task AtualizarAsync(Usuario usuario)
        {
            _contexto.Usuarios.Update(usuario);
            await _contexto.SaveChangesAsync();
        }

        public async Task<Usuario?> ObterPorIdAsync(int id)
        {
            return await _contexto.Usuarios
                .Include(u => u.Estabelecimento)
                .FirstOrDefaultAsync(u => u.Id == id);
        }


        public async Task<Usuario?> ObterPorEmailAsync(string email)
        {
            return await _contexto.Usuarios
                .Where(u => u.Email == email && u.Ativo)
                .FirstOrDefaultAsync();
        }

        public async Task<Usuario?> ObterUsuarioCompletoPorEmailAsync(string email)
        {
            return await _contexto.Usuarios
                .FirstOrDefaultAsync(u => u.Email == email); // sem filtro de Ativo
        }


        public async Task<List<Usuario>> ListarAsync(bool ativo)
        {
            return await _contexto.Usuarios
                .Where(u => u.Ativo == ativo)
                .ToListAsync();
        }



        public async Task<List<Usuario>> ObterTodosAsync()
        {
            return await _contexto.Usuarios.ToListAsync();
        }

        public async Task DefinirTokenRecuperacaoAsync(int usuarioId, string token, DateTime expiracao)
        {
            var usuario = await _contexto.Usuarios.FirstOrDefaultAsync(u => u.Id == usuarioId);
            if (usuario != null)
            {
                usuario.TokenRecuperacaoSenha = token;
                usuario.TokenExpiracao = expiracao;
                await _contexto.SaveChangesAsync();
            }
        }

        public async Task<Usuario?> ObterPorTokenAsync(string token)
        {
            var timeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
            var now = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZone);

            return await _contexto.Usuarios
                .FirstOrDefaultAsync(u => u.TokenRecuperacaoSenha == token && u.TokenExpiracao > now);
        }

        public async Task<Usuario?> ObterPorTokenRecuperacaoAsync(string token)
        {
            return await _contexto.Usuarios
                .Where(u => u.TokenRecuperacaoSenha == token && u.TokenExpiracao > DateTime.UtcNow)
                .FirstOrDefaultAsync();
        }


        public async Task LimparTokenRecuperacaoAsync(int usuarioId)
        {
            var usuario = await _contexto.Usuarios.FirstOrDefaultAsync(u => u.Id == usuarioId);
            if (usuario != null)
            {
                usuario.TokenRecuperacaoSenha = null;
                usuario.TokenExpiracao = null;
                await _contexto.SaveChangesAsync();
            }
        }

        public async Task<List<Usuario>> ObterUsuariosAsync()
        {
            return await _contexto.Usuarios
                .Include(u => u.Estabelecimento)
                .ToListAsync();
        }


        public async Task RemoverAsync(Usuario usuario)
        {
            _contexto.Usuarios.Remove(usuario);
            await _contexto.SaveChangesAsync();
        }



    }
}
