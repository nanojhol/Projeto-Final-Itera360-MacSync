using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Projeto360Final.Dominio.Entidades;
using Projeto360Final.Dominio.Enumeradores;
using Projeto360Final.Repositorio.Contexto;
using Projeto360Final.Repositorio.Interfaces;

namespace Projeto360Final.Repositorio.Repositorios
{
    public class RegistroUtilizacaoRepositorio : BaseRepositorio, IRegistroUtilizacaoRepositorio
    {
        public RegistroUtilizacaoRepositorio(Projeto360FinalContexto contexto) : base(contexto)
        {
        }

        public async Task<int> SalvarAsync(RegistroUtilizacao registro)
        {
            await _contexto.RegistrosUtilizacao.AddAsync(registro);
            await _contexto.SaveChangesAsync();
            return registro.Id;
        }

        public async Task<List<RegistroUtilizacao>> ListarTodosAsync()
        {
            return await _contexto.RegistrosUtilizacao
                .Include(r => r.Usuario)
                .Include(r => r.Maquina)
                .OrderByDescending(r => r.DataHora)
                .ToListAsync();
        }

        public async Task<List<RegistroUtilizacao>> ListarPorUsuarioAsync(int usuarioId)
        {
            return await _contexto.RegistrosUtilizacao
                .Where(r => r.UsuarioId == usuarioId)
                .Include(r => r.Maquina)
                .OrderByDescending(r => r.DataHora)
                .ToListAsync();
        }

        public async Task<List<RegistroUtilizacao>> ListarPorMaquinaAsync(int maquinaId)
        {
            return await _contexto.RegistrosUtilizacao
                .Where(r => r.MaquinaId == maquinaId)
                .Include(r => r.Usuario)
                .OrderByDescending(r => r.DataHora)
                .ToListAsync();
        }

        public async Task<List<RegistroUtilizacao>> ListarPorStatusAsync(StatusUtilizacao status)
        {
            return await _contexto.RegistrosUtilizacao
                .Where(r => r.Status == status)
                .Include(r => r.Usuario)
                .Include(r => r.Maquina)
                .OrderByDescending(r => r.DataHora)
                .ToListAsync();
        }

        public async Task<List<RegistroUtilizacao>> ListarPorPeriodoAsync(DateTime inicio, DateTime fim)
        {
            return await _contexto.RegistrosUtilizacao
                .Where(r => r.DataHora >= inicio && r.DataHora <= fim)
                .Include(r => r.Usuario)
                .Include(r => r.Maquina)
                .OrderByDescending(r => r.DataHora)
                .ToListAsync();
        }

        public async Task<RegistroUtilizacao?> ObterPorIdAsync(int id)
        {
            return await _contexto.RegistrosUtilizacao
                .Include(r => r.Usuario)
                .Include(r => r.Maquina)
                .FirstOrDefaultAsync(r => r.Id == id);
        }


        public async Task AtualizarAsync(RegistroUtilizacao reg)
        {
            _contexto.RegistrosUtilizacao.Update(reg);
            await _contexto.SaveChangesAsync();
        }

        public async Task RemoverAsync(RegistroUtilizacao reg)
        {
            _contexto.RegistrosUtilizacao.Remove(reg);
            await _contexto.SaveChangesAsync();
        }
        

    }
}
