$(document).ready(function () {
    $("#enviar-tarefas-ativas").click(function () {
        enviarTarefaEmAndamento();
    });

    $("#btn-editar-ativas").click(function () {
        abrirEditarTarefa();
    });

    $("#btn-abrir-encaminhar-tarefa-ativas").click(function (e) {
        abrirEncaminharTarefa(e);
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

    function abrirEditarTarefa() {
        $("#editar-tarefa-ativas").fadeIn();
        $("#editar-tarefa-container-ativas").fadeIn();
    }

    function abrirEncaminharTarefa(button) {
        var row = $(button).closest("tr");

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
});
