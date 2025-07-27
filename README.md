# Projeto-Final-Itera360

Nome do Projeto:
  # MaqSync
  
# Descrição do Projeto: 
  O MaqSync é um sistema de gerenciamento e utilização de dispositivos automatizados (como ESP32, Raspberry Pi, Arduino e similares). 
  Com foco em escalabilidade e controle, ele oferece um ambiente completo de gestão de usuários, operações em máquinas, controle financeiro e suporte técnico.

# Problema que Resolve: 
  Centraliza o controle simples no uso de máquinas automatizadas, evitando perda de informações, falhas de segurança e dificuldades de suporte.
Público-Alvo Empresas e desenvolvedores que desejam automatizar máquinas em ambientes controlados com diferentes níveis de acesso.
Objetivo Geral Desenvolver uma solução multiplataforma (frontend + backend + dispositivos) para controle completo de máquinas automatizadas, com acesso segmentado por tipo de conta.
Motivação para a Escolha Falta de ferramentas acessíveis e completas que integrem gerenciamento de máquinas, instruções por usuário, suporte e relatórios de forma customizável.
Tecnologias Utilizadas Linguagens de Programação: C#, Python, JavaScript Frameworks e Bibliotecas: ASP.NET Core, 
Entity Framework Core React (JS) Banco de Dados: SQL Server Ferramentas de Desenvolvimento: Swagger (API Docs) VSCode, Visual Studio Git/GitHub

Requisitos do Sistema Requisitos Funcionais Cadastro/login de usuários (Master, Coordenador, Comum) Registros e logs de ações, inclusive login Controle de máquinas por status 
(livre, em uso, offline, etc.) Integração com dispositivos via HTTP Relatórios por tipo de usuário Módulo de suporte Painel financeiro individualizado
Histórias de Usuário Como usuário comum, quero consultar meu histórico de utilizações para entender meu consumo. Como coordenador, 
quero acompanhar o funcionamento das máquinas do meu estabelecimento. Como usuário master, quero ter acesso total a registros, edições e relatórios. 
Como usuário comum, quero abrir chamadas de suporte quando tiver problemas.
Plano de Desenvolvimento Criação das camadas do backend (Domínio, Aplicação, Repositório) Modelagem do banco e entidades Construção da API REST 
com autenticação JWT Integração e simulação de dispositivos Criação do frontend responsivo Implementação do módulo de suporte Implementação do módulo financeiro Testes e validações Ajustes finais e documentação
Conclusão e Próximos Passos Melhorias Futuras Integração com gateways de pagamento Geração de tokens temporários para uso seguro das máquinas 
Notificações em tempo real (por e-mail, push ou app) Criação de dashboard estatístico com gráficos sonoros Suporte à IoT em escala industrial
