import {Rol} from "./rol.model";

export interface Usuario {
  id?:    number;  // El ? significa opcional
  rol:    Rol;
  nombre: string;
  correo: string;
  clave:  string;
  admin?: boolean; // Opcional
}
