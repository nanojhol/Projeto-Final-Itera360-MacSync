namespace Projeto360Final.API.Models.Requisicao
{
    public class CriarLogDeAcao
    {
        public int UsuarioId { get; set; }
        public string Acao { get; set; } = string.Empty;
        public string? EntidadeAfetada { get; set; }
        public int? EntidadeIdAfetada { get; set; }
        public string? DescricaoDetalhada { get; set; }
    }
}
