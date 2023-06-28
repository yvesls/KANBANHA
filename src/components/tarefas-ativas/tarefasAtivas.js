$(document).ready(function () {
    console.log("tarefas-ativas");

    $(".enviar-tarefas-ativas").click(function () {
        sendForward();
    });

    $(".edit-button").click(function (e) {
        editActivity(e);
    });

    $(".forward-button").click(function (e) {
        openDialog(e);
    });

    function sendForward() {
        var profissional = $("#forward-profissional").val();
        var data = $("#forward-data").val();
        var horario = $("#forward-horario").val();

        $("#dialog-overlay").fadeOut();
        $("#dialog-box").fadeOut();

        $("#activity-table tbody tr").each(function () {
            var row = $(this);
            var cells = row.children("td");

            if (cells.eq(2).text() === profissional && cells.eq(0).text() === data && cells.eq(1).text() === horario) {
                row.remove();
                return false;
            }
        });
    }

    function editActivity(button) {
        var row = $(button).closest("tr");
        var cells = row.children("td");

        var data = cells.eq(0).text();
        var horario = cells.eq(1).text();
        var profissional = cells.eq(2).text();
        var descricao = cells.eq(3).text();
        var tempo = cells.eq(4).text();

        $("#data").val(data);
        $("#horario").val(horario);
        $("#profissional").val(profissional);
        $("#descricao").val(descricao);
        $("#tempo").val(tempo);

        row.remove();
    }

    function openDialog(button) {
        var row = $(button).closest("tr");
        var cells = row.children("td");

        var profissional = cells.eq(2).text();
        var data = cells.eq(0).text();
        var horario = cells.eq(1).text();

        $("#forward-profissional").val(profissional);
        $("#forward-data").val(data);
        $("#forward-horario").val(horario);

        $("#dialog-overlay").fadeIn();
        $("#dialog-box").fadeIn();
    }
});
