import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/security/authentication.service';
import { DynamicFormComponent } from 'src/app/shared/components/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { GridPaginadoComponent } from 'src/app/shared/components/grid/grid-paginado/grid-paginado.component';
import { GridConfig, ColumnConfig } from 'src/app/shared/components/grid/model/model.grid';
import { BarButtonConfig, BarButtonComponent } from 'src/app/shared/components/bar-button/bar-button.component';
import { FormConfig } from 'src/app/shared/components/dynamic-form/models/field-config.interface';
import { ConfigService } from 'src/app/shared/services/configurador/config.service';
import { NotificacionService } from 'src/app/shared/services/util/notificacion.service';
import { ResultConfig, IListDetailPageComponent, ExecuteQueryParam, ListDetailPage } from '../../model/model';
import { BasePageComponent } from '../../model/base-page-component';
import { ButtonConfiguradorUtil } from '../../util/button-configurador.util';
import { FormConfiguradorUtil } from '../../util/form-configurador.util';
import { GridConfiguradorUtil } from '../../util/grid-configurador.util';
import { ObjectConfiguradorUtil } from '../../util/object-configurador.util';


@Component({
  selector: 'app-list-detail-page',
  templateUrl: './list-detail-page.component.html',
  styleUrls: ['./list-detail-page.component.sass']
})
export class ListDetailPageComponent  extends BasePageComponent implements OnInit, IListDetailPageComponent {

  @ViewChild(DynamicFormComponent,{static: false}) form: DynamicFormComponent;
  @ViewChild(GridPaginadoComponent,{static: false}) grid: GridPaginadoComponent;
  @ViewChild(BarButtonComponent,{static: false}) barButton: BarButtonComponent;
  _meta: ListDetailPage;
  filtro: any;
  barButtonConfig: BarButtonConfig;
  gridConfig: GridConfig;
  formConfig: FormConfig;

  defaultBarButtonConfig: BarButtonConfig;
  defaultGridConfig: GridConfig;
  
  modeInsert:boolean = true;
  modeUpdate:boolean = false;

  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router, 
    private auth: AuthenticationService, 
    private configService: ConfigService, 
    private notificacionService:NotificacionService) {
      super();
      const self = this;

      self.defaultGridConfig = <GridConfig>{
        mostrarAccionesPrimero: true,
        mostrarEditar: true,
        mostrarEliminar: true,
        fnClickEditar: (params)=>{
          let par:ExecuteQueryParam = {
            queryId: self.meta.form.dataQueryId,
            params: ObjectConfiguradorUtil.getParamByListName(params.data,self.meta.form.dataParams),
            fnExito: (result:ResultConfig) => {
              self.form.value = result.mapValue;
              self.modeUpdate = true;
              self.modeInsert = false;
            }
          };
          self.contenedorPage.executeQuery(par);
        },
        fnClickEliminar: (params)=>{
          let par:ExecuteQueryParam = {
            queryId: self.meta.form.deleteQueryId,
            params: ObjectConfiguradorUtil.getParamByListName(params.data,self.meta.form.dataParams),
            fnExito: (result:ResultConfig) => {
              self.form.reset();
              self.modeUpdate = false;
              self.modeInsert = true;
              self.grid.search(self.filtro);
            }
          };
          self.contenedorPage.executeQuery(par);
        }
      };


      self.defaultBarButtonConfig = {
        mostrarAgregar : true,
        mostrarModificar : true,
        mostrarCancelar : true,
        fnAgregar: () => {
          if (self.form.valid()){
            let par:ExecuteQueryParam = {
              queryId: self.meta.form.insertQueryId,
              data: self.form.value,
              fnExito: (result:ResultConfig) => {
                self.form.reset();
                self.grid.search(self.filtro);
              }
            };
            self.contenedorPage.executeQuery(par);
          }
        },
        fnModificar: () => {
          if (self.form.valid()){
            let par:ExecuteQueryParam = {
              queryId: self.meta.form.updateQueryId,
              data: self.form.value,
              fnExito: (result:ResultConfig) => {
                self.form.reset();
                self.modeInsert = true;
                self.modeUpdate = false;
                self.grid.search(self.filtro);
              }
            };
            self.contenedorPage.executeQuery(par);
          }
        },
        fnCancelar: () => {
          self.form.reset();
          self.modeInsert = true;
          self.modeUpdate = false;
        },
        fnIsVisibleAgregar: () => {
          return self.modeInsert;
        },
        fnIsVisibleModificar: () => {
          return self.modeUpdate;
        },
        fnIsDisabledAgregar: () =>{
          if (self.form && self.form.valid)
            return !self.form.valid();
          return true;
        },
        fnIsDisabledModificar: () =>{
          if (self.form && self.form.valid)
            return !self.form.valid();
          return true;
        }
      };
  }
  /*
  private getParam(data:any, lstParamName: string[]){
    let result = {};
    lstParamName.forEach(name => {
      result[name] = data[name];
    });
    return result;
  }*/

  ngOnInit() {
    const self = this;
  }


  getData(): any{
    const self = this;
    return null;
  }



  get meta() {
    return this._meta;
  }
  
  set meta(meta: ListDetailPage){
    const self = this;
    self.barButtonConfig = ButtonConfiguradorUtil.createBarButtonConfigBase(meta.form.buttons);
    self.formConfig = FormConfiguradorUtil.createFormConfigBase(meta.form);
    self.gridConfig = GridConfiguradorUtil.gridToGridConfigBase(meta.grid);
    self.filtro = {queryId: meta.grid.queryId}

    self.barButtonConfig = Object.assign(self.barButtonConfig, self.defaultBarButtonConfig);
    self.gridConfig = Object.assign(self.defaultGridConfig, self.gridConfig);
    this._meta = meta;
  }






}

