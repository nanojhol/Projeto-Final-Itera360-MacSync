namespace Projeto360Final.Dominio.Entidades
{
    public class LogDeAcao
    {
        public int Id { get; set; }

        public int UsuarioId { get; set; }

        public string Acao { get; set; } = string.Empty;

        public string? EntidadeAfetada { get; set; }
        public int? EntidadeIdAfetada { get; set; }

        public string? DescricaoDetalhada { get; set; }

        public DateTime DataHora { get; set; } = DateTime.Now;

        public Usuario Usuario { get; set; } = null!;

        public LogDeAcao() { }

        public LogDeAcao(int usuarioId, string acao, string? entidadeAfetada = null, int? entidadeIdAfetada = null, string? descricao = null)
        {
            UsuarioId = usuarioId;
            Acao = acao;
            EntidadeAfetada = entidadeAfetada;
            EntidadeIdAfetada = entidadeIdAfetada;
            DescricaoDetalhada = descricao;
            DataHora = DateTime.Now;
        }
    }
}
