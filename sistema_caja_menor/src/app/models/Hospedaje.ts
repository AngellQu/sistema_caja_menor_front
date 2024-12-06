export class Hospedaje{
    id?: string;
    idHuesped: string;
    habitacion: string;
    fechaIngreso: string;
    fechaSalida: string;

    constructor( idHuesped: string, habitacion: string, fechaIngreso: string, fechaSalida: string, id?:string){
        this.id = id;
        this.idHuesped = idHuesped;
        this.habitacion = habitacion;
        this.fechaIngreso = fechaIngreso;
        this.fechaSalida = fechaSalida;
    }
}