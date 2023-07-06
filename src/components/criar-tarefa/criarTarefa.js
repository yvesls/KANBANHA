$(document).ready(function () {
    var listaMembros;
    function listarMembros() {
        listaMembros = [];
        $("#tbody-membros").html("");
        $(".carregando").show();
        $("#profissional-criar-tarefa").html("");
        new Promise((resolve, reject) => {
            fetch(`http://localhost:3000/membroProjeto`)
            .then(response => {
                if (response.ok) {    
                    return response.json();
                } else {
                    $(".carregando").hide();
                    exibirJanelaErro("Erro na resposta da requisição. Servidor possivelmente não está ativo.");
                    throw new Error('Erro na resposta da requisição!');
                }
            })
            .then(data => {
                listaMembros = data;
                listaMembros.forEach((membro)=> {
                    $("#profissional-criar-tarefa").append(`<option value="${membro.nome}">${membro.nome}</option>`);
                })
                $(".carregando").hide();
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
        })
    }
    listarMembros();

    function criarTarefa() {
        let criadoPorC = $("#profissional-criar-tarefa").val();
        let descricaoC = $("#descricao-criar-tarefa").val();
        let previsaoConclusaoC = $("#data-previsao-criar-tarefa").val() + " " + $("#tempo-previsao-criar-tarefa").val();
        let tarefa = {
            descricao: descricaoC,
            dataCriacao: obterDataAtual(),
            criadoPor: criadoPorC,
            atribuidoA: undefined,
            dataAtribuicao: undefined,
            previsaoConclusao: previsaoConclusaoC,
            status: "ATIVA",
            dataConclusao: undefined
          }

        if(criadoPorC != "" && descricaoC != "" && $("#data-previsao-criar-tarefa").val() != "" && $("#tempo-previsao-criar-tarefa").val() != "") {
            new Promise((resolve, reject) => {
                fetch(`http://localhost:3000/tarefa`, {
                    method: 'POST',
                    body: JSON.stringify(tarefa),
                    headers: {
                    'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {    
                        return response.json();
                    } else {
                        $(".carregando").hide();
                        exibirJanelaErro("Erro na resposta da requisição. Servidor possivelmente não está ativo.");
                        throw new Error('Erro na resposta da requisição!');
                    }
                })
                .then(data => {
                    exibirJanelaSucesso("Adicionado com sucesso!");
                    listarMembros();
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });  
            });
        }
    }

    $("#btn-adicionar-criar-tarefa").click( () => {
        criarTarefa();
    });

    function exibirJanelaSucesso(mensagem){
        $(".janela-container-confirmacao > span").html(mensagem);
        $(".janela-container-confirmacao").fadeIn();
        setTimeout(() => {
            $(".janela-container-confirmacao").fadeOut();
        }, 2000);
    }

    function exibirJanelaErro(mensagem){
        $(".janela-container-erro > span").html(mensagem);
        $(".janela-container-erro").fadeIn();
        setTimeout(() => {
            $(".janela-container-erro").fadeOut();
        }, 2000);
    }

    function obterDataAtual() {
        const data = new Date();
      
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
      
        return `${ano}-${mes}-${dia} ${horas}:${minutos}`;
    }
});
