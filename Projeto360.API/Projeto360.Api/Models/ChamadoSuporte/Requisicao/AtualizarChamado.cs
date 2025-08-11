namespace Projeto360Final.API.Models.Requisicao
{
    public class AtualizarChamado
    {
        public string? Tipo { get; set; }
        public string? Mensagem { get; set; }
        public string? Status { get; set; }
        public bool? Ativo { get; set; }
        public int EstabelecimentoId { get; set; }
    }
}
