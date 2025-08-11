namespace Projeto360Final.Servicos.Models
{
    public class AnaliseInfraRequest
    {
        public int MaquinaId { get; set; }
        public string NomeMaquina { get; set; }
        public string TipoDispositivo { get; set; }

        public double DiscoAtualGB { get; set; }
        public double MemoriaAtualGB { get; set; }

        public List<string> HistoricoDeUso { get; set; } = new();
        public List<string> FeedbacksUsuarios { get; set; } = new();
    }
}
