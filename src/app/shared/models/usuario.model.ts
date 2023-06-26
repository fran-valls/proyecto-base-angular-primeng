import {Rol} from "./rol.model";

export interface Usuario {
  id:     number;
  rol:    Rol;
  nombre: string;
  correo: string;
  clave:  string;
  admin:  boolean;
}
