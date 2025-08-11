namespace Projeto360Final.API.Models.Resposta
{
    public class GptAnaliseResposta
    {
        public int MaquinaId { get; set; }
        public int EstabelecimentoId { get; set; }
        public int Disco { get; set; }
        public int Memoria { get; set; }
        public string Insight { get; set; }
        public DateTime DataGeracao { get; set; }
    }
}
