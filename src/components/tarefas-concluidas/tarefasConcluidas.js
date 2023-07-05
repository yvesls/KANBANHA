$(document).ready(function () {
    var listaTarefas;
    function listarTarefasConcluidas() {
        listaTarefas = [];
        $("#tbody-concluidas").html("");
        $(".carregando").show();
        new Promise((resolve, reject) => {
            fetch(`http://localhost:3000/tarefa?status=CONCLUIDA`)
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
                $(".carregando").hide();
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
        })
    }
    listarTarefasConcluidas();

    function exibirJanelaErro(mensagem){
        $(".janela-container-erro > span").html(mensagem);
        $(".janela-container-erro").fadeIn();
        setTimeout(() => {
            $(".janela-container-erro").fadeOut();
        }, 2000);
    }

    function compararDatas(data1, data2) {
        const date1 = new Date(data1);
        const date2 = new Date(data2);
    
        const diffInMilliseconds = date1 - date2;
    
        if (diffInMilliseconds < 0) {
            return {
                atraso: true,
                tempoAtraso: calcularTempo(diffInMilliseconds),
                status: "atrasado",
            };
        } else {
            return {
                atraso: false,
                tempoAtraso: calcularTempo(diffInMilliseconds),
                status: "dentro do tempo",
            };
        }
    }
  
    function calcularTempo(millis) {
            const totalSeconds = Math.abs(Math.floor(millis / 1000));
            const days = Math.floor(totalSeconds / (3600 * 24));
            const hours = Math.floor((totalSeconds - days * 3600 * 24) / 3600);
        
            return {
            dias: days,
            horas: hours,
            };
    }
  
    const data1 = "26/03/2019 19:07";
    const data2 = "25/03/2019 12:30";
    const resultado = compararDatas(data1, data2);
    console.log(resultado);     
      
});
