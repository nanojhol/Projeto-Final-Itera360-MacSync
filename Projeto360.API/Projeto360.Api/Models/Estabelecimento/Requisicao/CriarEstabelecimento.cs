namespace Projeto360Final.API.Models.Requisicao
{
    public class CriarEstabelecimento
    {
        public string Nome { get; set; } = string.Empty;
        public string? Endereco { get; set; }
        public string? Telefone { get; set; }
        public bool? Ativo { get; set; } = true;
    }
}
