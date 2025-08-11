using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projeto360Final.Dominio.Entidades;

namespace Projeto360Final.Repositorio.Configuracoes
{
    public class RegistroAcionamentoConfiguracoes : IEntityTypeConfiguration<RegistroAcionamento>
    {
        public void Configure(EntityTypeBuilder<RegistroAcionamento> builder)
        {
            builder.ToTable("RegistrosAcionamento");

            builder.HasKey(r => r.Id);

            builder.Property(r => r.Acao)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(r => r.DataHoraEnvio)
                .IsRequired();

            builder.Property(r => r.Sucesso)
                .IsRequired();

            builder.Property(r => r.MensagemErro)
                .HasMaxLength(500);

            builder.HasOne(r => r.Maquina)
                .WithMany(m => m.Acionamentos)
                .HasForeignKey(r => r.MaquinaId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
