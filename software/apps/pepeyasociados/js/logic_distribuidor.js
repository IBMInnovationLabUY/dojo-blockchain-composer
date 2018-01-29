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
                if (data[i].hacia == "resource:org.acme.sample.Distribuidor#1" && pagos[data[i].carga] == undefined) {

                    envios[data[i].carga] = data[i];

                    //Agregamos a la tabla y asociamos la función pagar al boton
                    $("#tableEnviosBody").append('<tr><th scope="row">' + containers[data[i].carga].idActivo + '</th><td>IBM Toys</td><td>IBM Transporte</td><td>' + new Date(data[i].timestamp).toLocaleString() + '</td><td>' + containers[data[i].carga].costo + '</td><td>' + containers[data[i].carga].descripcion + '</td><td><button type="button" class="btn btn-outline-success" value="' + data[i].carga + '" id="container' + containers[data[i].carga].idActivo + '"><img src="../../assets/svg/dollar.svg" alt="Pagar"> Pagar</button></td></tr>');

                    $("#container" + containers[data[i].carga].idActivo + "").click(function() {

                        if (confirm("¿Está seguro que desea pagar este envío?")) {
                            var envio = envios[$(this).attr('value')];
                            pagarEnvio(envio.carga);
                        }

                    });


                }
            }

        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        alert("ERROR REST: No se pudieron listar los envios")
    }).always(function() {
        $("#imgLoading").hide();
    });;

}

function pagarEnvio(carga) {

    if (carga == "") {
        alert("Información inválida");
        return;
    }

    //Mostramos la imagen de carga
    $("#imgLoading").show();

    //Payload para nuestra petición POST
    var json_string = '{"$class": "org.acme.sample.PagarEnvio","envio": "sCarga"}';

    //Quitamos "resource:" de los campos recibidos al obtener los envíos
    var clean_carga = carga.replace("resource:", "");

    //Reemplazamos en JSON
    var json_changed = json_string.replace("sCarga", clean_carga);

    //Hacemos la petición REST POST con Ajax
    $.ajax({
        type: 'post',
        data: json_changed,
        contentType: 'application/json',
        url: apiEndpoint + '/api/PagarEnvio',
        dataType: 'json'
    }).done(function(data) {
        alert("Envío pagado con éxito");
        listarContainers();
    }).fail(function(jqXHR, textStatus, errorThrown) {
        alert("ERROR REST: No se pudo pagar el envío")
    }).always(function() {
        $("#imgLoading").hide();
    });

}