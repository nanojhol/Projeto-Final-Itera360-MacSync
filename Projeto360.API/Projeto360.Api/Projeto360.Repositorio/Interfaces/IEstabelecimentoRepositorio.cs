using System.Collections.Generic;
using System.Threading.Tasks;
using Projeto360Final.Dominio.Entidades;

namespace Projeto360Final.Repositorio.Interfaces
{
    public interface IEstabelecimentoRepositorio
    {
        Task<int> SalvarAsync(Estabelecimento estabelecimento);
        Task AtualizarAsync(Estabelecimento estabelecimento);
        Task<Estabelecimento?> ObterPorIdAsync(int id);
        Task<Estabelecimento?> ObterPorNomeAsync(string nome);
        Task<List<Estabelecimento>> ListarTodosAsync();
        Task<List<Estabelecimento>> ListarAtivosAsync();
        Task<List<Estabelecimento>> ListarPorNomeAsync(string nome);
        Task RemoverAsync(Estabelecimento est);
        Task<IEnumerable<Estabelecimento>> ListarAsync();
    }
}
