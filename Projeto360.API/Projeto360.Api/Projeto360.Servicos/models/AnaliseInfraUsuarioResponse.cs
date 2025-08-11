namespace Projeto360Final.Servicos.Models;

public class AnaliseInfraUsuarioResponse
{
    public string MensagemPrincipal { get; set; }
    public bool SugerirPlanoMaior { get; set; }
    public bool SugerirNovaPromocao { get; set; }
    public List<string> DicasPersonalizadas { get; set; }
    public string NivelDeUso { get; set; }  // Ex: Leve, Moderado, Intenso
}
