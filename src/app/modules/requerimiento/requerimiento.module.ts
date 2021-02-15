import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRequerimientoComponent } from './admin-requerimiento/admin-requerimiento.component';
import { RequerimientoRoutingModule } from './requerimiento-routing.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';



@NgModule({
  declarations: [
    AdminRequerimientoComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RequerimientoRoutingModule
  ]
})
export class RequerimientoModule { }
