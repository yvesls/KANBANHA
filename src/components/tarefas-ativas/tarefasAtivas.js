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
        $("#enviar-tarefas-ativas").click(function () {
            enviarTarefaEmAndamento();
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

        function enviarTarefaEmAndamento() {
            $("#encaminhar-tarefa-ativas").fadeOut();
            $("#encaminhar-tarefa-container-ativas").fadeOut();

            $("#activity-table tbody tr").each(function () {
                var row = $(this);
                var cells = row.children("td");

                if (cells.eq(2).text() === profissional && cells.eq(0).text() === data && cells.eq(1).text() === horario) {
                    row.remove();
                    return false;
                }
            });
        }

        function abrirEditarTarefa(tarefa) {
            $(`#editar-tarefa-ativas`).fadeIn();
            $(`#editar-tarefa-container-ativas`).fadeIn();
            $("#descricao-editar-ativas").val(tarefa.descricao);
            $("#tempo-editar-ativas").val(converterParaFormatoDate(tarefa.previsaoConclusao.substring(0, 10)));
        }

        function abrirEncaminharTarefa() {
            $("#encaminhar-tarefa-ativas").fadeIn();
            $("#encaminhar-tarefa-container-ativas").fadeIn();
        }

        function fecharEncaminarTarefa() {
            $("#encaminhar-tarefa-ativas").fadeOut();
            $("#encaminhar-tarefa-container-ativas").fadeOut();
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