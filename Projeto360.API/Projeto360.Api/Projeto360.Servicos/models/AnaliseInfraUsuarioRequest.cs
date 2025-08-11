namespace Projeto360Final.Servicos.Models;

public class AnaliseInfraUsuarioRequest
{
    public string NomeUsuario { get; set; }
    public int TotalUsos { get; set; }
    public double DiscoMedio { get; set; }
    public double MemoriaMedia { get; set; }
    public List<string> HistoricoDeUso { get; set; }
}
