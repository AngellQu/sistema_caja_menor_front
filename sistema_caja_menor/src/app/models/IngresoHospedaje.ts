export class IngresoHospedaje{
    idHospedaje: string;
    fecha?: string;
    metodoPago: string;
    monto: string;
    idRecepcionista?: string

    constructor(idHospedaje: string, metodoPago: string, monto: string,  fecha?: string, idRecepcionista?: string){
        this.idHospedaje = idHospedaje;
        this.fecha = fecha;
        this.metodoPago = metodoPago;
        this.monto = monto;
        this.idRecepcionista = idRecepcionista;
    }
}