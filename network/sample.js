/**
 * Funcion transferir carga de una empresa a otra
 * @param {org.acme.sample.TransferirCarga} tx el nombre de la variable.
 * @transaction
 */
function TransferirCarga(tx) {

    // Cambiamos el propietario del contenedor
    tx.carga.almacenado = tx.hacia

    // Obtener de el registro de activos el activo.
    return getAssetRegistry('org.acme.sample.ContainerJuguetes')
        .then(function (assetRegistry) {

            // Update the asset in the asset registry.
            assetRegistry.update(tx.carga);
        });
}

/**
 * Funcion transferir dinero de una empresa a otra
 * @param {org.acme.sample.PagarEnvio} tx el nombre de la variable.
 * @transaction
 */
function PagarEnvio(tx) {

   	//Vemos que el paquete haya llegado a su destino
  	if(tx.envio.almacenado.idEmpresa != tx.envio.destino.idEmpresa){
		throw new Error("El paquete no llego a destino");
	}


    //Vemos si la empresa tiene suficiente dinero para pagar
  	if(tx.envio.monto > tx.envio.destino.dinero.monto){
		throw new Error("Fondos insuficientes");
	}

	//Hacemos la transferencia
	tx.envio.destino.dinero.monto -= tx.envio.costo;
    tx.envio.origen.dinero.monto += tx.envio.costo;

    // Obtener de el registro de activos el activo.
    return getAssetRegistry('org.acme.sample.Dinero')
        .then(function (assetRegistry) {

            // Update the asset in the asset registry.
            assetRegistry.update(tx.envio.origen.dinero);
            assetRegistry.update(tx.envio.destino.dinero);

        });
}
