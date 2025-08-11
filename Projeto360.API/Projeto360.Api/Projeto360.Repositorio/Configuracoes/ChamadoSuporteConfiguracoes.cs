using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projeto360Final.Dominio.Entidades;

namespace Projeto360Final.Repositorio.Configuracoes
{
    public class ChamadoSuporteConfiguracoes : IEntityTypeConfiguration<ChamadoSuporte>
    {
        public void Configure(EntityTypeBuilder<ChamadoSuporte> builder)
        {
            builder.ToTable("ChamadosSuporte");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.UsuarioId)
                .IsRequired();

            builder.Property(c => c.Estabelecimento)
                .IsRequired();

            builder.Property(c => c.EstabelecimentoId)
                .IsRequired();

            builder.Property(c => c.Tipo)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(c => c.Mensagem)
                .IsRequired()
                .HasMaxLength(1000);

            builder.Property(c => c.Status)
                .IsRequired()
                .HasMaxLength(50)
                .HasDefaultValue("Em aberto");

            builder.Property(c => c.DataCriacao)
                .IsRequired();

            // Relacionamento com Usuario
            builder.HasOne(c => c.Usuario)
                .WithMany(u => u.Chamados)
                .HasForeignKey(c => c.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            // builder
            //     .HasOne(c => c.Estabelecimentos)
            //     .WithMany(e => e.Chamados)
            //     .HasForeignKey(c => c.EstabelecimentoId)
            //     .OnDelete(DeleteBehavior.Restrict)
            //     .IsRequired(false);


        }
    }
}
