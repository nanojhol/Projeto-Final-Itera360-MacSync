public interface IGptServico
{
    Task<string> PerguntarAsync(string pergunta);
}
