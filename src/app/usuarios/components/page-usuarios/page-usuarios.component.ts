import {Component, OnInit} from '@angular/core';
import {UsuariosService} from "../../../shared/services/usuarios.service";
import {Usuario} from "../../../shared/models/usuario.model";
import {HttpErrorResponse} from "@angular/common/http";
import {Message, MessageService} from "primeng/api";

@Component({
  selector: 'app-page-usuarios',
  templateUrl: './page-usuarios.component.html',
  styleUrls: ['./page-usuarios.component.css'],
  providers: [
    MessageService
  ]
})
export class PageUsuariosComponent implements OnInit {
  public usuarios: Usuario[];
  public cargandoUsuarios: boolean;
  public borrandoUsuario: boolean;
  public ejecutandoBorrar: boolean;

  constructor(
    private usuariosService: UsuariosService,
    private mensajeService: MessageService
  ) {
    this.usuarios = []
    this.cargandoUsuarios = false;
    this.borrandoUsuario = false;
    this.ejecutandoBorrar = false;
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  public cargarUsuarios() {
    this.cargandoUsuarios = true;
    this.usuariosService.obtenerTodosUsuarios().subscribe(
      {
        next: (datos: Usuario[]) => {
          console.log("Han llegado los datos ", datos);
          this.usuarios = datos;
          this.cargandoUsuarios = false;
        },
        error: (error: HttpErrorResponse) => {
          console.log("Error al recuperar datos ", error);
          this.cargandoUsuarios = false;
        }
      }
    );
  }

  public borrarUsuario(usuario: Usuario) {
    if (this.ejecutandoBorrar){
      return
    }
    this.borrandoUsuario = true;
    this.ejecutandoBorrar = true;
    this.usuariosService.borrarUsuario(usuario).subscribe(
      {
        next: () => {
          const mensaje: Message = {
            summary: "Borrar",
            detail: "Usuario borrado satisfactoriamente",
            severity: "success"
          };
          this.mensajeService.add(mensaje);
          this.borrandoUsuario = false;
          this.ejecutandoBorrar = false
          this.cargarUsuarios();
        },
        error: (datos: HttpErrorResponse) => {
          const mensaje: Message = {
            summary: "Borrar",
            detail: "Hubo un error al borrar: " + datos.message,
            severity: "error"
          };
          this.borrandoUsuario = false;
          this.ejecutandoBorrar = false;
          this.mensajeService.add(mensaje);
        }

      }
    );
  }

  obtenerEstiloPorRol(rol: string): string {
    switch (rol) {
      case "administrador":
        return "success";
      case 'usuario':
        return "primary";
      case "visor":
        return "warning";
      default:
        return "info";
    }
  }


}
