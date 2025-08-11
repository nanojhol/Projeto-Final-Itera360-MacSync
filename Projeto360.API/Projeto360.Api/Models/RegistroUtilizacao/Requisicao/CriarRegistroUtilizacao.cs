namespace Projeto360Final.API.Models.Requisicao
{
    public class CriarRegistroUtilizacao
    {
        public int UsuarioId { get; set; }
        public int MaquinaId { get; set; }
        public int Status { get; set; }
        public decimal ValorCobrado { get; set; }
        public string AcaoRealizada { get; set; } = string.Empty; 
    }
}
