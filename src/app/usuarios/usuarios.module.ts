import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageUsuariosComponent } from './components/page-usuarios/page-usuarios.component';
import {PrimengModule} from "../primeng/primeng.module";



@NgModule({
  declarations: [
    PageUsuariosComponent
  ],
  imports: [
    CommonModule,
    PrimengModule
  ]
})
export class UsuariosModule { }
