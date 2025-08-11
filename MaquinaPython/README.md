Simulando Dispositivos IOT com Python para o Projeto (MaqSync)

Desenvolvolvendo o simulador de dispositivo em Python 
(que representa o Raspberry Pi, Arduino ou ESP32), responsável por se comunicar com a API MaqSync. O script deve ser capaz de:

- Se registrar ao iniciar.
- Cria o estabelecimento ADM automaticamente caso não exista para cadatro do novo sistema.
- Enviar status periodicamente ("Online").
- Receber comandos do servidor.
- Executar ações simuladas (como ligar/desligar LED).
- Enviar confirmações de retorno da execução da ação.

❗ Pré-requisitos
Python3
Git
Visual Studio Code ou outro editor

⚙️ Como executar o projeto localmente
Clone o repositório:

bash
https://ProjetoMacSync@dev.azure.com/ProjetoMacSync/Projeto_Final_MacSync/_git/MacSync_IOT
cd MaquinasPython
Instale as dependências: 
pip install python3
pip install request

Inicie a aplicação:

bash
python Dispositivo1.py ...

🔁 Certifique-se de que o backend (Projeto360.API) esteja rodando em paralelo.

🛠️ Estrutura do Projeto
MaquinasPython/
Dispositivos conectados ......

Dispositivo1/: Serviços de comunicação com os EndPoints (ex: MaquinaControllers.js, EstabelecimentoControllers.js) Arquivo principal de rotas
index.js: Ponto central de entrada para exibição

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

