using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Projeto360Final.Dominio.Entidades;
using Projeto360Final.Repositorio.Contexto;
using Projeto360Final.Repositorio.Interfaces;

namespace Projeto360Final.Repositorio.Repositorios
{
    public class LogDeAcaoRepositorio : BaseRepositorio, ILogDeAcaoRepositorio
    {
        public LogDeAcaoRepositorio(Projeto360FinalContexto contexto) : base(contexto)
        {
        }

        public async Task<int> SalvarAsync(LogDeAcao log)
        {
            await _contexto.LogsDeAcao.AddAsync(log);
            await _contexto.SaveChangesAsync();
            return log.Id;
        }

        public async Task<List<LogDeAcao>> ListarTodosAsync()
        {
            return await _contexto.LogsDeAcao
                .Include(l => l.Usuario)
                .OrderByDescending(l => l.DataHora)
                .ToListAsync();
        }

        public async Task<List<LogDeAcao>> ListarPorUsuarioAsync(int usuarioId)
        {
            return await _contexto.LogsDeAcao
                .Where(l => l.UsuarioId == usuarioId)
                .Include(l => l.Usuario)
                .OrderByDescending(l => l.DataHora)
                .ToListAsync();
        }

        public async Task<List<LogDeAcao>> ListarPorEntidadeAsync(string entidadeAfetada)
        {
            return await _contexto.LogsDeAcao
                .Where(l => l.EntidadeAfetada != null && l.EntidadeAfetada.ToLower().Contains(entidadeAfetada.ToLower()))
                .Include(l => l.Usuario)
                .OrderByDescending(l => l.DataHora)
                .ToListAsync();
        }

        public async Task<List<LogDeAcao>> ListarPorPeriodoAsync(DateTime inicio, DateTime fim)
        {
            return await _contexto.LogsDeAcao
                .Where(l => l.DataHora >= inicio && l.DataHora <= fim)
                .Include(l => l.Usuario)
                .OrderByDescending(l => l.DataHora)
                .ToListAsync();
        }

        public async Task<LogDeAcao?> ObterPorIdAsync(int id)
        {
            return await _contexto.LogsDeAcao
                .Include(l => l.Usuario)
                .FirstOrDefaultAsync(l => l.Id == id);
        }
    }
}
