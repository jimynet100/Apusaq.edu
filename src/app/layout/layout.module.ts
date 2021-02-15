import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule } from '@coreui/angular';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RouterModule } from '@angular/router';
import { InternalContenedorComponent } from './internal-contenedor/internal-contenedor.component';
import { ExternalContenedorComponent } from './external-contenedor/external-contenedor.component';
import { PipeModule } from '../shared/pipes/pipe.module';
import { PruebaComponent } from './prueba/prueba.component';

@NgModule({
  declarations: [
    DefaultLayoutComponent,
    InternalContenedorComponent,
    ExternalContenedorComponent,
    PruebaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    RouterModule,
    LayoutRoutingModule,
    PipeModule
  ]
})
export class LayoutModule { 
}
