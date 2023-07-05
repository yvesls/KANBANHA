$(document).ready( function () {
    var listaTarefas;
    function listarTarefasAtivas() {
        listaTarefas = [];
        $("#tbody-ativas").html("");
        $(".carregando").show();
        new Promise((resolve, reject) => {
            fetch(`http://localhost:3000/tarefa?status=ATIVA`)
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
                    $("#tbody-ativas").append(`<tr><td colspan="5"><b>Não há tarefas ativas.</b></td></tr>`);
                }else {
                    data.forEach(function(tarefa) {
                        $("#tbody-ativas").append(`
                            <tr>
                                <td>${tarefa.descricao}</td>
                                <td>${tarefa.criadoPor}</td>
                                <td>${tarefa.dataCriacao}</td>
                                <td>${tarefa.previsaoConclusao}</td>
                                <td>
                                    <div class="td-acoes-ativas"><button class="btn-editar" id="btn-editar-ativas${tarefa.id}"><i class="fa-solid fa-pen-to-square"></i></button><button class="btn-encaminhar" id="btn-abrir-encaminhar-tarefa-ativas${tarefa.id}"><i class="fa-solid fa-arrow-right"></i></button></div>
                                </td>
                            </tr>
                        `);
                    });
                }
                listaTarefas = data;
                carregarConfComponente( );
                $(".carregando").hide();
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
        })
    }
    listarTarefasAtivas();

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
                listaMembros = data;
                listaMembros.forEach((membro)=> {
                    $("#atribuido-a-ativas").append(`<option value="${membro.nome}">${membro.nome}</option>`);
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

    function carregarConfComponente() {
        console.log(listaTarefas);
        listaTarefas.forEach(function(tarefa) {
            $(`#btn-editar-ativas${tarefa.id}`).click(function () {
                abrirEditarTarefa(tarefa);
            });
        });

        listaTarefas.forEach(function(tarefa) {
            $(`#btn-abrir-encaminhar-tarefa-ativas${tarefa.id}`).click(function () {
                abrirEncaminharTarefa(tarefa);
            });
        });
    }

    function enviarTarefaEmAndamento() {
        let atribuidoAGet = $("#atribuido-a-ativas").val();
        let dataAtribuicaoGet = obterDataAtual();
        let id = $("#id-encaminhar-ativas").val();
        let tarefa = listaTarefas.find(tarefa => tarefa.id == id);
        tarefa.atribuidoA = atribuidoAGet;
        tarefa.dataAtribuicao = dataAtribuicaoGet;
        tarefa.status = "EM ANDAMENTO";
        $(".carregando").show();
        let salvar = () => { 
            return new Promise((resolve, reject) => {
            fetch(`http://localhost:3000/tarefa/${tarefa.id}`, {
                method: 'PUT',
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
                resolve(data);
                exibirJanelaSucesso("Alocado com sucesso!");
                $(".carregando").hide();
                fecharEncaminarTarefa();
            })
            .catch(error => {
                reject(error);
            });  
        })}   
        salvar();
        listarTarefasAtivas();    
            
    }

    function salvarEditarTarefa() {
        let descricaoGet = $("#descricao-editar-ativas").val();
        console.log(descricaoGet)
        let dataPrevisaoGet = converterParaFormatoBrasileiro($("#tempo-editar-ativas").val());
        $(".carregando").show();
        if(descricaoGet != "" && dataPrevisaoGet != "") {
            let id = $("#id-editar-ativas").val();
            let tarefa = listaTarefas.find(tarefa => tarefa.id == id);
            $(tarefa.descricao).val(descricaoGet);
            tarefa.previsaoConclusao = dataPrevisaoGet;
            tarefa.descricao = descricaoGet;
            console.log(tarefa)
            let salvar = () => { 
                return new Promise((resolve, reject) => {
                fetch(`http://localhost:3000/tarefa/${parseInt(tarefa.id)}`, {
                    method: 'PUT',
                    body: JSON.stringify(tarefa),
                    headers: {
                    'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {    
                        resolve();
                        exibirJanelaSucesso("Editado com sucesso!");
                        $(".carregando").hide();
                        fecharEditarTarefa();
                        return response.json();
                    } else {
                        $(".carregando").hide();
                        exibirJanelaErro("Erro na resposta da requisição. Servidor possivelmente não está ativo.");
                        throw new Error('Erro na resposta da requisição!');
                    }
                })
                .then(_ => {
                    
                })
                .catch(error => {
                    reject(error);
                });  
            })}   
            salvar();
            listarTarefasAtivas();
        }
    }

    function removerTarefa() {
        let id = $("#id-editar-ativas").val();
        $(".carregando").show();
        let remover = () => { 
            return new Promise((resolve, reject) => {
            fetch(`http://localhost:3000/tarefa/${parseInt(id)}`, {
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
                fecharEditarTarefa();
            })
            .catch(error => {
                reject(error);
            });  
        })}   
        remover();
        listarTarefasAtivas();
    }

    $("#enviar-tarefa-ativas").click(function () {
        enviarTarefaEmAndamento();
    });

    $("#salvar-editar-tarefa-ativas").click( () => {
        salvarEditarTarefa();
    });

    $("#remover-tarefa-ativas").click(function () {
        removerTarefa();
    });

    $("#cancelar-enviar-tarefa-ativas").click(function () {
        fecharEncaminarTarefa();
    });

    $("#cancelar-editar-tarefa-ativas").click(function () {
        fecharEditarTarefa();
    });

    function abrirEncaminharTarefa(tarefa) {
        $("#encaminhar-tarefa-ativas").fadeIn();
        $("#encaminhar-tarefa-container-ativas").fadeIn();
        $("#id-encaminhar-ativas").val(tarefa.id);
    }

    function fecharEncaminarTarefa() {
        $("#encaminhar-tarefa-ativas").fadeOut();
        $("#encaminhar-tarefa-container-ativas").fadeOut();
    }

    function abrirEditarTarefa(tarefa) {
        $("#editar-tarefa-ativas").fadeIn();
        $("#editar-tarefa-container-ativas").fadeIn();
        $("#id-editar-ativas").val(tarefa.id);
        $("#descricao-editar-ativas").val(tarefa.descricao);
        $("#tempo-editar-ativas").val(converterParaFormatoDate(tarefa.previsaoConclusao.substring(0, 10)));
    }

    function fecharEditarTarefa() {
        $("#editar-tarefa-ativas").fadeOut();
        $("#editar-tarefa-container-ativas").fadeOut();
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

    function converterParaFormatoDate(data) {
        const parts = data.split('/');
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        return `${year}-${month}-${day}`;
    }
    
    function converterParaFormatoBrasileiro(data) {
        const parts = data.split('-');
        const day = parts[2];
        const month = parts[1];
        const year = parts[0];
        return `${day}/${month}/${year}`;
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

