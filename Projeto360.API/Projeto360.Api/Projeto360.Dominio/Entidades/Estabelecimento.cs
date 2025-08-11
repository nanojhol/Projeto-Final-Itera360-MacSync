namespace Projeto360Final.Dominio.Entidades
{
    public class Estabelecimento

    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Endereco;
        public string? Telefone { get; set; }
        public bool Ativo { get; set; }

        // Relacionamentos
        public List<Maquina> Maquinas { get; set; } = new();
        public List<Usuario> Coordenadores { get; set; } = new();
        public List<ChamadoSuporte> Chamados { get; set; } = new();


        public void Atualizar(string? nome, string? endereco, string telefone, bool? ativo)
        {
            if (!string.IsNullOrWhiteSpace(nome))
                Nome = nome;

            if (!string.IsNullOrWhiteSpace(endereco))
                Endereco = endereco;

            if (!string.IsNullOrWhiteSpace(telefone))
                Telefone = telefone;

            if (ativo.HasValue)
                Ativo = ativo.Value;
        }

        public Estabelecimento()
        {
            Ativo = true;
        }

        public Estabelecimento(string nome, string endereco, string telefone)
        {
            Nome = nome;
            Endereco = endereco;
            Telefone = telefone;
        }

        public void Desativar()
        {
            Ativo = false;
        }

        public void Reativar()
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
