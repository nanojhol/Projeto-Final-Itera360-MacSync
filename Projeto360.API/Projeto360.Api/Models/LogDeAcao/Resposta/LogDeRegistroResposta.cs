using Projeto360Final.Dominio.Entidades;

namespace Projeto360Final.API.Models.Resposta
{
    public class LogDeAcaoResposta
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public string Acao { get; set; } = string.Empty;
        public string? EntidadeAfetada { get; set; }
        public int? EntidadeIdAfetada { get; set; }
        public string? DescricaoDetalhada { get; set; }
        public DateTime DataHora { get; set; }

        public LogDeAcaoResposta(LogDeAcao log)
        {
            Id = log.Id;
            UsuarioId = log.UsuarioId;
            Acao = log.Acao;
            EntidadeAfetada = log.EntidadeAfetada;
            EntidadeIdAfetada = log.EntidadeIdAfetada;
            DescricaoDetalhada = log.DescricaoDetalhada;
            DataHora = log.DataHora;
        }
    }
}
