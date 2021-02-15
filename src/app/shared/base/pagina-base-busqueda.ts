import { ViewChild } from '@angular/core';
import { PaginaBaseComponent, IPaginaBaseComponent } from 'src/app/shared/base/pagina-base';
import { DynamicFormComponent } from 'src/app/shared/components/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { FormConfig } from 'src/app/shared/components/dynamic-form/models/field-config.interface';
import { GridConfig } from 'src/app/shared/components/grid/model/model.grid';
import { BarButtonConfig, BarButtonComponent } from 'src/app/shared/components/bar-button/bar-button.component';
import { GridPaginadoComponent } from '../components/grid/grid-paginado/grid-paginado.component';

export interface IPaginaBaseBusqueda extends IPaginaBaseComponent{
  form: DynamicFormComponent;
  grid: GridPaginadoComponent;
  bar: BarButtonConfig;
  buscar: (customFiltro?:any)=>boolean;
}
export function copiarTemplatePaginaBaseBusquedaComponent(selector:string){
  return {
    template: `
      <div class="card card-primary card-outline">
        <div class="card-header">
            <h5 class="m-0">{{titulo}}</h5>
        </div>
        <div class="card-body">
            <dynamic-form [config]="formConfig" #form="dynamicForm"></dynamic-form>
        </div>
        <div class="card-footer">
            <app-bar-button #barButton  [config]="buttonConfig"></app-bar-button>
        </div>
      </div>
      <app-grid [config]="gridConfig" [filtro]="filtro" ></app-grid>
    ` ,
    selector: selector
  }
}
export abstract class PaginaBaseBusquedaComponent extends PaginaBaseComponent implements IPaginaBaseBusqueda { //implements IPaginaBaseComponent 
  static TEMPLATE_URL:string='src/app/shared/components/pagina-base-busqueda/pagina-base-busqueda.component.html';

  @ViewChild(DynamicFormComponent,{static: true}) form: DynamicFormComponent;
  @ViewChild(GridPaginadoComponent,{static: true}) grid: GridPaginadoComponent;
  @ViewChild(BarButtonComponent,{static: true}) bar: BarButtonComponent;
  
  public formConfig:FormConfig;
  public gridConfig:GridConfig;
  public buttonConfig: BarButtonConfig;
  
  filtro;//quitar al mejorar cambio

  constructor() { 
    super();
    let self = this;

  } 
  
  abstract createFormConfig(pagina:IPaginaBaseBusqueda):FormConfig;
  abstract createGridConfig(pagina:IPaginaBaseBusqueda):GridConfig;
  abstract createBarButtonConfig(pagina:IPaginaBaseBusqueda):BarButtonConfig;
  
  ngOnInit2(dataSession?:any) {
    let self = this;
    let formConfig = self.createFormConfig(this);
    let gridConfig = self.createGridConfig(this);
    let buttonConfig = self.createBarButtonConfig(this);

    //default values
    if (!buttonConfig.fnBuscar){
      buttonConfig.mostrarBuscar = true;
      buttonConfig.fnBuscar = ()=> self.buscar();
    }  

    self.formConfig = formConfig;
    self.gridConfig = gridConfig;
    self.buttonConfig = buttonConfig;

    if (dataSession){
      self.form.value = dataSession;
      self.filtro = dataSession;
    }
  }

  
  buscar(customFiltro?:any){
    let self = this;
    let filtro = Object.assign((self.form.value || {}), (customFiltro || {}));
    self.saveSessionStorage(filtro);//guardamos en session
    self.grid.search(filtro);
    return true;
  };
  
  postReloadSessionStorage(value:any) {
    //debugger;
    //let self = this;
    //self.form.value = value;
    //self.buscar(value);
  }

}
