using System;
using System.ComponentModel.DataAnnotations;
using Projeto360Final.Dominio.Enumeradores;

namespace Projeto360Final.Dominio.Entidades
{
    public class RegistroUtilizacao
    {
        public int Id { get; private set; }

        [Required]
        public int UsuarioId { get; private set; }

        [Required]
        public int MaquinaId { get; private set; }

        [Required]
        public DateTime DataHora { get; private set; }

        [Required]
        public StatusUtilizacao Status { get; private set; }

        [Required]
        public decimal ValorCobrado { get; private set; }

        public Usuario Usuario { get; private set; } = null!;
        public Maquina Maquina { get; private set; } = null!;

        public string AcaoRealizada { get; private set; }


        public RegistroUtilizacao(int usuarioId, int maquinaId, DateTime dataHora, StatusUtilizacao status, decimal valorCobrado, string acaoRealizada)
        {
            UsuarioId = usuarioId;
            MaquinaId = maquinaId;
            DataHora = dataHora;
            Status = status;
            ValorCobrado = valorCobrado;
            AcaoRealizada = acaoRealizada;
        }

        public void AtualizarRegistro( DateTime dataHora, StatusUtilizacao status, decimal valorCobrado)
        {
            DataHora = dataHora;
            Status = status;
            ValorCobrado = valorCobrado;
        }

        public void Validar()
        {
            if (ValorCobrado < 0)
                throw new ArgumentException("O valor cobrado não pode ser negativo.");

            if (DataHora > DateTime.Now)
                throw new ArgumentException("A data/hora não pode ser no futuro.");
        }
        public void AtualizarStatus(StatusUtilizacao novoStatus) => Status = novoStatus;
        public void AtualizarValor(decimal novoValor) => ValorCobrado = novoValor;


    }
}
