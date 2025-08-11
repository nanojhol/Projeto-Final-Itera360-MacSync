using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Projeto360Final.Dominio.Entidades;
using Projeto360Final.Repositorio.Contexto;
using Projeto360Final.Repositorio.Interfaces;

namespace Projeto360Final.Repositorio.Repositorios
{
    public class MaquinaRepositorio : BaseRepositorio, IMaquinaRepositorio
    {
        public MaquinaRepositorio(Projeto360FinalContexto contexto) : base(contexto)
        {
        }

        public async Task<int> SalvarAsync(Maquina maquina)
        {
            await _contexto.Maquinas.AddAsync(maquina);
            await _contexto.SaveChangesAsync();
            return maquina.Id;
        }

        public async Task AtualizarAsync(Maquina maquina)
        {
            _contexto.Maquinas.Update(maquina);
            await _contexto.SaveChangesAsync();
        }

        public async Task<Maquina?> ObterPorIdAsync(int id)
        {
            return await _contexto.Maquinas
                .Include(m => m.Estabelecimento)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<Maquina?> ObterInativoAsync(int id)
        {
            return await _contexto.Maquinas
                .Where(m => !m.Ativo && m.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task RemoverAsync(Maquina maquina)
        {
            _contexto.Maquinas.Remove(maquina);
            await _contexto.SaveChangesAsync();
        }

        public async Task<List<Maquina>> ListarTodasAsync()
        {
            return await _contexto.Maquinas
                .Include(m => m.Estabelecimento)
                .ToListAsync();
        }

        public async Task<List<Maquina>> ListarPorEstabelecimentoAsync(int estabelecimentoId)
        {
            return await _contexto.Maquinas
                .Where(m => m.EstabelecimentoId == estabelecimentoId)
                .Include(m => m.Estabelecimento)
                .ToListAsync();
        }

        public async Task<List<Maquina>> ListarAtivasAsync()
        {
            return await _contexto.Maquinas
                .Where(m => m.Ativo)
                .Include(m => m.Estabelecimento)
                .ToListAsync();
        }

        public async Task<List<Maquina>> ListarInativasAsync()
        {
            return await _contexto.Maquinas
                .Where(m => !m.Ativo)
                .Include(m => m.Estabelecimento)
                .ToListAsync();
        }

        public async Task<Maquina?> ObterPorMacAsync(string mac)
        {
            return await _contexto.Maquinas
                .Include(m => m.Acionamentos)
                .FirstOrDefaultAsync(m => m.MacAddress == mac);
        }

    }
}
