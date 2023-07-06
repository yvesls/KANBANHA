$(document).ready(function () {
    var listaTarefas;
    var resultado = 0;
    var concAtrasadas = 0;
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
                        const situacaoEntrega = compararDatas(converterParaFormatoBrasileiro(tarefa.previsaoConclusao), converterParaFormatoBrasileiro(tarefa.dataConclusao));
                        let situacao = `<td class="${situacaoEntrega.status}">Entregue dentro do tempo</td>`;
                        let tempo = `<td class="${situacaoEntrega.status}">Dias: ${situacaoEntrega.tempoAtraso.dias} Horas: ${situacaoEntrega.tempoAtraso.horas}</td>`;
                        if(situacaoEntrega.atraso) {
                            concAtrasadas++;
                            resultado = somarTempoAtraso(resultado, situacaoEntrega);
                            situacao = `<td class="${situacaoEntrega.status}">Entregue com atraso</td>`;
                        }
                        $("#tbody-concluidas").append(`
                            <tr>
                                <td>${tarefa.descricao}</td>
                                <td>${tarefa.criadoPor}</td>
                                <td>${converterParaFormatoBrasileiro(tarefa.dataCriacao)}</td>
                                <td>${tarefa.atribuidoA}</td>
                                <td>${converterParaFormatoBrasileiro(tarefa.dataAtribuicao)}</td>
                                <td>${converterParaFormatoBrasileiro(tarefa.previsaoConclusao)}</td>
                                <td>${converterParaFormatoBrasileiro(tarefa.dataConclusao)}</td>
                                ${situacao}
                                ${tempo}
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
                $("#quantidade-concluidas").html(listaTarefas.length);
                $("#quantidade-total-concluidas").html(todasTarefas.length);
                updateProgressBarAtrasada(concAtrasadas, listaTarefas.length);
                $("#quantidade-concluidas-atrasadas").html(concAtrasadas);
                $("#quantidade-total-concluidas-atrasadas").html(resultado);
                $(".carregando").hide();
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
        })
    }
    listarTarefas();

    function exibirJanelaErro(mensagem){
        $(".janela-container-erro > span").html(mensagem);
        $(".janela-container-erro").fadeIn();
        setTimeout(() => {
            $(".janela-container-erro").fadeOut();
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

    function compararDatas(data1, data2) {
        const [dia1, mes1, ano1, hora1, minuto1] = data1.split(/[/\s:]+/);
        const [dia2, mes2, ano2, hora2, minuto2] = data2.split(/[/\s:]+/);

        const date1 = new Date(ano1, mes1 - 1, dia1, hora1, minuto1);
        const date2 = new Date(ano2, mes2 - 1, dia2, hora2, minuto2);
    
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
                status: "em-tempo",
            };
        }
    }
  
    function calcularTempo(millis) {
        const totalSeconds = Math.abs(Math.floor(millis / 1000));
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds - days * 3600 * 24) / 3600);
        return {
            dias: parseInt(days),
            horas: parseInt(hours),
        };
    }
  
    function somarTempoAtraso(resultado, tempoAtrasoParametro) {
            const { dias, horas } = tempoAtrasoParametro.tempoAtraso;
        
            let totalAtrasoCalculado = dias + (horas / 24);
            let totalAtrasoFinal = resultado + totalAtrasoCalculado;
            return  totalAtrasoFinal;
    }

    function updateProgressBar(totalAtivas, totalTarefas) {
        var progressBar = document.getElementById("barra-progresso-concluidas");
        let progress = (totalAtivas / totalTarefas) * 100;
        progressBar.style.width = progress + "%";
    }
    
    function updateProgressBarAtrasada(totalAtivas, totalTarefas) {
        var progressBar = document.getElementById("barra-progresso-concluidas-atrasadas");
        let progress = (totalAtivas / totalTarefas) * 100;
        progressBar.style.width = progress + "%";
    }
});
