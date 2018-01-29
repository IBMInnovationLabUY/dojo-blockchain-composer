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
        alert("ERROR REST: Error al listar la información de los container")
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

                //Si el envío lo realicé yo a travéz de IBM Transporte y ya está en su destino
                if (containers[data[i].carga].origen == "resource:org.acme.sample.VendedorJuguetes#1" && containers[data[i].carga].almacenado == containers[data[i].carga].destino && data[i].desde == "resource:org.acme.sample.Transporte#1" ) {

                    var isPago = "No";
                    var fechaPago = "-";

                    if (pagos[data[i].carga] != undefined) {
                        isPago = "Si";
                        fechaPago = new Date(pagos[data[i].carga].timestamp).toLocaleString();
                    }

                    //Agregamos a la tabla y asociamos la función pagar al boton
                    $("#tableEnviosBody").append('<tr><th scope="row">' + containers[data[i].carga].idActivo + '</th><td>Pepe y Asociados</td><td>$' + containers[data[i].carga].costo + '</td><td>' + containers[data[i].carga].descripcion + '</td><td>' + fechaPago + '</td><td>' + isPago + '</td></tr>');

                }
            }

        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        alert("ERROR REST: No se pudieron listar los envios en destino")
    }).always(function() {
        $("#imgLoading").hide();
    });;

}