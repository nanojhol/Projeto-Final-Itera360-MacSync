using Projeto360Final.Repositorio.Contexto;

public abstract class BaseRepositorio
{
    protected readonly Projeto360FinalContexto _contexto;

    public BaseRepositorio(Projeto360FinalContexto contexto)
    {
        _contexto = contexto;
    }
}