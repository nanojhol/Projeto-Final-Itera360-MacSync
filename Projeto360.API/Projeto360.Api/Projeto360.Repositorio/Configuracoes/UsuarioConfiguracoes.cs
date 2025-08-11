using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projeto360Final.Dominio.Entidades;

namespace Projeto360Final.Repositorio.Configuracoes
{
    public class UsuarioConfiguracoes : IEntityTypeConfiguration<Usuario>
    {
        public void Configure(EntityTypeBuilder<Usuario> builder)
        {
            builder.ToTable("Usuarios");

            builder.HasKey(u => u.Id);

            builder.Property(u => u.Nome)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(u => u.Senha)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(u => u.TipoConta)
                .IsRequired();

            builder.Property(u => u.Ativo)
                .IsRequired();

            builder.Property(u => u.Saldo)
                .HasColumnType("decimal(18,2)")
                .HasDefaultValue(0);

            builder.Property(u => u.DataCriacao)
                .IsRequired();

            builder.Property(u => u.TokenRecuperacaoSenha)
                .HasMaxLength(200);

            builder.Property(u => u.TokenExpiracao);
            
            builder.Property(u => u.TokenRecuperacao);

            builder.Property(u => u.UltimoLogin);

            // Relacionamento com Estabelecimento
            builder.HasOne(u => u.Estabelecimento)
                .WithMany(e => e.Coordenadores)
                .HasForeignKey(u => u.EstabelecimentoId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relacionamentos com outras entidades
            builder.HasMany(u => u.Utilizacoes)
                .WithOne(r => r.Usuario)
                .HasForeignKey(r => r.UsuarioId);

            builder.HasMany(u => u.Chamados)
                .WithOne(c => c.Usuario)
                .HasForeignKey(c => c.UsuarioId);

            builder.HasMany(u => u.Logs)
                .WithOne(l => l.Usuario)
                .HasForeignKey(l => l.UsuarioId);
        }
    }
}
