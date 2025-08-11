using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projeto360Final.Dominio.Entidades;

namespace Projeto360Final.Repositorio.Configuracoes
{
    public class LogDeAcaoConfiguracoes : IEntityTypeConfiguration<LogDeAcao>
    {
        public void Configure(EntityTypeBuilder<LogDeAcao> builder)
        {
            builder.ToTable("LogsDeAcao");

            builder.HasKey(l => l.Id);

            builder.Property(l => l.UsuarioId)
                .IsRequired();

            builder.Property(l => l.Acao)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(l => l.EntidadeAfetada)
                .HasMaxLength(100);

            builder.Property(l => l.EntidadeIdAfetada);

            builder.Property(l => l.DescricaoDetalhada)
                .HasMaxLength(1000);

            builder.Property(l => l.DataHora)
                .IsRequired();

            // Relacionamento com Usuario
            builder.HasOne(l => l.Usuario)
                .WithMany(u => u.Logs)
                .HasForeignKey(l => l.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
