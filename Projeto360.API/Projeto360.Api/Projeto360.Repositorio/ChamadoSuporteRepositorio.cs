using Microsoft.EntityFrameworkCore;
using Projeto360Final.Repositorio.Contexto;
using Projeto360Final.Repositorio.Interfaces;
using Projeto360Final.Dominio.Entidades;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace Projeto360Final.Repositorio.Repositorios
{
    public class ChamadoSuporteRepositorio : BaseRepositorio, IChamadoSuporteRepositorio
    {
        public ChamadoSuporteRepositorio(Projeto360FinalContexto contexto) : base(contexto) { }

        public async Task<int> SalvarAsync(ChamadoSuporte chamado)
        {
            await _contexto.ChamadosSuporte.AddAsync(chamado);
            await _contexto.SaveChangesAsync();
            return chamado.Id;
        }

        public async Task AtualizarAsync(ChamadoSuporte chamado)
        {
            _contexto.ChamadosSuporte.Update(chamado);
            await _contexto.SaveChangesAsync();
        }

        public async Task<ChamadoSuporte?> ObterPorIdAsync(int id)
        {
            return await _contexto.ChamadosSuporte
                .Include(c => c.Usuario)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<List<ChamadoSuporte>> ListarTodosAsync()
        {
            return await _contexto.ChamadosSuporte
                .Include(c => c.Usuario)
                .ToListAsync();
            // return await _contexto.ChamadosSuporte
            //     .Include(c => c.Estabelecimento)
            //     .ToListAsync();

        }

        public async Task<List<ChamadoSuporte>> ListarPorUsuarioAsync(int usuarioId)
        {
            return await _contexto.ChamadosSuporte
                .Where(c => c.UsuarioId == usuarioId)
                .Include(c => c.Usuario)
                .ToListAsync();
        }


        public async Task<List<ChamadoSuporte>> ListarPorStatusAsync(string status)
        {
            return await _contexto.ChamadosSuporte
                .Where(c => c.Status == status)
                .Include(c => c.Usuario)
                .ToListAsync();
        }

        public async Task RemoverAsync(ChamadoSuporte chamado)
        {
            _contexto.ChamadosSuporte.Remove(chamado);
            await _contexto.SaveChangesAsync();
        }

        public async Task<ChamadoSuporte?> ObterMesmoDesativadoAsync(int id)
        {
            return await _contexto.ChamadosSuporte
                .IgnoreQueryFilters() // só se estiver usando filtros globais
                .Include(c => c.Usuario)
                .FirstOrDefaultAsync(c => c.Id == id);
        }



    }
}
