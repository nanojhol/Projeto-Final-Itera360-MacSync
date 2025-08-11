namespace Projeto360Final.API.Models.Requisicao
{
    public class StatusMaquinaRequisicao
    {
        public string MacAddress { get; set; } = string.Empty;
        public string IP { get; set; } = string.Empty;
        public int Status { get; set; }
    }
}
