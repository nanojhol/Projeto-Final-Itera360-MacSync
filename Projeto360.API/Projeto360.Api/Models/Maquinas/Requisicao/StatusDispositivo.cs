namespace Projeto360Final.API.Models.Requisicao
{
    public class StatusDispositivoRequest
    {
        public string MacAddress { get; set; } = string.Empty;
        public string IP { get; set; } = string.Empty;
        public int Status { get; set; } // 0 = Offline, 1 = Online, 2 = Erro
    }
}
