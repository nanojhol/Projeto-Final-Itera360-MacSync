namespace Projeto360Final.API.Models.Requisicao
{
    public class AtualizarUsuario
    {
        public string? Nome { get; set; }
        public string? Email { get; set; }
        public string? Senha { get; set; }
        public bool? Ativo { get; set; }
        public int? TipoConta { get; set; }
        public decimal? Saldo { get; set; }
        public int? EstabelecimentoId { get; set; }
    }
    
}
