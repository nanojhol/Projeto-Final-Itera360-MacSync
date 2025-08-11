using System.ComponentModel.DataAnnotations;

namespace Projeto360Final.API.Models.Requisicao;

public class RecuperacaoSenha
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
}
