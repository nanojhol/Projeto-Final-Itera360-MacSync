using System;
using System.ComponentModel.DataAnnotations;
using Projeto360Final.Dominio.Enumeradores;
using Projeto360Final.Dominio.Entidades;

namespace Projeto360Final.Dominio.Entidades
{
    public class Maquina
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string MacAddress { get; set; } = string.Empty;

        [Required]
        public string IP { get; set; } = string.Empty;

        [Required]
        public StatusDispositivo StatusDispositivo { get; set; }

        [Required]
        public StatusUtilizacao StatusUtilizacao { get; set; }

        [Required]
        public decimal ValorUtilizacao { get; set; }

        [Required]
        public DateTime PrimeiraAtivacao { get; set; }

        [Required]
        public DateTime UltimaAtualizacao { get; set; }

        public bool Ativo { get; set; } = true;

        [Required]
        [StringLength(50)]
        public string TipoDispositivo { get; set; } = string.Empty;

        public string AcaoPendente { get; set; } = string.Empty;
        public DateTime DataHoraEnvioComando { get; set; }
        public bool AguardandoResposta { get; set; }
        [Required]
        public int EstabelecimentoId { get; set; }

        public Estabelecimento Estabelecimento { get; set; } = null!;

        public List<RegistroUtilizacao> Utilizacoes { get; set; } = new();

        public List<RegistroAcionamento> Acionamentos { get; set; } = new();

        public double Disco { get; set; } // ou int, se preferir
        public double Memoria { get; set; }


        public Maquina() { }

        public Maquina(
            string macAddress,
            string ip,
            StatusDispositivo statusDispositivo,
            StatusUtilizacao statusUtilizacao,
            decimal valorUtilizacao,
            DateTime primeiraAtivacao,
            DateTime ultimaAtualizacao,
            string tipoDispositivo,
            int estabelecimentoId)
        {
            MacAddress = macAddress;
            IP = ip;
            StatusDispositivo = statusDispositivo;
            StatusUtilizacao = statusUtilizacao;
            ValorUtilizacao = valorUtilizacao;
            PrimeiraAtivacao = primeiraAtivacao;
            UltimaAtualizacao = ultimaAtualizacao;
            TipoDispositivo = tipoDispositivo;
            EstabelecimentoId = estabelecimentoId;
        }

        public void AtualizarMaquina(
            string ip,
            StatusDispositivo statusDispositivo,
            StatusUtilizacao statusUtilizacao,
            DateTime ultimaAtualizacao,
            string acaoPendente)
        {
            IP = ip;
            StatusDispositivo = statusDispositivo;
            StatusUtilizacao = statusUtilizacao;
            UltimaAtualizacao = ultimaAtualizacao;
            AcaoPendente = acaoPendente;
        }

        public void AtualizarCamposEditaveis(
        string? ip,
        StatusDispositivo? statusDispositivo,
        StatusUtilizacao? statusUtilizacao,
        decimal? valorUtilizacao,
        string? tipoDispositivo,
        string? acaoPendente,
        int? estabelecimentoId,
        bool? ativo)
        {
            IP = ip ?? IP;
            StatusDispositivo = statusDispositivo ?? StatusDispositivo;
            StatusUtilizacao = statusUtilizacao ?? StatusUtilizacao;
            ValorUtilizacao = valorUtilizacao ?? ValorUtilizacao;
            TipoDispositivo = tipoDispositivo ?? TipoDispositivo;
            AcaoPendente = acaoPendente ?? AcaoPendente;
            EstabelecimentoId = estabelecimentoId ?? EstabelecimentoId;
            Ativo = ativo ?? Ativo;
            UltimaAtualizacao = DateTime.Now;
        }


        public void Desativar()
        {
            Ativo = false;
        }

        public void Reativar()
        {
            Ativo = true;
        }

        public void Validar()
        {
            if (string.IsNullOrWhiteSpace(MacAddress))
                throw new ArgumentException("O MAC Address é obrigatório.");

            if (ValorUtilizacao < 0)
                throw new ArgumentException("O valor de utilização não pode ser negativo.");

            if (UltimaAtualizacao < PrimeiraAtivacao)
                throw new ArgumentException("A última atualização não pode ser anterior à primeira ativação.");
        }
        public void AtualizarDadosGerais(
            decimal valorUtilizacao,
            string tipoDispositivo,
            int estabelecimentoId)
        {
            ValorUtilizacao = valorUtilizacao;
            TipoDispositivo = tipoDispositivo;
            EstabelecimentoId = estabelecimentoId;
        }

        public void MarcarAcionamentosPendentesComoErro()
        {
            foreach (var a in Acionamentos.Where(x => !x.Sucesso && x.DataHoraResposta == null))
            {
                a.DataHoraResposta = DateTime.UtcNow;
                a.Sucesso = false;
                a.MensagemErro = "Timeout - substituído por novo acionamento";
            }
        }

        public void RegistrarNovoAcionamento(string acao)
        {
            var novo = new RegistroAcionamento
            {
                Acao = acao,
                DataHoraEnvio = DateTime.UtcNow,
                Sucesso = false
            };

            Acionamentos.Add(novo);
            AcaoPendente = acao;
            DataHoraEnvioComando = novo.DataHoraEnvio;
            AguardandoResposta = true;
        }

    }
}
