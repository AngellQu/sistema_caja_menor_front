export class IngresoProducto {
    nombre: string
    cantidad: string;
    metodoPago: string;
    idHuesped: string;
    monto?: number;
    fecha?: string;
    idProducto?: number;
    idRecepcionista?: string;
    
    constructor(
        nombre: string,
        cantidad: string,
        metodoPago: string,
        idHuesped: string,
        fecha?: string,
        monto?: number,
        idProducto?: number,
        idRecepcionista? : string,
    ) {
        this.nombre = nombre;
        this.idProducto = idProducto;
        this.idHuesped = idHuesped;
        this.idRecepcionista = idRecepcionista;
        this.fecha = fecha;
        this.cantidad = cantidad;
        this.monto = monto;
        this.metodoPago = metodoPago;
    }
}