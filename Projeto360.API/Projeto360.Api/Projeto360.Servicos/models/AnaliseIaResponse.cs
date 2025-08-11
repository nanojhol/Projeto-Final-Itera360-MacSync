namespace Projeto360Final.Servicos.Models
{
    public class AnaliseInfraResponse
    {
        public string RecomendacaoGeral { get; set; }
        public bool AumentarMemoria { get; set; }
        public bool AumentarDisco { get; set; }
        public bool AdicionarMaisAparelhos { get; set; }

        public List<string> Justificativas { get; set; } = new();
        public int NivelPrioridade { get; set; } // 1 a 10
    }
}
