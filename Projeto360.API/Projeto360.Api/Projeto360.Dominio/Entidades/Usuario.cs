using Projeto360Final.Dominio.Enumeradores;

namespace Projeto360Final.Dominio.Entidades
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nome { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Senha { get; set; } = null!;
        public TipoConta TipoConta { get; set; }
        public bool Ativo { get; set; } = true;
        public decimal Saldo { get; set; } = 0;
        public DateTime DataCriacao { get; set; } = DateTime.Now;

        public int? EstabelecimentoId { get; set; }
        public Estabelecimento? Estabelecimento { get; set; }

        public List<RegistroUtilizacao> Utilizacoes { get; set; } = new();
        public List<LogDeAcao> Logs { get; set; } = new();
        public List<ChamadoSuporte> Chamados { get; set; } = new();

        public string? TokenRecuperacaoSenha { get; set; }
        public DateTime? TokenExpiracao { get; set; }

        public string? TokenRecuperacao { get; set; }

        public DateTime? UltimoLogin { get; set; }

        public Usuario()
        {
            Ativo = true;
        }

        public void Deletar()
        {
            Ativo = false;
        }

        public void Restaurar()
        {
            Ativo = true;
        }
    }
}
