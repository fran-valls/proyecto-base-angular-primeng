import {Component, OnInit} from '@angular/core';
import {UsuariosService} from "../../../shared/services/usuarios.service";
import {Usuario} from "../../../shared/models/usuario.model";
import {HttpErrorResponse} from "@angular/common/http";
import {ConfirmationService, Message, MessageService, PrimeIcons} from "primeng/api";
import {Rol} from "../../../shared/models/rol.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-page-usuarios',
  templateUrl: './page-usuarios.component.html',
  styleUrls: ['./page-usuarios.component.css'],
  providers: [
    MessageService,
    ConfirmationService
  ]
})
export class PageUsuariosComponent implements OnInit{

  // Datos de la página
  public usuarios: Usuario[];
  public roles: Rol[];

  // Variables de estado de un proceso
  public cargandoUsuarios: boolean;
  public borrandoUsuario: boolean;
  public guardandoUsuario: boolean;
  public estoyEditando: boolean;

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
    this.usuarios = [];
    this.roles = [
      {id: 1, rol: "administrador"},
      {id: 2, rol: "usuario"},
      {id: 3, rol: "visor"}
    ];
    this.cargandoUsuarios = false;
    this.borrandoUsuario = false;
    this.guardandoUsuario = false;
    this.dialogoNuevoUsuarioVisible = false;
    this.estoyEditando = false;
  }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarUsuarios();
  }

  public inicializarFormulario() {
    const regexEmail :string = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
    const claveDigitosMax: number = 8;
    const regexClave :string = `^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{${claveDigitosMax},}$`;
    this.formUsuario = this.formBuilder.group(
      {
        id    : [0, []],
        nombre: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        correo: ["", [Validators.required, Validators.pattern(regexEmail)]],
        clave:  ["", [Validators.required, Validators.pattern(regexClave)]],
        rol:    ["", [Validators.required]]
      }
    );
  }

  public cargarUsuarios() {
    this.cargandoUsuarios = true; // Empezamos a cargar...
    this.usuariosService.obtenerTodosUsuarios().subscribe(
      {
        next: (datos: Usuario[]) => {
          console.log("Han llegado los datos ", datos);
          this.usuarios = datos;
          this.cargandoUsuarios = false; // Ya hemos terminado de cargar...
        },
        error: (error: HttpErrorResponse) => {
          this.mensajeService.add({
            summary: "Usuarios",
            detail: "Hubo un error al obtener los usuarios. " + error.message,
            severity: "error",
            sticky: true
          })
          this.cargandoUsuarios = false; // Ya hemos terminado de cargar...
        }
      }
    );
  }

  public borrarUsuario(usuario: Usuario) {
    // Si estamos en proceso de borrar el usuario, nos salimos de la función (esto es porque aunque esté el botón deshabilitado, sigue procesando los clicks de borrar, y aunque no borre nada, salen mensajes de error)
    if (this.borrandoUsuario) {
      return
    }

    // Y por aquí continuamos...
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
        error: (datos: HttpErrorResponse) => {
          const mensaje: Message = {
            summary: "Borrar",
            detail: "Hubo un error al borrar. " + datos.message,
            severity: "error",
            sticky: true

          };
          this.borrandoUsuario = false;
          this.mensajeService.add(mensaje);
        }
      }
    );
  }

  public confirmarBorrar(usuario: Usuario, evento: Event) {
    this.confirmarService.confirm({
      target: evento.target as EventTarget,
      message: `¿Quieres borrar a '${usuario.nombre}' ?`,
      icon: PrimeIcons.QUESTION,
      // acceptIcon: PrimeIcons.CHECK_SQUARE,
      // rejectIcon: PrimeIcons.TIMES,
      acceptLabel: "Borrar",
      rejectLabel: "Cancelar",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        //Este método borra el usuario, mostrando sus correspondientes toast
        this.borrarUsuario(usuario);
      },
      reject: () => {
        this.mensajeService.add({
          summary: "Cancelado",
          severity: "info",
          detail: "Operación cancelada. No se ha borrado nada.",
        });
      },

    });
  }

  public obtenerEstiloPorRol(rol: string): string {
    switch (rol) {
      case "administrador":
        return "success";
      case "usuario":
        return "primary";
      case "visor":
        return "warning";
      default:
        return "info";
    }
  }

  public mostrarDialogoUsuario(usuarioEditar?: Usuario) { // Con '?' decimos que el parámetro es opcional
    // Decidimos si estamos editando o no, según si llega o nó un usuario
    this.estoyEditando = usuarioEditar != undefined;

    if(this.estoyEditando){
      this.formUsuario.reset(usuarioEditar);
    } else {
      this.formUsuario.reset();
    }
    this.dialogoNuevoUsuarioVisible = true;
  }

  public ocultarDialogoUsuario() {
    this.dialogoNuevoUsuarioVisible = false;
  }

  public validarFormulario()  {
    let usuario : Usuario = this.formUsuario.value;
    // Así se añaden atributos a un JSON. Usamos el operador spread '...'

    // Añadimos el atributo admin

    usuario = {
      ...usuario,
      admin: (usuario.rol.id === 1), // el rol con id 1, es el administrador
    };

    // Así se eliminan atributos a un JSON
    //delete usuario.admin; // así se borra el atributo admin del objeto usuario

    // Guardamos directamente, porque el botón para guardar solo lo habilitamos cuando el formulario es válido
    if(this.estoyEditando){
      this.modificarUsuario(usuario);
    } else {
      delete usuario.id; // Borramos la id, porque para guardar no necesitamos el atributo id (se podría poner a cero o dejarla a null)
      this.guardarUsuarioValidado(usuario);
    }
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
          this.ocultarDialogoUsuario();
        },
        error: (datos: HttpErrorResponse) => {
          this.mensajeService.add({
            summary: "Nuevo usuario",
            detail: "Ha habido un error. " + datos.message,
            severity: "error",
            sticky: true,
            icon: "pi pi-user-plus"
          });
          this.guardandoUsuario = false;
          this.ocultarDialogoUsuario();
        }
      }
    );
  }

  public esCampoInvalido(campo: string) : boolean {
    return this.formUsuario.controls[campo].invalid && this.formUsuario.controls[campo].touched;
  }

  public marcarTodosLosCampos() {
    //Al ponerlos todos como marcados, me mostrará directamente todos los errores
    this.formUsuario.markAllAsTouched();
  }

  public modificarUsuario(usuario: Usuario) {
    this.guardandoUsuario = true;
    this.usuariosService.editarUsuario(usuario).subscribe(
      {
        next: (datos: Usuario) => {
          this.mensajeService.add({
            summary: "Editar",
            detail: `Usuario actualizado correctamente `,
            severity: "success"
          });
          this.guardandoUsuario = false;
          this.ocultarDialogoUsuario();
        },
        error:(datos: HttpErrorResponse) => {
          this.mensajeService.add({
            summary: "Editar",
            detail: `Error al editar. ${datos.message}`,
            severity: "error",
            sticky: true
          });
          this.guardandoUsuario = false;
          this.ocultarDialogoUsuario();
        }
      }
    );
  }
}
