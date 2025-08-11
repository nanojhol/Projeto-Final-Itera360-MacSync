using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Projeto360Final.Dominio.Entidades;

namespace Projeto360Final.Repositorio.Interfaces
{
    public interface IUsuarioRepositorio
    {
        Task<int> SalvarAsync(Usuario usuario);
        Task AtualizarAsync(Usuario usuario);
        Task<Usuario?> ObterPorIdAsync(int id);
        Task<Usuario?> ObterPorEmailAsync(string email);
        Task<Usuario?> ObterPorTokenAsync(string token);
        Task<List<Usuario>> ListarAsync(bool ativo);
        Task<List<Usuario>> ObterTodosAsync();
        Task DefinirTokenRecuperacaoAsync(int usuarioId, string token, DateTime expiracao);
        Task LimparTokenRecuperacaoAsync(int usuarioId);
        Task<List<Usuario>> ObterUsuariosAsync();
        Task RemoverAsync(Usuario usuario);
        Task<Usuario?> ObterUsuarioCompletoPorEmailAsync(string email);
        Task<Usuario?> ObterPorTokenRecuperacaoAsync(string token);

    }

}
