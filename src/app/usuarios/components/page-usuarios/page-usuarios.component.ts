import {Component, OnInit} from '@angular/core';
import {UsuariosService} from "../../../shared/services/usuarios.service";
import {Usuario} from "../../../shared/models/usuario.model";
import {HttpErrorResponse} from "@angular/common/http";
import {ConfirmationService, Message, MessageService, PrimeIcons} from "primeng/api";
import {Rol} from "../../../shared/models/rol.model";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-page-usuarios',
  templateUrl: './page-usuarios.component.html',
  styleUrls: ['./page-usuarios.component.css'],
  providers: [
    MessageService,
    ConfirmationService
  ]
})
export class PageUsuariosComponent implements OnInit {

  // Datos de la página
  public usuarios: Usuario[];
  public roles: Rol[]

  // Variables de estado de un proceso
  public cargandoUsuarios: boolean;
  public borrandoUsuario: boolean;
  public guardandoUsuario: boolean;

  // Ventana de diálogo de nuevo usuario
  public dialogoNuevoUsuarioVisible: boolean;

  // Formulario Usuario
  public formUsuario!: FormGroup;

  constructor(
    private usuariosService: UsuariosService,
    private mensajeService: MessageService,
    private confirmarService: ConfirmationService,
    private formBuilder: FormBuilder
  ) {
    this.usuarios = []
    this.cargandoUsuarios = false;
    this.borrandoUsuario = false;
    this.dialogoNuevoUsuarioVisible =false;
    this.guardandoUsuario =false;
    this.roles = [
      {id: 1, rol: "administrador"},
      {id: 2, rol: "usuario"},
      {id: 3, rol: "visor"}
    ]
  }

  ngOnInit(): void {
    this.formUsuario = this.formBuilder.group(
      {
        nombre: "",
        correo: "",
        clave: "",
        rol:  ""
      }
    );
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
    if (this.borrandoUsuario){
      return
    }
    this.borrandoUsuario = true;
    this.usuariosService.borrarUsuario(usuario).subscribe(
      {
        next: () => {
          const mensaje: Message = {
            summary: "Borrar",
            detail: `Usuario '${usuario.nombre}' borrado satisfactoriamente`,
            severity: "success"
          };
          this.mensajeService.add(mensaje);
          this.borrandoUsuario = false;
          this.cargarUsuarios();
        },
        error: (error: HttpErrorResponse) => {
          const mensaje: Message = {
            summary: "Borrar",
            detail: "Hubo un error al borrar: " + error.message,
            severity: "error"
          };
          this.borrandoUsuario = false;
          this.mensajeService.add(mensaje);
        }

      }
    );
  }

  public confirmarBorrar(usuario:Usuario, evento: Event){
    this.confirmarService.confirm({
      target: evento.target as EventTarget,
      message: `¿Quieres borrar a '${usuario.nombre}' ?`,
      icon: PrimeIcons.QUESTION,
      acceptLabel: " Borrar ",
      rejectLabel: " Cancelar ",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.borrarUsuario(usuario);

      },
      reject: () => {
        this.mensajeService.add({
          summary: "borrar",
          severity: "info",
          detail: "No se ha borrado nada",
        })
      }
    });
  }

  public obtenerEstiloPorRol(rol: string): string {
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

  public mostrarDialogoUsuario(){
    this.dialogoNuevoUsuarioVisible = true;
  }

  public ocultarDialogoUsuario(){
    this.dialogoNuevoUsuarioVisible = false;
  }

  public validarFormulario() {
    let usuario: Usuario = this.formUsuario.value;
    this.guardarUsuarioValidado(usuario);
    this.cargarUsuarios();
  }

  public guardarUsuarioValidado(usuario: Usuario) {
    this.guardandoUsuario = true;
    this.usuariosService.guardarUsuario(usuario).subscribe(
      {
        next: () => {
          this.mensajeService.add({
            summary: "Nuevo usuario",
            detail: "Se ha guardado satisfactoriamente el usuario",
            severity: "success",
            icon: "pi pi-user-plus"
          });
          this.guardandoUsuario = false;
        },
        error: (datos: HttpErrorResponse) => {
          this.mensajeService.add({
            summary: "Nuevo usuario",
            detail: "Ha habido un error" + datos.message,
            severity: "error",
            icon: "pi pi-user-plus"
          });
          this.guardandoUsuario = false
        },
        complete: ()=>{
          this.guardandoUsuario=false;
            this.ocultarDialogoUsuario();
        }
      }
    );
  }
}
