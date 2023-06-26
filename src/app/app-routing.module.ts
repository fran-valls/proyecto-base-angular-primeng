import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InicioComponent} from "./shared/components/inicio/inicio.component";
import {PageCentralesComponent} from "./centrales/components/page-centrales/page-centrales.component";
import {PageUsuariosComponent} from "./usuarios/components/page-usuarios/page-usuarios.component";

const routes: Routes = [
  {path: "", component: InicioComponent, pathMatch: "full"},
  {path: "centrales", component: PageCentralesComponent },
  {path: "usuarios", component: PageUsuariosComponent },
  {path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
