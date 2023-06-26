import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './components/nav/nav.component';
import { InicioComponent } from './components/inicio/inicio.component';
import {PrimengModule} from "../primeng/primeng.module";



@NgModule({
  declarations: [
    NavComponent,
    InicioComponent
  ],
  exports: [
    NavComponent
  ],
  imports: [
    CommonModule,
    PrimengModule
  ]
})
export class SharedModule { }
