var containers = [];
var containers_index = [];
var envios = [];
var pagos = [];

$(document).ready(function() {
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

            //Obtenemos informacion de los pagos
            obtenerPagos();

        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        alert("ERROR REST: Error al listar la información del container")
    }).always(function() {
        $("#imgLoading").hide();
    });

}

function obtenerPagos() {

    $("#imgLoading").show();

    $.ajax({
        type: 'GET',
        url: apiEndpoint + '/api/PagarEnvio',
        dataType: 'json',
        success: function(data) {


            for (var i = 0; i < data.length; i++) {
                pagos[data[i].envio] = data[i];
            }

            //Listamos los envios recibodos
            listarRecibidos();

        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        alert("ERROR REST: Error al listar la información de los pagos")
    }).always(function() {
        $("#imgLoading").hide();
    });

}

function listarRecibidos() {

    $("#imgLoading").show();

    $.ajax({
        type: 'GET',
        url: apiEndpoint + '/api/TransferirCarga',
        dataType: 'json',
        success: function(data) {

            $("#tableEnviosBody").empty();

            for (var i = 0; i < data.length; i++) {

                //Si el envío fue destinado a mi y no lo pague aún
                if (data[i].hacia == "resource:org.acme.sample.Distribuidor#1" && pagos[data[i].carga] != undefined) {

                    envios[data[i].carga] = data[i];

                    //Agregamos a la tabla y asociamos la función pagar al boton
                    $("#tableEnviosBody").append('<tr><th scope="row">' + containers[data[i].carga].idActivo + '</th><td>IBM Toys</td><td>IBM Transporte</td><td>' + new Date(data[i].timestamp).toLocaleString() + '</td><td>' + containers[data[i].carga].costo + '</td><td>' + containers[data[i].carga].descripcion + '</td></tr>');

                }
            }

        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        alert("ERROR REST: No se pudieron listar los envios")
    }).always(function() {
        $("#imgLoading").hide();
    });;

}