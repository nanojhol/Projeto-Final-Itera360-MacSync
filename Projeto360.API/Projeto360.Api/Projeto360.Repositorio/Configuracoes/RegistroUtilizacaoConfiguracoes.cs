using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projeto360Final.Dominio.Entidades;

namespace Projeto360Final.Repositorio.Configuracoes
{
    public class RegistroUtilizacaoConfiguracoes : IEntityTypeConfiguration<RegistroUtilizacao>
    {
        public void Configure(EntityTypeBuilder<RegistroUtilizacao> builder)
        {
            builder.ToTable("RegistrosUtilizacao");

            builder.HasKey(r => r.Id);

            builder.Property(r => r.UsuarioId)
                .IsRequired();

            builder.Property(r => r.MaquinaId)
                .IsRequired();

            builder.Property(r => r.DataHora)
                .IsRequired();

            builder.Property(r => r.Status)
                .IsRequired();

            builder.Property(r => r.ValorCobrado)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(r => r.AcaoRealizada)
                .HasMaxLength(100) 
                .IsRequired();

            // Relacionamento com Usuario
            builder.HasOne(r => r.Usuario)
                .WithMany(u => u.Utilizacoes)
                .HasForeignKey(r => r.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relacionamento com Maquina
            builder.HasOne(r => r.Maquina)
                .WithMany(m => m.Utilizacoes)
                .HasForeignKey(r => r.MaquinaId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
