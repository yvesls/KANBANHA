$(document).ready(function () {
    let listarTarefasAtivas = ()=> {
        return new Promise((resolve, reject) => {
            fetch(`http://localhost:3000/tarefa?status=ATIVA`)
            .then(response => {
                if (response.ok) {    
                    return response.json();
                } else {
                    throw new Error('Erro na resposta da requisição!');
                }
            })
            .then(data => {
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
            })
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
        })
    }

    listarTarefasAtivas().then( listaTarefas =>{
        $("#enviar-tarefa-ativas").click(function () {
            enviarTarefaEmAndamento();
        });

        $("#salvar-editar-tarefa-ativas").click( () => {
            salvarEditarTarefa();
        });

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

        function enviarTarefaEmAndamento() {
            let atribuidoA = $("#atribuido-a-ativas").val();
            let dataAtribuicao = obterDataAtual();
            if(atribuidoA) {
                let id = $("#id-encaminhar-ativas").val();
                let tarefa = listaTarefas.find(tarefa => tarefa.id == id);
                tarefa.atribuidoA = atribuidoA;
                tarefa.dataAtribuicao = dataAtribuicao;
                tarefa.status = "EM ANDAMENTO";
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
                            return response.json();
                        } else {
                            throw new Error('Erro na resposta da requisição!');
                        }
                    })
                    .then(data => {
                        resolve(data);
                        console.log(data);
                        fecharEditarTarefa();
                    })
                    .catch(error => {
                        reject(error);
                    });  
                })}   
                salvar();
            }
            $("#encaminhar-tarefa-ativas").fadeOut();
            $("#encaminhar-tarefa-container-ativas").fadeOut();
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

        function salvarEditarTarefa() {
            let descricao = $("#descricao-editar-ativas").val();
            let dataPrevisao = converterParaFormatoBrasileiro($("#tempo-editar-ativas").val());
            if(descricao != "" && dataPrevisao != "") {
                let id = $("#id-editar-ativas").val();
                let tarefa = listaTarefas.find(tarefa => tarefa.id == id);
                tarefa.descricao = descricao;
                tarefa.previsaoConclusao = dataPrevisao;
                
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
                            return response.json();
                        } else {
                            throw new Error('Erro na resposta da requisição!');
                        }
                    })
                    .then(data => {
                        resolve(data);
                        console.log(data);
                        fecharEditarTarefa();
                    })
                    .catch(error => {
                        reject(error);
                    });  
                })}   
                salvar();
            }
        }

        function fecharEditarTarefa() {
            $("#editar-tarefa-ativas").fadeOut();
            $("#editar-tarefa-container-ativas").fadeOut();
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
                    console.log(data);
                    fecharEditarTarefa();
                })
                .catch(error => {
                    reject(error);
                });  
            })}   
            remover();
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
});