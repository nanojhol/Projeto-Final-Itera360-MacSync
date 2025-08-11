using Projeto360Final.Dominio.Entidades;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Projeto360Final.Repositorio.Interfaces
{
    public interface IMaquinaRepositorio
    {
        Task<int> SalvarAsync(Maquina maquina);
        Task AtualizarAsync(Maquina maquina);
        Task<Maquina?> ObterPorIdAsync(int id);
        Task<Maquina?> ObterInativoAsync(int id);
        Task RemoverAsync(Maquina maquina);

        Task<List<Maquina>> ListarTodasAsync();
        Task<List<Maquina>> ListarPorEstabelecimentoAsync(int estabelecimentoId);
        Task<List<Maquina>> ListarAtivasAsync();
        Task<List<Maquina>> ListarInativasAsync();
        Task<Maquina?> ObterPorMacAsync(string mac);

    }
}
