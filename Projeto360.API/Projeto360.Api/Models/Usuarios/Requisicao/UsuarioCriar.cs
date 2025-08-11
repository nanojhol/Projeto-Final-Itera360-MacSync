namespace Projeto360Final.API.Models.Requisicao
{
    public class CriarUsuario
    {
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public int TipoConta { get; set; }
        public int EstabelecimentoId { get; set; }
    }
}
