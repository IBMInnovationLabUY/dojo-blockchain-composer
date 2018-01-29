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

                //Si el envío fue destinado a mi empresa de transporte
                if (data[i].hacia == "resource:org.acme.sample.Transporte#1") {
                    envios[data[i].carga] = data[i];

                    isEnviada = false

                    //Si esta carga no fue ya enviada al distribuidor
                    for (var j = 0; j < data.length; j++) {

                        if (data[j].desde == "resource:org.acme.sample.Transporte#1" && data[i].carga == data[j].carga) {
                            isEnviada = true;
                            break;
                        }

                    }

                    if (!isEnviada) {

                        //Agregamos a la tabla y asociamos la función enviar carga al boton
                        $("#tableEnviosBody").append('<tr><th scope="row">' + containers[data[i].carga].idActivo + '</th><td>IBM Toys</td><td>IBM Transporte</td><td>' + new Date(data[i].timestamp).toLocaleString() + '</td><td><button type="button" class="btn btn-outline-success" value="' + data[i].carga + '" id="container' + containers[data[i].carga].idActivo + '"><img src="../../assets/svg/location.svg"></button></td></tr>');

                        $("#container" + containers[data[i].carga].idActivo + "").click(function() {

                            if (confirm("¿Está seguro de marcar este envío como realizado?")) {
                                var envio = envios[$(this).attr('value')];
                                var container = containers[$(this).attr('value')];
                                transferirCarga(container.destino, envio.carga);
                            }

                        });
                    }

                }
            }

        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        alert("ERROR REST: No se pudieron listar los envios")
    }).always(function() {
        $("#imgLoading").hide();
    });;

}

function transferirCarga(destino, carga) {

    if (destino == "" || carga == "") {
        alert("Información inválida");
        return;
    }

    //Mostramos la imagen de carga
    $("#imgLoading").show();

    //Payload para nuestra petición POST
    var json_string = '{"$class": "org.acme.sample.TransferirCarga", "carga": "sCarga", "desde": "org.acme.sample.Transporte#1", "hacia": "sDestino"}';

    //Quitamos "resource:" de los campos recibidos al obtener los envíos
    var clean_destino = destino.replace("resource:", "");
    var clean_carga = carga.replace("resource:", "");

    //Reemplazamos en JSON
    var json_changed = json_string.replace("sCarga", clean_carga).replace("sDestino", clean_destino);

    //Hacemos la petición REST POST con Ajax
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
        alert("ERROR REST: No se pudo enviar a el distribuidor")
    }).always(function() {
        $("#imgLoading").hide();
    });

}