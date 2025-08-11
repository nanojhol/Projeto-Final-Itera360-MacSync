Projeto 360 Final - Backend

🚀 Sobre o Projeto
O Projeto360Final é uma API REST desenvolvida em C# com .NET 6, voltada para o gerenciamento e controle de máquinas automatizadas, usuários, estabelecimentos, registros de utilização, chamados de suporte e logs de ações.
A aplicação visa integrar dispositivos como ESP32, Raspberry Pi e sistemas operacionais em um ecossistema inteligente com monitoramento, acionamento remoto e auditoria completa.

📌 Funcionalidades

👤 Gerenciamento de Usuários
Cadastro, atualização, ativação/inativação e listagem
Controle de tipos de conta (Master, Coordenador, Comum)
Gerenciamento de saldo e permissões

🏭 Gestão de Estabelecimentos
CRUD completo
Vínculo com usuários e máquinas
Filtro por nome e status

🖥️ Controle de Máquinas
Cadastro por MAC Address
Status de utilização e dispositivo (Online, Offline, Erro)
Acionamento remoto e controle de ações pendentes

📈 Registros de Utilização
Registro de cada utilização das máquinas
Valor cobrado, status, data/hora
Filtro por máquina, usuário e período

🛠️ Chamados de Suporte
Abertura de chamados por usuários
Filtros por status, estabelecimento e usuário
Encerramento, reativação e histórico

📝 Logs de Ações
Registro de todas as ações críticas
Informações detalhadas por entidade afetada
Auditoria completa por usuário e data

❗ Pré-requisitos
.NET SDK 6.0 ou superior
Git instalado
SQL Server LocalDB ou SQL Server completo
Editor de código (Visual Studio, VS Code, Rider, etc.)

⚙️ Como executar o projeto localmente
Clone o repositório:

bash
[git clone https://seu-repositorio/Projeto360Final.git](https://ProjetoMacSync@dev.azure.com/ProjetoMacSync/Projeto_Final_MacSync/_git/MacSync_API)
cd Projeto360Final
Restaure as dependências:

dotnet restore
Execute a aplicação:

dotnet run --project Projeto360Final.API
Acesse a API via Swagger:

bash
https://localhost:5001/swagger

🛠️ Estrutura do Projeto
Projeto	Descrição
Projeto360Final.API	Camada de apresentação / endpoints REST
Projeto360Final.Aplicacao	Regras de orquestração da aplicação
Projeto360Final.Dominio	Entidades, enums e interfaces
Projeto360Final.Repositorio	Implementações de repositórios e acesso a dados
Projeto360Final.Servicos	Integrações externas e serviços utilitários

🤝 Como Contribuir
Este projeto segue boas práticas com controle de código, versionamento, divisão por branches e rastreabilidade de mudanças.

🔁 Fluxo de Trabalho Padrão
Sincronize com a branch develop:

bash
git checkout develop
git pull origin develop
Crie uma nova branch para sua tarefa:

git checkout -b feature/nome-da-feature
Desenvolva e teste:

dotnet test
Faça push para o repositório remoto:


git push origin feature/nome-da-feature
Abra um Pull Request para develop

📌 Regras e Boas Práticas
Não faça push direto para main ou develop
Use nomes de branch no padrão feature/*, bugfix/*, etc
Commit semântico e frequente
Relacione PRs com tarefas do Azure Boards (se aplicável)
Sempre revise e teste localmente antes de abrir um PR

