namespace Projeto360Final.API.Models.Resposta;

public class LoginResposta
{
    public string Token { get; set; }
    public int UsuarioId { get; set; }
    public string Nome { get; set; }
    public string Email { get; set; }
    public string TipoUsuario { get; set; }
    public DateTime? UltimoLogin { get; set; }
    public int? EstabelecimentoId { get; set; }
}

