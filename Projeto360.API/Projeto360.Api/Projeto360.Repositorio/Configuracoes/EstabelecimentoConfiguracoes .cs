using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projeto360Final.Dominio.Entidades;

namespace Projeto360Final.Repositorio.Configuracoes
{
    public class EstabelecimentoConfiguracoes : IEntityTypeConfiguration<Estabelecimento>
    {
        public void Configure(EntityTypeBuilder<Estabelecimento> builder)
        {
            builder.ToTable("Estabelecimentos");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Nome)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(e => e.Ativo)
                .IsRequired();

            builder.Property(e => e.Endereco)
                .HasMaxLength(50);

            builder.Property(e => e.Telefone)
                .HasMaxLength(15);


            // Relacionamento com Maquinas
            builder.HasMany(e => e.Maquinas)
                .WithOne(m => m.Estabelecimento)
                .HasForeignKey(m => m.EstabelecimentoId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relacionamento com Coordenadores (Usuarios)
            builder.HasMany(e => e.Coordenadores)
                .WithOne(u => u.Estabelecimento)
                .HasForeignKey(u => u.EstabelecimentoId)
                .OnDelete(DeleteBehavior.Restrict);
                
        }
    }
}
