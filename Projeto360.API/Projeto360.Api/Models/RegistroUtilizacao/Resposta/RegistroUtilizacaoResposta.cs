using Projeto360Final.Dominio.Entidades;

namespace Projeto360Final.API.Models.Resposta
{
    public class RegistroUtilizacaoResposta
    {
        public int UsuarioId { get; set; }
        public int MaquinaId { get; set; }
        public DateTime DataHora { get; set; }
        public int Status { get; set; }
        public decimal ValorCobrado { get; set; }
        public string? NomeUsuario { get; set; }
        public string? TipoDispositivo { get; set; }

        public string? AcaoRealizada { get; set; } // ← ADICIONE ISSO

        public RegistroUtilizacaoResposta(RegistroUtilizacao reg)
        {
            UsuarioId = reg.UsuarioId;
            MaquinaId = reg.MaquinaId;
            DataHora = reg.DataHora;
            Status = (int)reg.Status;
            ValorCobrado = reg.ValorCobrado;
            NomeUsuario = reg.Usuario?.Nome;
            TipoDispositivo = reg.Maquina?.TipoDispositivo;
            AcaoRealizada = reg.AcaoRealizada;
        }
    }
}
