using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projeto360Final.Dominio.Entidades;

namespace Projeto360Final.Repositorio.Configuracoes
{
    public class SugestaoAIConfiguracoes : IEntityTypeConfiguration<SugestaoIA>
    {
        public void Configure(EntityTypeBuilder<SugestaoIA> builder)
        {
            builder.ToTable("SugestoesIA");

            builder.HasKey(s => s.Id);

            builder.Property(s => s.Disco)
                   .IsRequired();

            builder.Property(s => s.Memoria)
                   .IsRequired();

            builder.Property(s => s.TipoInsight)
                   .IsRequired();
              //      .HasMaxLength(200);

            builder.Property(s => s.DataGeracao)
                   .IsRequired();

            // Relacionamento com Maquina
            builder.HasOne(s => s.Maquina)
                   .WithMany() // ou .WithMany(m => m.SugestoesIA) se você quiser o inverso
                   .HasForeignKey(s => s.MaquinaId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Relacionamento com Estabelecimento
            builder.HasOne(s => s.Estabelecimento)
                   .WithMany()
                   .HasForeignKey(s => s.EstabelecimentoId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
