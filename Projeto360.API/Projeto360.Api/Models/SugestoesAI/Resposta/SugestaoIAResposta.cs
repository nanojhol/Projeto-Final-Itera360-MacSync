namespace Projeto360Final.API.Models.Resposta
{
    public class SugestaoIAResposta
    {
        public int Id { get; set; } // ← Adiciona essa linha
        public int MaquinaId { get; set; }
        public int EstabelecimentoId { get; set; }
        public int Disco { get; set; }
        public int Memoria { get; set; }
        public string TipoInsight { get; set; }
        public DateTime DataGeracao { get; set; }
    }

}
