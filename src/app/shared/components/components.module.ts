import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgGridModule} from "ag-grid-angular";
import {SnotifyModule, SnotifyService, ToastDefaults} from 'ng-snotify';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
//modulos
import { DynamicFormModule } from '../components/dynamic-form/dynamic-form.module';
//componentes
import { GridPaginadoComponent } from './grid/grid-paginado/grid-paginado.component';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { GridSimpleComponent } from './grid/grid-simple/grid-simple.component';
import { BarButtonComponent } from './bar-button/bar-button.component';
import { AlertaCierreSesionComponent } from './alerta-cierre-sesion/alerta-cierre-sesion.component';
import { UpperCaseDirective } from './directives/upper-case-directive';
import { NumericEditor } from './grid/editor/numeric.editor';
import { SelectEditor } from './grid/editor/select.editor';
import { DynamicEditor } from './grid/editor/dynamic.editor';
import { DynamicContainerComponent } from './dynamic-container/dynamic-container.component';
import { JsonViewerComponent } from './json-viewer/json-viewer.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { SliderFloatingFilter } from './grid/editor/slider-floating.filter';
import { SelectFloatingFilter } from './grid/editor/select-floating.filter';
import { MultipleMatchFilter } from './grid/editor/multiple-match.filter';
import { MultipleMatchFloatingFilter } from './grid/editor/multiple-match-floating.filter';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LZStringModule, LZStringService } from 'ng-lz-string';
import { TableComponent } from './table/table.component';
import { TextMaskModule } from 'angular2-text-mask';
import { HeaderPageComponent } from './header-page/header-page.component';

defineLocale('es', esLocale); 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormModule,
    //inicio grid 
    AgGridModule.withComponents([ NumericEditor, SelectEditor, DynamicEditor, SliderFloatingFilter, SelectFloatingFilter, MultipleMatchFilter, MultipleMatchFloatingFilter ]),
    //fin grid editors
    SnotifyModule,
    NgxJsonViewerModule,
    ContextMenuModule.forRoot({useBootstrap4:true}),
    TooltipModule.forRoot(),
    
    LZStringModule,
    TextMaskModule
  ],
  declarations: [
    GridPaginadoComponent,
    NotificacionComponent,
    GridSimpleComponent,
    
    BarButtonComponent,
    AlertaCierreSesionComponent,
    UpperCaseDirective,
    //inicio grid editors
    NumericEditor,
    SelectEditor,
    DynamicEditor,
    DynamicContainerComponent,
    JsonViewerComponent,
    SliderFloatingFilter,
    SelectFloatingFilter,
    MultipleMatchFilter,
    MultipleMatchFloatingFilter,
    ContextMenuComponent,
    TableComponent,
    HeaderPageComponent
    //fin grid editors
  ],
  exports:[
    DynamicFormModule,
    TooltipModule,
    GridPaginadoComponent,
    NotificacionComponent,
    GridSimpleComponent,
    BarButtonComponent,
    AlertaCierreSesionComponent,
    UpperCaseDirective,
    //inicio grid editors
    NumericEditor,
    SelectEditor,
    DynamicEditor,
    //fin grid editors
    DynamicContainerComponent,
    ContextMenuComponent,
    TableComponent,
    HeaderPageComponent
  ],
  entryComponents: [
    AlertaCierreSesionComponent,
    SelectEditor,
    TableComponent
  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService,
    LZStringService
  ]
  
})
export class ComponentsModule { }
