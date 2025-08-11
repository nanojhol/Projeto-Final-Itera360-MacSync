using System.Collections.Generic;
using System.Threading.Tasks;
using Projeto360Final.Dominio.Entidades;
using Projeto360Final.Dominio.Enumeradores;

namespace Projeto360Final.Repositorio.Interfaces
{
    public interface IRegistroUtilizacaoRepositorio
    {
        Task<int> SalvarAsync(RegistroUtilizacao reg);
        Task<RegistroUtilizacao?> ObterPorIdAsync(int id);
        Task<List<RegistroUtilizacao>> ListarTodosAsync();
        Task<List<RegistroUtilizacao>> ListarPorUsuarioAsync(int usuarioId);
        Task<List<RegistroUtilizacao>> ListarPorMaquinaAsync(int maquinaId);
        Task AtualizarAsync(RegistroUtilizacao reg);
        Task RemoverAsync(RegistroUtilizacao reg);
        
    }

}
