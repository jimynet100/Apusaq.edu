import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './principal/login/login.component';
import { RnotasComponent } from './principal/rnotas/rnotas.component';
import { Error404Component } from './principal/error404/error404.component';
import { Error500Component } from './principal/error500/error500.component';

const routes: Routes = [
  /*
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },*/
  /*
  ,*/
  { path: 'login', component:LoginComponent},
  { path: 'rnotas', component:RnotasComponent},
  { path: '404', component:Error404Component},
  { path: '500', component:Error500Component},
  { path: '', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule), data: { preload: true } }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
