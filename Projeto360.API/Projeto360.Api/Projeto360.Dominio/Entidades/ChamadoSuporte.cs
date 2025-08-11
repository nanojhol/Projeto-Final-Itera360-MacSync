using Projeto360Final.Dominio.Entidades;
using System;

namespace Projeto360Final.Dominio.Entidades
{
    public class ChamadoSuporte
    {
        public int Id { get; set; }

        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; } = null!;

        public string Estabelecimento { get; set; } = string.Empty;
        public int EstabelecimentoId { get; set; }
        public Estabelecimento Estabelecimentos { get; set; } = null!;

        public string Tipo { get; set; } = string.Empty;
        public string Mensagem { get; set; } = string.Empty;
        public string Status { get; set; } = "Em aberto";
        public DateTime DataCriacao { get; set; } = DateTime.Now;

        public bool Ativo { get; set; }

        public ChamadoSuporte()
        {
            Ativo = true;
        }

        public ChamadoSuporte(int usuarioId, int estabelecimentoId, string tipo, string mensagem)
        {
            UsuarioId = usuarioId;
            EstabelecimentoId = estabelecimentoId;
            Tipo = tipo;
            Mensagem = mensagem;
            Status = "Em aberto";
            DataCriacao = DateTime.Now;
            Ativo = true;
        }

        public void Deletar()
        {
            Ativo = false;
        }

        public void Restaurar()
        {
            Ativo = true;
            Status = "Em aberto";
        }

        public void Encerrar()
        {
            Ativo = false;
            Status = "Encerrado";
        }
    }
}










// using Projeto360Final.Dominio.Entidades;
// using System;

// // namespace Projeto360Final.Dominio.Entidades
// // {
// //     public class ChamadoSuporte
// //     {
// //         public int UsuarioId { get; set; }
// //         public string Estabelecimento { get; set; } = string.Empty;
// //         public string Tipo { get; set; } = string.Empty;
// //         public string Mensagem { get; set; } = string.Empty;
// //         public string Status { get; set; } = "Aberto";
// //         public DateTime DataCriacao { get; set; }

// //         public ChamadoSuporte(int usuarioId, string estabelecimento, string tipo, string mensagem)
// //         {
// //             UsuarioId = usuarioId;
// //             Estabelecimento = estabelecimento;
// //             Tipo = tipo;
// //             Mensagem = mensagem;
// //             Status = "Aberto";
// //             DataCriacao = DateTime.Now;
// //         }

// //         public void Encerrar()
// //         {
// //             Status = "Encerrado";
// //         }

// //         public void Restaurar()
// //         {
// //             Status = "Aberto";
// //         }

// //         // Opcional: método para alterar mensagem ou tipo, se desejar
// //         public void Atualizar(string tipo, string mensagem)
// //         {
// //             Tipo = tipo;
// //             Mensagem = mensagem;
// //         }
// //     }
// // }






// namespace Projeto360Final.Dominio.Entidades
// {
//     public class ChamadoSuporte
//     {
//         public int Id { get; set; }
//         public int UsuarioId { get; set; }

//         public string Estabelecimento { get; set; } = string.Empty;
//         public string Tipo { get; set; } = string.Empty;
//         public string Mensagem { get; set; } = string.Empty;
//         public string Status { get; set; } = "Em aberto";
//         public DateTime DataCriacao { get; set; } = DateTime.Now;

//         public bool Ativo { get; set; }

//         public Usuario Usuario { get; set; } = null!;


//         public ChamadoSuporte()
//         {
//             Ativo = true;
//         }

//         public ChamadoSuporte(int usuarioId, string estabelecimento, string tipo, string mensagem)
//         {
//             UsuarioId = usuarioId;
//             Estabelecimento = estabelecimento;
//             Tipo = tipo;
//             Mensagem = mensagem;
//             Status = "Em aberto";
//             DataCriacao = DateTime.Now;
//             Ativo = true;
//         }

//         public void Deletar()
//         {
//             Ativo = false;
//         }

//         public void Restaurar()
//         {
//             Ativo = true;
//             Status = "Em aberto";
//         }

//         public void Encerrar()
//         {
//             Ativo = false;
//             Status = "Encerrado";
//         }
//     }
// }
