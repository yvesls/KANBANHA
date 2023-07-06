$(document).ready( function () {
    var listaTarefas;
    function listarTarefasAndamento() {
        listaTarefas = [];
        $("#tbody-andamento").html("");
        $(".carregando").show();
        new Promise((resolve, reject) => {
            fetch(`http://localhost:3000/tarefa?status=EM ANDAMENTO`)
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
                    $("#tbody-andamento").append(`<tr><td colspan="7"><b>Não há tarefas em andamento.</b></td></tr>`);
                }else {
                    data.forEach(function(tarefa) {
                        $("#tbody-andamento").append(`
                            <tr>
                                <td>${tarefa.descricao}</td>
                                <td>${tarefa.criadoPor}</td>
                                <td>${converterParaFormatoBrasileiro(tarefa.dataCriacao)}</td>
                                <td>${tarefa.atribuidoA}</td>
                                <td>${converterParaFormatoBrasileiro(tarefa.dataAtribuicao)}</td>
                                <td>${converterParaFormatoBrasileiro(tarefa.previsaoConclusao)}</td>
                                <td>
                                    <div class="td-acoes-andamento"><button class="btn-editar" id="btn-editar-andamento${tarefa.id}"><i class="fa-solid fa-pen-to-square"></i></button><button class="btn-encaminhar" id="btn-abrir-encaminhar-tarefa-andamento${tarefa.id}"><i class="fa-solid fa-check"></i></button></div>
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
    listarTarefasAndamento();

    let todasTarefas;
    function listarTarefas() {
        todasTarefas = [];
        $(".carregando").show();
        new Promise((resolve, reject) => {
            fetch(`http://localhost:3000/tarefa`)
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
                todasTarefas = data;
                // inadequado retornar todas as tarefas para usar só o tamanho, porém, o json-server possui retornos limitados
                updateProgressBar(listaTarefas.length, todasTarefas.length);
                $("#quantidade-em-andamento").html(listaTarefas.length);
                $("#quantidade-total-em-andamento").html(todasTarefas.length);
                $(".carregando").hide();
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
        })
    }
    listarTarefas();

    var listaMembros;
    function listarMembros() {
        listaMembros = [];
        $("#tbody-membros").html("");
        $("#atribuido-a-editar-andamento").html("");
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
                    $("#atribuido-a-editar-andamento").append(`<option value="${membro.nome}">${membro.nome}</option>`);
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
            })
            .catch(error => {
                reject(error);
            });  
        })}   
        salvar();
        listarTarefasAndamento();  
        listarTarefas();
    }

    function salvarEditarTarefa() {
        if($("#descricao-editar-andamento").val() != "" && $("#data-previsao-editar-andamento").val() != "" && $("#tempo-previsao-editar-andamento").val() != "" && $("#atribuido-a-editar-andamento").val() != "") {
            let descricaoGet = $("#descricao-editar-andamento").val();
            let atribuidoAGet = $("#atribuido-a-editar-andamento").val();
            let dataPrevisaoGet = $("#data-previsao-editar-andamento").val() + " " + $("#tempo-previsao-editar-andamento").val();
            
            let id = $("#id-editar-andamento").val();
            let tarefa = listaTarefas.find(tarefa => tarefa.id == id);

            tarefa.descricao = descricaoGet;
            tarefa.previsaoConclusao = dataPrevisaoGet;
            tarefa.atribuidoA = atribuidoAGet;
            $(".carregando").show();
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
                        $(".carregando").hide();
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
            listarTarefasAndamento();
            listarTarefas();
        }else {
            exibirJanelaErro("Há campos vazios!");
        }
    }

    function removerTarefa() {
        let id = $("#id-editar-andamento").val();
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
                fecharEditarTarefa();
                $(".carregando").hide();
            })
            .catch(error => {
                reject(error);
            });  
        })}   
        remover();
        listarTarefasAndamento();
        listarTarefas();
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
        $("#data-previsao-editar-andamento").val(tarefa.previsaoConclusao.substring(0, 10));
        $("#tempo-previsao-editar-andamento").val(tarefa.previsaoConclusao.substring(11, 16));
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

    function converterParaFormatoBrasileiro(data) {
        let hora = data.substring(11, 16);
        data = data.substring(0, 10);
        const parts = data.split('-');
        const day = parts[2];
        const month = parts[1];
        const year = parts[0];
        return `${day}/${month}/${year} ${hora}`;
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

    function exibirJanelaErro(mensagem){
        $(".janela-container-erro > span").html(mensagem);
        $(".janela-container-erro").fadeIn();
        setTimeout(() => {
            $(".janela-container-erro").fadeOut();
        }, 2000);
    }

    function updateProgressBar(totalAtivas, totalTarefas) {
        var progressBar = document.getElementById("barra-progresso-em-andamento");
        let progress = (totalAtivas / totalTarefas) * 100;
        progressBar.style.width = progress + "%";
    }
});

