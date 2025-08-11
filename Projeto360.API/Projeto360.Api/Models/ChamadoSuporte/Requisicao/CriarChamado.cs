namespace Projeto360Final.API.Models.Requisicao
{
    public class CriarChamado
    {
        public int UsuarioId { get; set; }
        public string Estabelecimento { get; set; } = string.Empty;
        public int EstabelecimentoId {get; set; }
        public string Tipo { get; set; } = string.Empty;
        public string Mensagem { get; set; } = string.Empty;
    }
}
