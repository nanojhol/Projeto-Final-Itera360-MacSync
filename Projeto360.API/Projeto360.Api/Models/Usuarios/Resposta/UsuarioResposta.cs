using Projeto360Final.Dominio.Entidades;
using Projeto360Final.Dominio.Enumeradores;

namespace Projeto360Final.API.Models.Resposta
{
    public class UsuarioResposta
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int TipoConta { get; set; }
        public bool Ativo { get; set; }
        public decimal Saldo { get; set; }
        public int? EstabelecimentoId { get; set; }
        public string? NomeEstabelecimento { get; set; }
        public DateTime? UltimoLogin { get; set; }
        public List<int> HistoricoEstabelecimentos { get; set; } = new();


        public UsuarioResposta(Usuario usuario)
        {
            Id = usuario.Id;
            Nome = usuario.Nome;
            Email = usuario.Email;
            TipoConta = (int)usuario.TipoConta;
            Ativo = usuario.Ativo;
            Saldo = usuario.Saldo;
            EstabelecimentoId = usuario.EstabelecimentoId;
            NomeEstabelecimento = usuario.Estabelecimento?.Nome;
            UltimoLogin = usuario.UltimoLogin;
        }
    }

}
