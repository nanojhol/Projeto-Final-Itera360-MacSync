using Projeto360Final.Dominio.Entidades;
using System.Text.Json.Serialization;


namespace Projeto360Final.Dominio.Entidades
{
    public class SugestaoIA
    {
        public int Id { get; set; }
        public int MaquinaId { get; set; }
        public int EstabelecimentoId { get; set; }

        public int Disco { get; set; } 
        public int Memoria { get; set; } 

        public string TipoInsight { get; set; } = string.Empty;
        public DateTime DataGeracao { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public Maquina Maquina { get; set; }

        [JsonIgnore]
        public Estabelecimento Estabelecimento { get; set; }
    }
}
