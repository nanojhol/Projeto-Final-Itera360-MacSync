using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Projeto360Final.Dominio.Entidades;

namespace Projeto360Final.Repositorio.Interfaces
{
    public interface ILogDeAcaoRepositorio
    {
        Task<int> SalvarAsync(LogDeAcao log);
        Task<List<LogDeAcao>> ListarTodosAsync();
        Task<List<LogDeAcao>> ListarPorUsuarioAsync(int usuarioId);
        Task<List<LogDeAcao>> ListarPorEntidadeAsync(string entidadeAfetada);
        Task<List<LogDeAcao>> ListarPorPeriodoAsync(DateTime inicio, DateTime fim);
        Task<LogDeAcao?> ObterPorIdAsync(int id);
    }
}
