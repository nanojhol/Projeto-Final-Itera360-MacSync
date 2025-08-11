using Microsoft.EntityFrameworkCore;
using Projeto360Final.Dominio.Entidades;
using Projeto360Final.Repositorio.Contexto;
using Projeto360Final.Repositorio.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Projeto360Final.Repositorio.Repositorios
{
    public class RegistroAcionamentoRepositorio : BaseRepositorio, IRegistroAcionamentoRepositorio
    {
        public RegistroAcionamentoRepositorio(Projeto360FinalContexto contexto) : base(contexto) { }

        public async Task<List<RegistroAcionamento>> ListarTodosAsync()
        {
            return await _contexto.RegistrosAcionamento.ToListAsync();
        }

        public async Task<List<RegistroAcionamento>> ListarPorMaquinaAsync(int maquinaId)
        {
            return await _contexto.RegistrosAcionamento
                .Where(r => r.MaquinaId == maquinaId)
                .ToListAsync();
        }

        public async Task<List<RegistroAcionamento>> ListarPendentesAsync()
        {
            return await _contexto.RegistrosAcionamento
                .Where(r => !r.Sucesso && r.DataHoraResposta == null)
                .ToListAsync();
        }

        public async Task<List<RegistroAcionamento>> ListarEfetivadosAsync()
        {
            return await _contexto.RegistrosAcionamento
                .Where(r => r.Sucesso)
                .ToListAsync();
        }

        public async Task<List<RegistroAcionamento>> ListarComErroAsync()
        {
            return await _contexto.RegistrosAcionamento
                .Where(r => !r.Sucesso && r.MensagemErro != null)
                .ToListAsync();
        }
    }
}
