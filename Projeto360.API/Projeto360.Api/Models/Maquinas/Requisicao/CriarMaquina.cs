using Projeto360Final.Dominio.Entidades;
using Projeto360Final.Dominio.Enumeradores;
using Projeto360Final.Repositorio.Interfaces;
using Projeto360Final.API.Models.Requisicao;
using Projeto360Final.API.Models.Resposta;

namespace Projeto360Final.API.Models.Requisicao
{
    public class CriarMaquina
    {
        public string MacAddress { get; set; } = string.Empty;
        public string IP { get; set; } = string.Empty;
        public int StatusDispositivo { get; set; }
        public int StatusUtilizacao { get; set; }
        public decimal ValorUtilizacao { get; set; }
        public string TipoDispositivo { get; set; } = string.Empty;
        public int EstabelecimentoId { get; set; }
    }
}
