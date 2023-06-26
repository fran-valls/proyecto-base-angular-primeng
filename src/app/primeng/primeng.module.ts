import { NgModule } from '@angular/core';

import {RippleModule} from "primeng/ripple";
import {MenubarModule} from "primeng/menubar";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {TableModule} from "primeng/table";
import {ProgressBarModule} from "primeng/progressbar";
import {TagModule} from "primeng/tag";
import {ToastModule} from "primeng/toast";



@NgModule({

  // Aquí solo exportaciones!!!!

  exports: [
    RippleModule,
    MenubarModule,
    ButtonModule,
    CardModule,
    TableModule,
    ProgressBarModule,
    TagModule,
    ToastModule
  ]


})
export class PrimengModule { }
