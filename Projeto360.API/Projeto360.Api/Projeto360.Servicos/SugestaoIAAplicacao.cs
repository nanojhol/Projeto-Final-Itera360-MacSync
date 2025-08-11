using Projeto360Final.Dominio.Entidades;
using Projeto360Final.Repositorio.Interfaces;
using Projeto360Final.Servicos.Models;
// using Projeto360Final.Servicos;

namespace Projeto360Final.Servicos
{
    public class SugestaoIAAplicacao
    {
        private readonly ISugestaoIARepositorio _repositorio;
        private readonly GeminiService _gemini;

        public SugestaoIAAplicacao(ISugestaoIARepositorio repositorio, GeminiService gemini)
        {
            _repositorio = repositorio;
            _gemini = gemini;
        }

        public async Task<SugestaoIA> GerarSugestaoParaMaquinaAsync(int maquinaId)
        {
            var registrosUso = await _repositorio.ObterRegistrosDeUtilizacaoPorMaquinaAsync(maquinaId);
            var registrosAcionamento = await _repositorio.ObterRegistrosDeAcionamentoPorMaquinaAsync(maquinaId);

            if (registrosUso == null || !registrosUso.Any())
                throw new Exception("Não há registros de utilização para essa máquina.");

            if (registrosAcionamento == null || !registrosAcionamento.Any())
                throw new Exception("Não há registros de acionamento para essa máquina.");

            var historicoDeUso = registrosUso.Select(r =>
                $"Data: {r.DataHora:dd/MM/yyyy HH:mm}, Status: {r.Status}, Valor: R${r.ValorCobrado:F2}").ToList();

            var feedbacks = registrosAcionamento.Select(a =>
                $"Data: {a.DataHoraEnvio:dd/MM/yyyy HH:mm}, Sucesso: {(a.Sucesso ? "Sim" : "Não")}, Mensagem: {a.MensagemErro}").ToList();

            var maquina = registrosUso.FirstOrDefault()?.Maquina;
            if (maquina == null)
                throw new Exception("Dados da máquina não foram encontrados.");

            var estabelecimentoId = maquina.EstabelecimentoId;

            var inputIa = new AnaliseInfraRequest
            {
                MaquinaId = maquinaId,
                NomeMaquina = maquina.TipoDispositivo ?? "Desconhecido",
                TipoDispositivo = maquina.TipoDispositivo ?? "Indefinido",

                DiscoAtualGB = maquina?.Disco ?? 1.0,
                MemoriaAtualGB = maquina?.Memoria ?? 1.0,

                HistoricoDeUso = historicoDeUso,
                FeedbacksUsuarios = feedbacks
            };

            var respostaIa = await _gemini.AnalisarInfraestruturaAsync(inputIa);

            var sugestao = new SugestaoIA
            {
                MaquinaId = maquinaId,
                EstabelecimentoId = estabelecimentoId,
                Disco = Convert.ToInt32(inputIa.DiscoAtualGB),
                Memoria = Convert.ToInt32(inputIa.MemoriaAtualGB),
                TipoInsight = respostaIa.RecomendacaoGeral,
                DataGeracao = DateTime.UtcNow
            };

            await _repositorio.AdicionarAsync(sugestao);
            return sugestao;
        }



        public async Task<AnaliseInfraUsuarioResponse> GerarSugestaoParaUsuarioAsync(int usuarioId)
        {
            // 1. Buscar os registros de uso do usuário
            var registros = await _repositorio.ObterRegistrosDeUtilizacaoPorUsuarioAsync(usuarioId);

            if (registros == null || !registros.Any())
                throw new Exception("Nenhum histórico de uso encontrado para este usuário.");

            // 2. Preparar dados para IA
            var historicoDeUso = registros.Select(r =>
                $"Data: {r.DataHora:dd/MM/yyyy HH:mm}, Máquina: {r.Maquina?.TipoDispositivo}, Valor: R${r.ValorCobrado:F2}"
            ).ToList();

            var discoMedio = registros.Average(r => r.Maquina?.Disco ?? 0);
            var memoriaMedia = registros.Average(r => r.Maquina?.Memoria ?? 0);
            // var nomeUsuario = registros.First().Usuario?.Nome ?? "Usuário";
            var primeiroRegistroComUsuario = registros.FirstOrDefault(r => r.Usuario != null);
            var nomeUsuario = primeiroRegistroComUsuario?.Usuario?.Nome ?? "Usuário";


            var input = new AnaliseInfraUsuarioRequest
            {
                NomeUsuario = nomeUsuario,
                TotalUsos = registros.Count,
                DiscoMedio = discoMedio,
                MemoriaMedia = memoriaMedia,
                HistoricoDeUso = historicoDeUso
            };

            // 3. Enviar para o GeminiService
            var resposta = await _gemini.AnalisarInfraestruturaParaUsuarioAsync(input);

            return resposta;
        }


    }
}
