import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenedorPageComponent } from './contenedor-page/contenedor-page.component';
import { ConfiguradorRoutingModule } from './configurador-routing.module';
import { ComponentsModule } from '../shared/components/components.module';
import { SearchPageComponent } from './page/search-page/search-page.component';
import { DetailPageComponent } from './page/detail-page/detail-page.component';
import { ListDetailPageComponent } from './page/list-detail-page/list-detail-page.component';
import { ErrorPageComponent } from './page/error-page/error-page.component';
import { FileMultiplePageComponent } from './page/file-multiple-page/file-multiple-page.component';
import { ListPageComponent } from './page/list-page/list-page.component';
import { TablePageComponent } from './page/table-page/table-page.component';




@NgModule({
  declarations: [
    ContenedorPageComponent,
    SearchPageComponent,
    DetailPageComponent,
    ListDetailPageComponent,
    ErrorPageComponent,
    FileMultiplePageComponent,
    ListPageComponent,
    TablePageComponent
  ],
  imports: [
    CommonModule,
    ConfiguradorRoutingModule,
    ComponentsModule
  ],
  entryComponents:[
    ContenedorPageComponent,
    SearchPageComponent,
    DetailPageComponent,
    ListDetailPageComponent,
    FileMultiplePageComponent,
    ListPageComponent,
    TablePageComponent
  ]
})
export class ConfiguradorModule { }
