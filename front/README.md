Projeto360Final - Frontend

🚀 Sobre o Projeto
O Projeto360Final é uma plataforma de controle, gerenciamento e automação de máquinas, totalmente integrada com um backend em .NET (C#) e um frontend em React.js. O sistema permite administrar estabelecimentos, usuários, máquinas, registros de uso, chamados de suporte e logs de ações, tudo em uma interface moderna, responsiva e eficiente.

📌 Funcionalidades

👤 Gerenciamento de Usuários
CRUD completo (criar, editar, excluir e visualizar)
Controle de tipos de conta (Master, Coordenador, Comum)
Filtro por tipo de conta, nome e estabelecimento
Controle de saldo por usuário

🏢 Gestão de Estabelecimentos
Cadastro e edição de estabelecimentos com status ativo/inativo
Visualização rápida com mini cards

🛠️ Controle de Máquinas
Cadastro e edição com validações (MAC address, IP, status, etc)
Visualização por status e tipo
Integração com backend para atualização automática de estado

📈 Registros de Utilização
Visualização de registros de uso por máquina e usuário
Detalhes de valor cobrado, data e status

🆘 Chamados de Suporte
Criação, reativação, encerramento e exclusão
Filtros por usuário, por estabelecimento e listagem geral

📋 Logs de Ações
Visualização de logs com data, entidade e responsável pela ação

🔐 Autenticação
Tela de login com passos guiados (email → senha)
Tokens gerenciados e expiração tratada

🎨 Interface Moderna e Responsiva
Componentes reutilizáveis: Sidebar, Topbar, Botões, Modais
Layout adaptável para desktop

❗ Pré-requisitos
Node.js
React.js
Git
Visual Studio Code ou outro editor

⚙️ Como executar o projeto localmente
Clone o repositório:

bash
[git clone https://Projeto-360@dev.azure.com/Projeto-360/Projeto360/_git/Projeto360.APP](https://ProjetoMacSync@dev.azure.com/ProjetoMacSync/Projeto_Final_MacSync/_git/MacSync_APP)
cd Projeto360.APP
Instale as dependências: npm install
axios, bootstrap, react-dom, bootstrap-icons
Inicie a aplicação:

bash
npm start

🔁 Certifique-se de que o backend (Projeto360.API) esteja rodando em paralelo.

🛠️ Estrutura do Projeto
assets/: Imagens e ícones
componentes/: Componentes reutilizáveis (Sidebar, Topbar, Botão, Modal)
paginas/: Telas da aplicação
Usuarios/
Maquinas/
Estabelecimentos/
RegistroUtilizacao/
Chamados/
Logs/
services/: Serviços de comunicação com a API (ex: usuarioAPI.js, maquinaAPI.js)
App.js: Arquivo principal de rotas
index.js: Ponto de entrada

🤝 Como Contribuir
Esse projeto utiliza o Azure DevOps para versionamento, controle de tarefas e automações via pipeline. As contribuições seguem boas práticas de organização e controle de branches.

🔁 Fluxo de Trabalho
Atualize sua branch local a partir da develop:

bash
git checkout develop
git pull origin develop
Crie sua branch de tarefa:

git checkout -b feature/nome-da-tarefa
Implemente, teste localmente e commite:

npm test
Suba sua branch:

git push origin feature/nome-da-tarefa
Abra um Pull Request para develop
Vá ao Azure DevOps
Crie o PR e associe a um Work Item do Azure Boards
Aguarde o code review e merge

✅ Após aprovação
Após o merge na develop, o código será integrado na próxima release estável.

📌 Regras de Boas Práticas
Não fazer push direto para main ou develop
Commits pequenos e claros
Nome de branch com prefixo adequado (feature/, bugfix/, etc)
Sempre associar o PR a um Work Item
Testar antes de subir alterações

