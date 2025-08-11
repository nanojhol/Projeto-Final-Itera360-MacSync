using System.Collections.Generic;
using System.Threading.Tasks;
using Projeto360Final.Dominio.Entidades;

namespace Projeto360Final.Repositorio.Interfaces
{
    public interface IChamadoSuporteRepositorio
    {
        Task<int> SalvarAsync(ChamadoSuporte chamado);
        Task<ChamadoSuporte?> ObterPorIdAsync(int id);
        Task<List<ChamadoSuporte>> ListarTodosAsync();
        Task<List<ChamadoSuporte>> ListarPorUsuarioAsync(int usuarioId);
        Task AtualizarAsync(ChamadoSuporte chamado);
        Task RemoverAsync(ChamadoSuporte chamado);
        Task<ChamadoSuporte?> ObterMesmoDesativadoAsync(int id);

    }
}