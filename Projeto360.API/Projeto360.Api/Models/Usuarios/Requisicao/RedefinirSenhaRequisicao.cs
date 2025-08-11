using System.ComponentModel.DataAnnotations;

namespace Projeto360Final.API.Models.Requisicao;

public class ResetarSenha
{
    [Required]
    public string Token { get; set; } = string.Empty;

    [Required, MinLength(6, ErrorMessage = "A nova senha deve ter pelo menos 6 caracteres.")]
    public string NovaSenha { get; set; } = string.Empty;

    [Compare(nameof(NovaSenha), ErrorMessage = "A confirmação de senha não confere.")]
    public string ConfirmacaoSenha { get; set; } = string.Empty;

    // Para segurança extra, inclui o e-mail também:
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
}
