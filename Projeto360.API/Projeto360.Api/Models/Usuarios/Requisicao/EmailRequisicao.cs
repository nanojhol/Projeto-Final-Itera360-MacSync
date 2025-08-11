using System.ComponentModel.DataAnnotations;

namespace Projeto360Final.API.Models.Requisicao
{
    public class EmailRequisicao
    {

        [Required, EmailAddress]
        public string Email { get; set; }
    }
}
