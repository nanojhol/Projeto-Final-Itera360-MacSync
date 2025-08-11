using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Projeto360Final.Dominio.Entidades;

namespace Projeto360Final.Repositorio.Contexto
{
    public class Projeto360FinalContexto : DbContext
    {
        private readonly DbContextOptions _options;

        public Projeto360FinalContexto() { }

        public Projeto360FinalContexto(DbContextOptions options) : base(options)
        {
            _options = options;
        }


        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Estabelecimento> Estabelecimentos { get; set; }
        public DbSet<Maquina> Maquinas { get; set; }
        public DbSet<ChamadoSuporte> ChamadosSuporte { get; set; }
        public DbSet<RegistroUtilizacao> RegistrosUtilizacao { get; set; }
        public DbSet<LogDeAcao> LogsDeAcao { get; set; }
        public DbSet<RegistroAcionamento> RegistrosAcionamento { get; set; }
        // AI generativa:
        public DbSet<SugestaoIA> SugestoesIA { get; set; }




        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var connectionString = "Server=WASHEGO\\SQLEXPRESS;Database=Projeto360FinalMaqSync;Trusted_Connection=True;TrustServerCertificate=True;Encrypt=False;";
                optionsBuilder.UseSqlServer(connectionString)
                .ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning)); // retirar campo quando finalizar os testes.
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(Projeto360FinalContexto).Assembly);
        }
    }
}
