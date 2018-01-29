var distribuidores = [];
var containers = [];

$(document).ready(function() {

    $("#submitForm").submit(function(event) {
        event.preventDefault();
        crearNuevoContainer($("#inpDescContainer").val(), $("#inpDineroContainer").val(), $("#inpDistrubuidorContainer").val());
    });

    listarDistribuidores();
    listarContainers()
});

function listarContainers() {

    $("#imgLoading").show();

    $.ajax({
        type: 'GET',
        url: apiEndpoint + '/api/ContainerJuguetes',
        dataType: 'json',
        success: function(data) {

            $("#tableContainerBody").empty();


            for (var i = 0; i < data.length; i++) {
                containers[data[i].idActivo] = data[i];
                $("#tableContainerBody").append('<tr><th scope="row">' + data[i].idActivo + '</th><td>' + data[i].descripcion + '</td><td>' + data[i].costo + '</td></tr>');
            }

        },
        fail: function() {
            alert("Error en la llamada REST obteniendo informacion de containers");
        },
        allways: function() {
            $("#imgLoading").hide();
        }
    });

}

function listarDistribuidores() {

    $("#imgLoading").show();

    $.ajax({
        type: 'GET',
        url: apiEndpoint + '/api/Distribuidor',
        dataType: 'json',
        success: function(data) {

            $("#inpDistrubuidorContainer").empty();
            $("#inpDistrubuidorContainer").append('<option selected>Elegir...</option>');

            for (var i = 0; i < data.length; i++) {
                distribuidores[data[i].id] = data[i];
                $("#inpDistrubuidorContainer").append('<option value="' + data[i].idEmpresa + '">' + data[i].nombre + '</option>');
            }

            $("#imgLoading").hide();

        },
        fail: function() {
            alert("Error en la llamada REST obteniendo informacion de los distribuidores");
        },
        always: function() {
            $("#imgLoading").hide();
        }
    });

}

function crearNuevoContainer(desc, costo, idDestino) {

    if (desc == "" || costo == "" || idDestino == "Elegir...") {
        alert("Complete todos los campos");
        return;
    }

    $("#imgLoading").show();

    var json_string = '{"$class": "org.acme.sample.ContainerJuguetes", "idActivo": "id_act", "descripcion": "sDesc", "costo": sCost, "almacenado": "org.acme.sample.VendedorJuguetes#1","destino": "org.acme.sample.Distribuidor#distrib", "origen": "org.acme.sample.VendedorJuguetes#1"}';

    var json_changed = json_string.replace("id_act", containers.length).replace("sDesc", desc).replace("sCost", costo).replace("distrib", idDestino);
    console.log(json_changed);

    $.ajax({
        type: 'post',
        data: json_changed,
        contentType: 'application/json',
        url: apiEndpoint + '/api/ContainerJuguetes',
        dataType: 'json'
    }).done(function(data) {
        alert("Creado con éxito");
        listarContainers();
    }).fail(function(jqXHR, textStatus, errorThrown) {
        alert("ERROR REST: No se pudo crear el contenedor")
    }).always(function() {
        $("#imgLoading").hide();
    });

}