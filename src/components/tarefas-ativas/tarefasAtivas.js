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
    })}

    listarTarefasAtivas().then( listaTarefas =>{
        $("#enviar-tarefa-ativas").click(function () {
            enviarTarefaEmAndamento();
        });

        $("#salvar-editar-tarefa-ativas").click(function () {
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

        $("#cancelar-enviar-tarefa-ativas").click(function () {
            fecharEncaminarTarefa();
        });
        $("#cancelar-editar-tarefa-ativas").click(function () {
            fecharEditarTarefa();
        });

        function abrirEncaminharTarefa(tarefa) {
            $("#encaminhar-tarefa-ativas").fadeIn();
            $("#encaminhar-tarefa-container-ativas").fadeIn();
        }

        function enviarTarefaEmAndamento() {
            $("#encaminhar-tarefa-ativas").fadeOut();
            $("#encaminhar-tarefa-container-ativas").fadeOut();
        }

        function fecharEncaminarTarefa() {
            $("#encaminhar-tarefa-ativas").fadeOut();
            $("#encaminhar-tarefa-container-ativas").fadeOut();
        }

        function abrirEditarTarefa(tarefa) {
            $(`#editar-tarefa-ativas`).fadeIn();
            $(`#editar-tarefa-container-ativas`).fadeIn();
            $("#descricao-editar-ativas").val(tarefa.descricao);
            $("#tempo-editar-ativas").val(converterParaFormatoDate(tarefa.previsaoConclusao.substring(0, 10)));
        }

        function salvarEditarTarefa() {
            let descricao = $("#descricao-editar-ativas").val();
            let dataPrevisao = converterParaFormatoBrasileiro($("#tempo-editar-ativas").val());
            if(descricao != "" && dataPrevisao != "") {
                new Promise((resolve, reject) => {
                    fetch(`http://localhost:3000/tarefa`)
                    .then(response => {
                        if (response.ok) {    
                            return response.json();
                        } else {
                            throw new Error('Erro na resposta da requisição!');
                        }
                    })
                    .then(data => {
                        console.log(data)
                    })
                        resolve(data);
                    })
                    .catch(error => {
                    reject(error);
                });    
            }
        }

        function fecharEditarTarefa() {
            $("#editar-tarefa-ativas").fadeOut();
            $("#editar-tarefa-container-ativas").fadeOut();
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
    });
});