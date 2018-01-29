var containers = [];
var containers_index = [];
var envios = [];

$(document).ready(function() {

    $("#submitForm").submit(function(event) {
        event.preventDefault();
        transferirCarga($("#inpDistrubuidorContainer").val(), $("#inptContainer").val());
    });

    listarContainers()

});

function listarContainers() {

    $("#imgLoading").show();

    $.ajax({
        type: 'GET',
        url: apiEndpoint + '/api/ContainerJuguetes',
        dataType: 'json',
        success: function(data) {


            for (var i = 0; i < data.length; i++) {
                containers["resource:org.acme.sample.ContainerJuguetes#" + data[i].idActivo] = data[i];
                containers_index[i] = data[i];
            }

            //Listamos los envios
            listarEnvios();

        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        alert("ERROR REST: Error al listar la información de los container")
    }).always(function() {
        $("#imgLoading").hide();
    });

}

function listarEnvios() {

    $("#imgLoading").show();

    $.ajax({
        type: 'GET',
        url: apiEndpoint + '/api/TransferirCarga',
        dataType: 'json',
        success: function(data) {

            $("#tableEnviosBody").empty();

            for (var i = 0; i < data.length; i++) {

                if (data[i].desde == "resource:org.acme.sample.VendedorJuguetes#1") {
                    envios[containers[data[i].carga].idActivo] = true;
                    $("#tableEnviosBody").append('<tr><th scope="row">' + containers[data[i].carga].idActivo + '</th><td>IBM Toys</td><td>IBM Transporte</td><td>' + new Date(data[i].timestamp).toLocaleString() + '</td></tr>');
                }
            }

            //Imprimimos containers
            imprimirContainers();

        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        alert("ERROR REST: No se pudieron listar los envios")
    }).always(function() {
        $("#imgLoading").hide();
    });;

}

function transferirCarga(destino, carga) {

    if (destino == "" || carga == "") {
        alert("Complete todos los campos");
        return;
    }

    $("#imgLoading").show();

    var json_string = '{"$class": "org.acme.sample.TransferirCarga", "carga": "org.acme.sample.ContainerJuguetes#sContainer", "desde": "org.acme.sample.VendedorJuguetes#1", "hacia": "org.acme.sample.Transporte#sTransporte"}';

    var json_changed = json_string.replace("sContainer", carga).replace("sTransporte", destino);
    console.log(json_changed);

    $.ajax({
        type: 'post',
        data: json_changed,
        contentType: 'application/json',
        url: apiEndpoint + '/api/TransferirCarga',
        dataType: 'json'
    }).done(function(data) {
        alert("Transferida con éxito");
        listarEnvios();
    }).fail(function(jqXHR, textStatus, errorThrown) {
        alert("ERROR REST: No se pudo enviar a la empresa de transporte")
    }).always(function() {
        $("#imgLoading").hide();
    });

}

function imprimirContainers() {

    $("#inptContainer").empty();

    for (var i = 0; i < containers_index.length; i++) {

        if (!envios[containers_index[i].idActivo]) {
            $("#inptContainer").append('<option value="' + containers_index[i].idActivo + '">' + containers_index[i].idActivo + ' - ' + containers_index[i].descripcion + '</option>');
        }
    }
}