using Microsoft.EntityFrameworkCore;
using Projeto360Final.Dominio.Entidades;
using Projeto360Final.Repositorio.Contexto;
using Projeto360Final.Repositorio.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace Projeto360Final.Repositorio.Repositorios
{
    public class SugestaoIARepositorio : ISugestaoIARepositorio
    {
        private readonly Projeto360FinalContexto _contexto;

        public SugestaoIARepositorio(Projeto360FinalContexto contexto)
        {
            _contexto = contexto;
        }

        public async Task<List<SugestaoIA>> ListarTodasAsync()
        {
            return await _contexto.Set<SugestaoIA>()
                                  .Include(s => s.Maquina)
                                  .Include(s => s.Estabelecimento)
                                  .ToListAsync();
        }

        public async Task<List<SugestaoIA>> ListarPorEstabelecimentoAsync(int estabelecimentoId)
        {
            return await _contexto.Set<SugestaoIA>()
                                  .Where(s => s.EstabelecimentoId == estabelecimentoId)
                                  .Include(s => s.Maquina)
                                  .ToListAsync();
        }

        public async Task<List<SugestaoIA>> ListarPorMaquinaAsync(int maquinaId)
        {
            return await _contexto.Set<SugestaoIA>()
                                  .Where(s => s.MaquinaId == maquinaId)
                                  .Include(s => s.Estabelecimento)
                                  .ToListAsync();
        }

        public async Task<List<SugestaoIA>> ListarPorPeriodoAsync(DateTime inicio, DateTime fim)
        {
            return await _contexto.Set<SugestaoIA>()
                                  .Where(s => s.DataGeracao >= inicio && s.DataGeracao <= fim)
                                  .ToListAsync();
        }

        public async Task<SugestaoIA> ObterPorIdAsync(int id)
        {
            return await _contexto.Set<SugestaoIA>()
                                  .Include(s => s.Maquina)
                                  .Include(s => s.Estabelecimento)
                                  .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task AdicionarAsync(SugestaoIA sugestao)
        {
            try
            {
                await _contexto.Set<SugestaoIA>().AddAsync(sugestao);
                await _contexto.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro no repositório SugestaoIA: " + ex.Message);
                Console.WriteLine("InnerException: " + ex.InnerException?.Message);
                throw; // relança para subir pro controller
            }
        }


        public async Task<List<RegistroUtilizacao>> ObterRegistrosDeUtilizacaoPorMaquinaAsync(int maquinaId)
        {
            return await _contexto.RegistrosUtilizacao
                .Include(r => r.Maquina)
                .Where(r => r.MaquinaId == maquinaId)
                .ToListAsync();

        }

        public async Task<List<RegistroAcionamento>> ObterRegistrosDeAcionamentoPorMaquinaAsync(int maquinaId)
        {
            return await _contexto.RegistrosAcionamento
                .Where(r => r.MaquinaId == maquinaId)
                .ToListAsync();
        }


        public async Task<List<RegistroUtilizacao>> ObterRegistrosDeUtilizacaoPorUsuarioAsync(int usuarioId)
        {
            return await _contexto.RegistrosUtilizacao
                .Include(r => r.Maquina)
                .Include(r => r.Usuario)
                .Where(r => r.UsuarioId == usuarioId)
                .ToListAsync();
        }



    }
}
