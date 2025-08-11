using Projeto360Final.Dominio.Entidades;

namespace Projeto360Final.API.Models.Resposta
{
    public class ChamadoResposta
    {
        // public ChamadoResposta(ChamadoSuporte chamado)
        // {
        //     Id = chamado.Id;
        //     UsuarioId = chamado.UsuarioId;
        //     Estabelecimento = chamado.Estabelecimento;
        //     Tipo = chamado.Tipo;
        //     Mensagem = chamado.Mensagem;
        //     Status = chamado.Status;
        //     DataCriacao = chamado.DataCriacao;
        //     Ativo = chamado.Ativo;
        //     NomeUsuario = chamado.Usuario?.Nome;
        // }

        public ChamadoResposta(ChamadoSuporte chamado)
        {
            Id = chamado.Id;
            UsuarioId = chamado.UsuarioId;
            Estabelecimento = chamado.Estabelecimento ?? string.Empty;
            EstabelecimentoId = chamado.EstabelecimentoId;
            Tipo = chamado.Tipo ?? string.Empty;
            Mensagem = chamado.Mensagem ?? string.Empty;
            Status = chamado.Status ?? string.Empty;
            DataCriacao = chamado.DataCriacao;
            Ativo = chamado.Ativo;
        }


        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public string Estabelecimento { get; set; } = string.Empty;
        public int EstabelecimentoId { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public string Mensagem { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime DataCriacao { get; set; }
        public bool Ativo { get; set; }
        public string? NomeUsuario { get; set; }
    }
}
