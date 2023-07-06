TEMA - KANBANHA (TEMA 3)

Integrantes: Lukian e Yves.

Esclarecimentos: 
- O trabalho é divido em 2 projetos. O KANBANHA, responsável pelo frontend e toda a lógica do projeto;
e o KANBANHA-BACKEND, que é uma API simples em json-server (uma biblioteca do node.js).
- O arquivo KANBANHA precisa rodar com a extensão LIVE-SERVER do vscode por conta do cors que barra API do backend.
- O erro de atualização automática era por conta da pasta KANBANHA-BACKEND estar no vscode junto com KANBANHA (sempre que o banco de dados era atualizado, o live-server recarregava a página).
Logo, para o funcionamento correto do código, é necessário abrir apenas a pasta KANBANHA no vscode.

Instruções: 
- Abra o terminal na pasta do KANBANHA-BACKEND e rode o seguinte comando: 
    json-server --watch db.json
- Abra o arquivo src/componets/home/home.html no vscode com o live-server