using Projeto360Final.Dominio.Entidades;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Projeto360Final.Repositorio.Interfaces
{
    public interface ISugestaoIARepositorio
    {
        Task<List<SugestaoIA>> ListarTodasAsync();
        Task<List<SugestaoIA>> ListarPorEstabelecimentoAsync(int estabelecimentoId);
        Task<List<SugestaoIA>> ListarPorMaquinaAsync(int maquinaId);
        Task<List<SugestaoIA>> ListarPorPeriodoAsync(DateTime inicio, DateTime fim);
        Task<SugestaoIA> ObterPorIdAsync(int id);
        Task AdicionarAsync(SugestaoIA sugestao);

        Task<List<RegistroUtilizacao>> ObterRegistrosDeUtilizacaoPorMaquinaAsync(int maquinaId);
        Task<List<RegistroAcionamento>> ObterRegistrosDeAcionamentoPorMaquinaAsync(int maquinaId);

        Task<List<RegistroUtilizacao>> ObterRegistrosDeUtilizacaoPorUsuarioAsync(int usuarioId);

    }
}
