namespace Projeto360Final.Dominio.Enumeradores
{
    public enum StatusUtilizacao
    {
        Livre = 0,
        Efetivada = 1, // Verde
        NaoEfetivada = 2, // Vermelho
        ErroNaUtilizacao = 3, // Laranja
        SaldoEstornado = 4 // Amarelo
    }
}
