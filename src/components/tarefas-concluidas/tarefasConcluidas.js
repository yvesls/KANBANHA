$(document).ready(function () {
    var listaTarefas;
    function listarTarefasConcluidas() {
        listaTarefas = [];
        $("#tbody-concluidas").html("");
        new Promise((resolve, reject) => {
            fetch(`http://localhost:3000/tarefa?status=CONCLUIDA`)
            .then(response => {
                if (response.ok) {    
                    return response.json();
                } else {
                    throw new Error('Erro na resposta da requisição!');
                }
            })
            .then(data => {
                if(data.length == 0) {
                    $("#tbody-concluidas").append(`<tr><td colspan="7"><b>Não há tarefas concluidas.</b></td></tr>`);
                }else {
                    data.forEach(function(tarefa) {
                        $("#tbody-concluidas").append(`
                            <tr>
                                <td>${tarefa.descricao}</td>
                                <td>${tarefa.criadoPor}</td>
                                <td>${tarefa.dataCriacao}</td>
                                <td>${tarefa.atribuidoA}</td>
                                <td>${tarefa.dataAtribuicao}</td>
                                <td>${tarefa.previsaoConclusao}</td>
                                <td>${tarefa.dataConclusao}</td>
                            </tr>
                        `);
                    });
                }
                listaTarefas = data;
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
        })
    }
    listarTarefasConcluidas();

});
