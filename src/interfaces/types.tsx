export interface Servicio {
    _id?:string;
    tipo:string;
    titulo:string;
    detalles:string;
    costo:number;
    disponibilidad: boolean;
    imagenes: string[];
}