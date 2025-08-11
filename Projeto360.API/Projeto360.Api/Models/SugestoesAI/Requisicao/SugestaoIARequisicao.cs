namespace Projeto360Final.API.Models.Requisicao
{
    public class SugestaoIARequisicao
    {
        public int MaquinaId { get; set; }
        public int EstabelecimentoId { get; set; }
        public int Disco { get; set; }
        public int Memoria { get; set; }
        public string TipoInsight { get; set; }
        public DateTime DataGeracao { get; set; }
    }
}
