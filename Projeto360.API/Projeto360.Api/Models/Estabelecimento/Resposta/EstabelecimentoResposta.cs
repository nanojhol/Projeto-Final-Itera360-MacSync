using Projeto360Final.Dominio.Entidades;

namespace Projeto360Final.API.Models.Resposta
{
    public class EstabelecimentoResposta
    {
        public EstabelecimentoResposta(Estabelecimento est)
        {
            Id = est.Id;
            Nome = est.Nome;
            Endereco = est.Endereco;
            Telefone = est.Telefone;
            Ativo = est.Ativo;
        }

        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Endereco { get; set; }
        public string Telefone { get; set; }
        public bool Ativo { get; set; }
    }
}
