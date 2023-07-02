$(document).ready(function () {
    exibirTarefasAtivas();

    function exibirTarefasEmAndamento() {
        $.ajax({
            url: "../tarefas-emAndamento/tarefasEmAndamento.js",
            dataType: "script",
            success: function (response) {},
        });
        $.ajax({
            url: "../tarefas-emAndamento/tarefasEmAndamento.html",
            dataType: "html",
            success: function (response) {
                $("#container-principal").html();
                $("#container-principal").html(response);
            },
        });
    }

    function exibirTarefasAtivas() {
        $.ajax({
            url: "../tarefas-ativas/tarefasAtivas.js",
            dataType: "script",
            success: function (response) {},
        });
        $.ajax({
            url: "../tarefas-ativas/tarefasAtivas.html",
            dataType: "html",
            success: function (response) {
                $("#container-principal").html();
                $("#container-principal").html(response);
            },
        });
    }

    function exibirTarefasConcluidas() {
        $.ajax({
            url: "../tarefas-concluidas/tarefasConcluidas.js",
            dataType: "script",
            success: function (response) {},
        });
        $.ajax({
            url: "../tarefas-concluidas/tarefasConcluidas.html",
            dataType: "html",
            success: function (response) {
                $("#container-principal").html();
                $("#container-principal").html(response);
            },
        });
    }

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
    }

    function exibirCadastrarMembro() {
        $.ajax({
            url: "../cadastrar-membros/cadastrarMembros.js",
            dataType: "script",
            success: function (response) {},
        });
        $.ajax({
            url: "../cadastrar-membros/cadastrarMembros.html",
            dataType: "html",
            success: function (response) {
                $("#container-principal").html();
                $("#container-principal").html(response);
            },
        });
    }
    $(".btn-em-andamento").click(function () {
        exibirTarefasEmAndamento();
    });

    $(".btn-ativas").click(function () {
        exibirTarefasAtivas();
    });

    $(".btn-concluidas").click(function () {
        exibirTarefasConcluidas();
    });

    $(".btn-cadastrar-membro").click(function () {
        exibirCadastrarMembro();
    });

    $(".btn-criar-tarefa").click(function () {
        exibirCriarTarefa();
    });

    $(".btn-tarefas").mouseenter(function () {
        $(".tarefas-menu").css("visibility", "visible");
    });

    $(".btn-tarefas").mouseleave(function () {
        $(".tarefas-menu").css("visibility", "hidden");
    });
});
