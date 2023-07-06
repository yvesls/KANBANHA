$(document).ready(function () {
    var listaMembros;
    function listarMembros() {
        listaMembros = [];
        $("#tbody-membros").html("");
        $(".carregando").show();
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
                if(data.length == 0) {
                    $("#tbody-membros").append(`<tr><td colspan="5"><b>Não há membros registrados.</b></td></tr>`);
                }else {
                    data.forEach(function(membros) {
                        $("#tbody-membros").append(`
                        <tr>
                            <td>${membros.nome}</td>
                            <td>${converterParaFormatoBrasileiro(membros.dataNascimento)}</td>
                            <td>${membros.cpf}</td>
                            <td>${membros.cargo}</td>
                            <td>
                                <div class="td-membros"><button class="btn-editar" id="btn-editar-ativas${membros.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                            </td>
                        </tr>
                        `);
                    });
                }
                listaMembros = data;
                carregarConfComponente( );
                $(".carregando").hide();
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
        })
    }
    listarMembros();

    function carregarConfComponente() {
        listaMembros.forEach(function(membros) {
            $(`#btn-editar-ativas${membros.id}`).click(function () {
                abrirEditarMembro(membros);
            });
        });
    }
    
    $("#salvar-membros").click(function () {
        salvarMembros();
    });

    function salvarMembros() {
        if($("#nome-membro").val() != "" && $("#data-nascimento").val() != "" && $("#cpf").val() != "" && $("#cargo").val() != "") {
            let nomeC = $("#nome-membro").val();
            let dataNascimentoC = $("#data-nascimento").val();
            let cpfC = $("#cpf").val();
            let cargoC = $("#cargo").val();
            let membro = {
                nome: nomeC,
                dataNascimento : dataNascimentoC, 
                cpf: cpfC,
                cargo : cargoC
            }
            new Promise((resolve, reject) => {
                fetch(`http://localhost:3000/membroProjeto`, {
                    method: 'POST',
                    body: JSON.stringify(membro),
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
        }else {
            exibirJanelaErro("Há campos vazios!");
        }
    }

    function salvarEditarMembro() {
        let nomeC = $("#nome-membro-editar").val();
        let cargoC = $("#cargo-editar").val();
        $(".carregando").show();
        if(nomeC != "" && cargoC != "") {
            let id = $("#id-editar").val();
            let membro = listaMembros.find(membro => membro.id == id);
            membro.nome = nomeC;
            membro.cargo = cargoC;
            let salvar = () => { 
                return new Promise((resolve, reject) => {
                fetch(`http://localhost:3000/membroProjeto/${parseInt(membro.id)}`, {
                    method: 'PUT',
                    body: JSON.stringify(membro),
                    headers: {
                    'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {    
                        resolve();
                        exibirJanelaSucesso("Editado com sucesso!");
                        $(".carregando").hide();
                        fecharEditarMembro();
                        return response.json();
                    } else {
                        $(".carregando").hide();
                        exibirJanelaErro("Erro na resposta da requisição. Servidor possivelmente não está ativo.");
                        throw new Error('Erro na resposta da requisição!');
                    }
                })
                .catch(error => {
                    reject(error);
                });  
            })}   
            salvar();
            listarMembros();
        }
    }

    function removerMembro() {
        let id = $("#id-editar").val();
        $(".carregando").show();
        let remover = () => { 
            return new Promise((resolve, reject) => {
            fetch(`http://localhost:3000/membroProjeto/${parseInt(id)}`, {
                method: 'DELETE'
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
                resolve(data);
                exibirJanelaSucesso("Removido com sucesso!");
                $(".carregando").hide();
                fecharEditarMembro();
            })
            .catch(error => {
                reject(error);
            });  
        })}   
        remover();
        listarMembros();
    }

    function abrirEditarMembro(membro) {
        $("#editar-membro").fadeIn();
        $("#editar-membro-container").fadeIn();
        $("#id-editar").val(membro.id);
        $("#nome-membro-editar").val(membro.nome);
        $("#cargo-editar").val(membro.cargo);
    }

    $("#salvar-editar-membro").click( () => {
        salvarEditarMembro();
    });

    $("#remover-membro").click(function () {
        removerMembro();
    });

    $("#cancelar-editar-membro").click(function () {
        fecharEditarMembro();
    });

    function fecharEditarMembro() {
        $("#editar-membro").fadeOut();
        $("#editar-membro-container").fadeOut();
    }

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

    function converterParaFormatoBrasileiro(data) {
        const parts = data.split('-');
        const day = parts[2];
        const month = parts[1];
        const year = parts[0];
        return `${day}/${month}/${year}`;
    }
});