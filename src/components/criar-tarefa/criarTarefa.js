$(document).ready(function () {
    console.log("criar-tarefa");

    $(".btn-add").click(function () {
        addActivity();
    });

    function addActivity() {
        var data = $("#data").val();
        var horario = $("#horario").val();
        var profissional = $("#profissional").val();
        var descricao = $("#descricao").val();
        var tempo = $("#tempo").val();

        if (data && horario && profissional && descricao && tempo) {
            var newRow = $("<tr>");
            var cell1 = $("<td>").text(data);
            var cell2 = $("<td>").text(horario);
            var cell3 = $("<td>").text(profissional);
            var cell4 = $("<td>").text(descricao);
            var cell5 = $("<td>").text(tempo);
            var cell6 = $("<td>").html('<button class="edit-button" onclick="editActivity(this)">Editar</button>');
            var cell7 = $("<td>").html('<button class="forward-button" onclick="openDialog(this)">Encaminhar</button>');

            newRow.append(cell1, cell2, cell3, cell4, cell5, cell6, cell7);
            $("#activity-table tbody").append(newRow);

            // Limpar os campos do formulário
            $("#data").val("");
            $("#horario").val("");
            $("#profissional").val("");
            $("#descricao").val("");
            $("#tempo").val("");
        }
    }

    /* exemplo
    $.ajax({
        url: "http://localhost:3000/pessoas",
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log(data); // Aqui você pode manipular os dados recebidos
        },
        error: function (error) {
            console.log("Ocorreu um erro:", error);
        },
    });*/
});
