import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminRequerimientoComponent } from './admin-requerimiento/admin-requerimiento.component';

const routes: Routes = [
  { 
    path: '', 
    children: [
      {  path:'admin-requerimiento2', component: AdminRequerimientoComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequerimientoRoutingModule { }
