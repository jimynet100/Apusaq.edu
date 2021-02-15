import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { AuthGuard } from '../shared/services/security/auth.guard';
import { PruebaComponent } from './prueba/prueba.component';
import { InternalContenedorComponent } from './internal-contenedor/internal-contenedor.component';
import { ExternalContenedorComponent } from './external-contenedor/external-contenedor.component';

const routes: Routes = [
  
    { 
      path: '', 
      component: DefaultLayoutComponent,
      data: {
        title: 'Home'
      },
    canActivate: [AuthGuard],
    children: [
      {  path:'requerimiento',loadChildren: () => import('../modules/requerimiento/requerimiento.module').then(m => m.RequerimientoModule) },
      {  path:'c',loadChildren: () => import('../configurador/configurador.module').then(m => m.ConfiguradorModule), data: { preload: true } },
      { 
        path: 'd/prueba', 
        component: PruebaComponent,
        data: {
          title: 'Prueba'
        }
      },
      {  path:'int', children:[
          { path: '**', component: InternalContenedorComponent }
        ]
      },
      {  path:'ext', children:[
          { path: '**', component: ExternalContenedorComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
