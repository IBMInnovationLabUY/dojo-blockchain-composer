var containers = [];
var containers_index = [];
var envios = [];
var pagos = [];
var empresas = [];

//En otra aplicación obtendríamos las empresas del registro de blockchain
empresas["resource:org.acme.sample.VendedorJuguetes#1"] = "IBM Toys";
empresas["resource:org.acme.sample.Transporte#1"] = "IBM Transporte";
empresas["resource:org.acme.sample.Distribuidor#1"] = "Pepe y Asociados";

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
            listarTransportes();

        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        alert("ERROR REST: Error al listar la información de los pagos")
    }).always(function() {
        $("#imgLoading").hide();
    });

}

function listarTransportes() {

    $("#imgLoading").show();

    $.ajax({
        type: 'GET',
        url: apiEndpoint + '/api/TransferirCarga',
        dataType: 'json',
        success: function(data) {

            $("#tableEnviosBody").empty();

            for (var i = 0; i < data.length; i++) {


                    //Agregamos a la tabla y asociamos la función pagar al boton
                    $("#tableEnviosBody").append('<tr><th scope="row">' + (i + 1) + '</th><td>'+empresas[data[i].desde]+'</td><td>'+empresas[data[i].hacia]+'</td><td>' + containers[data[i].carga].idActivo + '</td><td>' + containers[data[i].carga].descripcion + '</td><td>' + new Date(data[i].timestamp).toLocaleString() + '</td></tr>');
               
            }

        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        alert("ERROR REST: No se pudieron listar los envios")
    }).always(function() {
        $("#imgLoading").hide();
    });;

}