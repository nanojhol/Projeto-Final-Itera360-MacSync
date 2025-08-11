namespace Projeto360Final.API.Models.Requisicao
{
    public class AtualizarMaquina
    {
        public string? IP { get; set; }
        public int? StatusDispositivo { get; set; }
        public int? StatusUtilizacao { get; set; }
        public decimal? ValorUtilizacao { get; set; }
        public string? TipoDispositivo { get; set; }
        public string? AcaoPendente { get; set; }
        public bool? Ativo { get; set; }
        public int? EstabelecimentoId { get; set; }
    }
}
