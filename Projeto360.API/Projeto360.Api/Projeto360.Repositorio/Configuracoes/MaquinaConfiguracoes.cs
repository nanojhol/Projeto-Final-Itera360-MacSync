using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projeto360Final.Dominio.Entidades;

namespace Projeto360Final.Repositorio.Configuracoes
{
    public class MaquinaConfiguracoes : IEntityTypeConfiguration<Maquina>
    {
        public void Configure(EntityTypeBuilder<Maquina> builder)
        {
            builder.ToTable("Maquinas");

            builder.HasKey(m => m.Id);

            builder.Property(m => m.MacAddress)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(m => m.IP)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(m => m.TipoDispositivo)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(m => m.StatusDispositivo)
                .IsRequired();

            builder.Property(m => m.StatusUtilizacao)
                .IsRequired();

            builder.Property(m => m.ValorUtilizacao)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.Property(m => m.PrimeiraAtivacao)
                .IsRequired();

            builder.Property(m => m.UltimaAtualizacao)
                .IsRequired();

            builder.Property(m => m.AcaoPendente)
                .HasMaxLength(200);

            builder.Property(m => m.Ativo)
                .IsRequired();

            builder.Property(m => m.Disco)
                .HasMaxLength(25);;

            builder.Property(m => m.Memoria)
                .HasMaxLength(25);;

            // Relacionamento com Estabelecimento
            builder.HasOne(m => m.Estabelecimento)
                .WithMany(e => e.Maquinas)
                .HasForeignKey(m => m.EstabelecimentoId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relacionamento com Registros de Utilização
            builder.HasMany(m => m.Utilizacoes)
                .WithOne(r => r.Maquina)
                .HasForeignKey(r => r.MaquinaId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relacionamento com Registros de Acionamento
            builder.HasMany(m => m.Acionamentos)
                .WithOne(a => a.Maquina)
                .HasForeignKey(a => a.MaquinaId)
                .OnDelete(DeleteBehavior.Cascade); // ou Restrict, dependendo da regra de negócio



        }


    }
}
