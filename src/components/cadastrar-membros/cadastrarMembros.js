$(document).ready(function () {
    $('#cadastro-form').submit(function(event) {
        event.preventDefault();

        // Obtém os valores dos campos do formulário
        var nome = $('#nome').val();
        var dataNascimento = $('#data-nascimento').val();
        var cpf = $('#cpf').val();

        // Verifica se está no modo de edição ou adição
        var isEdit = $('#cadastro-form').data('isEdit');
        var rowIndex = $('#cadastro-form').data('rowIndex');

        if (isEdit) {
            // Modo de edição - atualiza a linha existente
            var row = $('#membros-tabela tbody tr').eq(rowIndex);
            row.find('td:eq(0)').text(nome);
            row.find('td:eq(1)').text(dataNascimento);
            row.find('td:eq(2)').text(cpf);

            // Reseta as flags
            $('#cadastro-form').data('isEdit', false);
            $('#cadastro-form').data('rowIndex', null);
        } else {
            // Modo de adição - adiciona uma nova linha à tabela com os dados do formulário
            var newRow = $('<tr>');
            newRow.append('<td>' + nome + '</td>');
            newRow.append('<td>' + dataNascimento + '</td>');
            newRow.append('<td>' + cpf + '</td>');
            newRow.append('<td><button class="editar-btn">Editar</button></td>');
            $('#membros-tabela tbody').append(newRow);
        }

        // Limpa os campos do formulário
        $('#nome').val('');
        $('#data-nascimento').val('');
        $('#cpf').val('');
    });

    // Define o evento de clique para o botão "Editar"
    $(document).on('click', '.editar-btn', function() {
        var row = $(this).closest('tr');
        var nome = row.find('td:eq(0)').text();
        var dataNascimento = row.find('td:eq(1)').text();
        var cpf = row.find('td:eq(2)').text();

        // Preenche o formulário com as informações da linha selecionada
        $('#nome').val(nome);
        $('#data-nascimento').val(dataNascimento);
        $('#cpf').val(cpf);

        // Define as flags de modo de edição e índice da linha
        var rowIndex = row.index();
        $('#cadastro-form').data('isEdit', true);
        $('#cadastro-form').data('rowIndex', rowIndex);
    });

    // Aplica a máscara ao campo CPF
    $('#cpf').inputmask('999.999.999-99');
});
