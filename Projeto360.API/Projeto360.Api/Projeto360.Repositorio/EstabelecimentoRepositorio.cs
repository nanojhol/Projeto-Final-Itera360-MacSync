using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Projeto360Final.Dominio.Entidades;
using Projeto360Final.Repositorio.Contexto;
using Projeto360Final.Repositorio.Interfaces;

namespace Projeto360Final.Repositorio.Repositorios
{
    public class EstabelecimentoRepositorio : BaseRepositorio, IEstabelecimentoRepositorio
    {
        public EstabelecimentoRepositorio(Projeto360FinalContexto contexto) : base(contexto)
        {
        }

        public async Task<int> SalvarAsync(Estabelecimento estabelecimento)
        {
            await _contexto.Estabelecimentos.AddAsync(estabelecimento);
            await _contexto.SaveChangesAsync();
            return estabelecimento.Id;
        }

        public async Task AtualizarAsync(Estabelecimento estabelecimento)
        {
            _contexto.Estabelecimentos.Update(estabelecimento);
            await _contexto.SaveChangesAsync();
        }

        public async Task<Estabelecimento?> ObterPorIdAsync(int id)
        {
            return await _contexto.Estabelecimentos
                .Include(e => e.Maquinas)
                .Include(e => e.Coordenadores)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Estabelecimento?> ObterPorNomeAsync(string nome)
        {
            return await _contexto.Estabelecimentos
                .FirstOrDefaultAsync(e => e.Nome == nome);
        }


        public async Task<List<Estabelecimento>> ListarTodosAsync()
        {
            return await _contexto.Estabelecimentos
                .Include(e => e.Maquinas)
                .Include(e => e.Coordenadores)
                .ToListAsync();
        }

        public async Task<List<Estabelecimento>> ListarAtivosAsync()
        {
            return await _contexto.Estabelecimentos
                .Where(e => e.Ativo)
                .Include(e => e.Maquinas)
                .Include(e => e.Coordenadores)
                .ToListAsync();
        }

        public async Task<List<Estabelecimento>> ListarPorNomeAsync(string nome)
        {
            return await _contexto.Estabelecimentos
                .Where(e => e.Nome.Contains(nome))
                .Include(e => e.Maquinas)
                .Include(e => e.Coordenadores)
                .ToListAsync();
        }

        public async Task RemoverAsync(Estabelecimento est)
        {
            _contexto.Estabelecimentos.Remove(est);
            await _contexto.SaveChangesAsync();
        }

        public async Task<IEnumerable<Estabelecimento>> ListarAsync()
        {
            return await _contexto.Estabelecimentos
                .Include(e => e.Maquinas)
                .Include(e => e.Coordenadores)
                .ToListAsync();
        }

    }
}
