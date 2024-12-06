export class Retiro {
    idRetirante: string;
    fecha?: string;
    descripcion: string;
    monto: string;
    idRecepcionista?: string;

    constructor(idRetirante: string, descripcion: string, monto: string, idRecepcionista?: string, fecha?: string) {
        this.idRetirante = idRetirante
        this.fecha = fecha
        this.descripcion = descripcion
        this.monto = monto
        this.idRecepcionista = idRecepcionista
    }
}