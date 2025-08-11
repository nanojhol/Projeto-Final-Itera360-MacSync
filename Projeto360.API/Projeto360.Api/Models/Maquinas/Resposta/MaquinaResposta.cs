using Projeto360Final.Dominio.Entidades;
using Projeto360Final.Repositorio;

namespace Projeto360Final.API.Models.Resposta
{
    public class MaquinaResposta
    {
        public MaquinaResposta(Maquina maquina)
        {
            Id = maquina.Id;
            IP = maquina.IP;
            MacAddress = maquina.MacAddress;
            StatusDispositivo = (int)maquina.StatusDispositivo;
            StatusUtilizacao = (int)maquina.StatusUtilizacao;
            ValorUtilizacao = maquina.ValorUtilizacao;
            TipoDispositivo = maquina.TipoDispositivo;
            AcaoPendente = maquina.AcaoPendente;
            EstabelecimentoId = maquina.EstabelecimentoId;
            EstabelecimentoNome = maquina.Estabelecimento?.Nome ?? "Desconhecido";
            Ativo = maquina.Ativo;
            PrimeiraAtivacao = maquina.PrimeiraAtivacao;
            UltimaAtualizacao = maquina?.UltimaAtualizacao;
        }

        public int Id { get; set; }
        public string MacAddress { get; set; } = string.Empty;
        public string IP { get; set; } = string.Empty;
        public int StatusDispositivo { get; set; }
        public int StatusUtilizacao { get; set; }
        public decimal ValorUtilizacao { get; set; }
        public string TipoDispositivo { get; set; } = string.Empty;
        public string? AcaoPendente { get; set; }
        public bool Ativo { get; set; }
        public int EstabelecimentoId { get; set; }
        public string? EstabelecimentoNome { get; set; }

        public DateTime? PrimeiraAtivacao { get; set; }
        public DateTime? UltimaAtualizacao { get; set; }
    }
}
