$(document).ready( function () {
    var listaTarefas;
    function listarTarefasAtivas() {
        listaTarefas = [];
        $("#tbody-ativas").html("");
        new Promise((resolve, reject) => {
            fetch(`http://localhost:3000/tarefa?status=ATIVA`)
            .then(response => {
                if (response.ok) {    
                    return response.json();
                } else {
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
                                    <div class="td-acoes-ativas"><button class="btn-editar" id="btn-editar-ativas${tarefa.id}">Editar</button><button class="btn-encaminhar" id="btn-abrir-encaminhar-tarefa-ativas${tarefa.id}">Alocar</button></div>
                                </td>
                            </tr>
                        `);
                    });
                }
                listaTarefas = data;
                carregarConfComponente( );
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
        })
    }
    listarTarefasAtivas();
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
                    throw new Error('Erro na resposta da requisição!');
                }
            })
            .then(data => {
                resolve(data);
                exibirJanelaSucesso("Alocado com sucesso!");
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
        if(descricaoGet != "" && dataPrevisaoGet != "") {
            let id = $("#id-editar-ativas").val();
            let tarefa = listaTarefas.find(tarefa => tarefa.id == id);
            $(tarefa.descricao).val(descricaoGet);
            tarefa.previsaoConclusao = dataPrevisaoGet;
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
                        fecharEditarTarefa();
                        return response.json();
                    } else {
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
        let remover = () => { 
            return new Promise((resolve, reject) => {
            fetch(`http://localhost:3000/tarefa/${parseInt(id)}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {    
                    return response.json();
                } else {
                    throw new Error('Erro na resposta da requisição!');
                }
            })
            .then(data => {
                resolve(data);
                exibirJanelaSucesso("Removido com sucesso!");
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

