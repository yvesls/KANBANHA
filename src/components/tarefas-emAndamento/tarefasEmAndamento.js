$(document).ready( function () {
    var listaTarefas;
    function listarTarefasAndamento() {
        listaTarefas = [];
        $("#tbody-andamento").html("");
        new Promise((resolve, reject) => {
            fetch(`http://localhost:3000/tarefa?status=EM ANDAMENTO`)
            .then(response => {
                if (response.ok) {    
                    return response.json();
                } else {
                    throw new Error('Erro na resposta da requisição!');
                }
            })
            .then(data => {
                if(data.length == 0) {
                    $("#tbody-andamento").append(`<tr><td colspan="7"><b>Não há tarefas em andamento.</b></td></tr>`);
                }else {
                    data.forEach(function(tarefa) {
                        $("#tbody-andamento").append(`
                            <tr>
                                <td>${tarefa.descricao}</td>
                                <td>${tarefa.criadoPor}</td>
                                <td>${tarefa.dataCriacao}</td>
                                <td>${tarefa.atribuidoA}</td>
                                <td>${tarefa.dataAtribuicao}</td>
                                <td>${tarefa.previsaoConclusao}</td>
                                <td>
                                    <div class="td-acoes-andamento"><button class="btn-editar" id="btn-editar-andamento${tarefa.id}">Editar</button><button class="btn-encaminhar" id="btn-abrir-encaminhar-tarefa-andamento${tarefa.id}">Concluir</button></div>
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
    listarTarefasAndamento();
    
    function carregarConfComponente() {
        console.log(listaTarefas);
        listaTarefas.forEach(function(tarefa) {
            $(`#btn-editar-andamento${tarefa.id}`).click(function () {
                abrirEditarTarefa(tarefa);
            });
        });

        listaTarefas.forEach(function(tarefa) {
            $(`#btn-abrir-encaminhar-tarefa-andamento${tarefa.id}`).click(function () {
                abrirEncaminharTarefa(tarefa);
            });
        });
    }

    function enviarTarefaConcluida(id) {
        let tarefa = listaTarefas.find(tarefa => tarefa.id == id);
        tarefa.status = "CONCLUIDA";
        tarefa.dataConclusao = obterDataAtual();
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
            })
            .catch(error => {
                reject(error);
            });  
        })}   
        salvar();
        listarTarefasAndamento();    
            
    }

    function salvarEditarTarefa() {
        let descricaoGet = $("#descricao-editar-andamento").val();
        let atribuidoAGet = $("#atribuido-a-editar-andamento").val();
        let dataPrevisaoGet = converterParaFormatoBrasileiro($("#tempo-editar-andamento").val());
        if(descricaoGet != "" && dataPrevisaoGet != "" && atribuidoAGet != "") {
            let id = $("#id-editar-andamento").val();
            let tarefa = listaTarefas.find(tarefa => tarefa.id == id);
            tarefa.descricao = descricaoGet;
            tarefa.previsaoConclusao = dataPrevisaoGet;
            tarefa.atribuidoA = atribuidoAGet;
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
            listarTarefasAndamento();
        }
    }

    function removerTarefa() {
        let id = $("#id-editar-andamento").val();
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
        listarTarefasAndamento();
    }

    $("#enviar-tarefa-andamento").click(function () {
        enviarTarefaConcluida();
    });

    $("#salvar-editar-tarefa-andamento").click( () => {
        salvarEditarTarefa();
    });

    $("#remover-tarefa-andamento").click(function () {
        removerTarefa();
    });

    $("#cancelar-enviar-tarefa-andamento").click(function () {
        fecharEncaminarTarefa();
    });

    $("#cancelar-editar-tarefa-andamento").click(function () {
        fecharEditarTarefa();
    });

    function abrirEncaminharTarefa(tarefa) {
        enviarTarefaConcluida(tarefa.id);
    }

    function abrirEditarTarefa(tarefa) {
        $("#editar-tarefa-andamento").fadeIn();
        $("#editar-tarefa-container-andamento").fadeIn();
        $("#id-editar-andamento").val(tarefa.id);
        $("#descricao-editar-andamento").val(tarefa.descricao);
        $("#atribuido-a-editar-andamento").val(tarefa.atribuidoA);
        $("#tempo-editar-andamento").val(converterParaFormatoDate(tarefa.previsaoConclusao.substring(0, 10)));
    }

    function fecharEditarTarefa() {
        $("#editar-tarefa-andamento").fadeOut();
        $("#editar-tarefa-container-andamento").fadeOut();
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

