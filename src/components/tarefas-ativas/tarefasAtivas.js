$(document).ready(function () {
    console.log("tarefas-ativas");

    // TESTE - VERIFICANDO SE É POSSÍVEL MUDAR A EXIBIÇÃO DO COMPONENTE A PARTIR DE UM
    // COMPONENTE FILHO - PASSOU NO TESTE
    /*$(".btn-criar-tarefa").click(function () {
        exibirCriarTarefa();
    });

    function exibirCriarTarefa() {
        $.ajax({
            url: "../criar-tarefa/criarTarefa.js",
            dataType: "script",
            success: function (response) {},
        });
        $.ajax({
            url: "../criar-tarefa/criarTarefa.html",
            dataType: "html",
            success: function (response) {
                $("#container-principal").html();
                $("#container-principal").html(response);
            },
        });
    }*/
});
