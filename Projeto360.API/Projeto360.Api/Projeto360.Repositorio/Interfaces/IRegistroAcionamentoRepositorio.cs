using Projeto360Final.Dominio.Entidades;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Projeto360Final.Repositorio.Interfaces
{
    public interface IRegistroAcionamentoRepositorio
    {
        Task<List<RegistroAcionamento>> ListarTodosAsync();
        Task<List<RegistroAcionamento>> ListarPorMaquinaAsync(int maquinaId);
        Task<List<RegistroAcionamento>> ListarPendentesAsync();
        Task<List<RegistroAcionamento>> ListarEfetivadosAsync();
        Task<List<RegistroAcionamento>> ListarComErroAsync();
    }
}
