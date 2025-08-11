namespace Projeto360Final.Dominio.Entidades
{
    public class RegistroAcionamento
    {
        public int Id { get; set; }
        public string Acao { get; set; } = string.Empty;
        public DateTime DataHoraEnvio { get; set; }
        public DateTime? DataHoraResposta { get; set; }
        public bool Sucesso { get; set; }
        public string? MensagemErro { get; set; }

        public int MaquinaId { get; set; }
        public Maquina Maquina { get; set; } = null!;
    }
}
