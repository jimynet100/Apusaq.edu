import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/security/authentication.service';
import { ClientSessionStorageService } from 'src/app/shared/services/util/client-session-storage.service';
import { DynamicFormComponent } from 'src/app/shared/components/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { GridPaginadoComponent } from 'src/app/shared/components/grid/grid-paginado/grid-paginado.component';
import { GridConfig, ColumnConfig } from 'src/app/shared/components/grid/model/model.grid';
import { BarButtonConfig, BarButtonComponent } from 'src/app/shared/components/bar-button/bar-button.component';
import { ConfigService } from 'src/app/shared/services/configurador/config.service';
import { NotificacionService } from 'src/app/shared/services/util/notificacion.service';
import { ResultConfig, ISearchPageComponent, ExecuteQueryParam, GridColumn, SearchPage, BasePage, FormComp, Button, Process, GridComp } from '../../model/model';
import { BasePageComponent } from '../../model/base-page-component';
import { ExcelConfig, ExcelSheetConfig, ExcelSectionConfig, ExcelReportUtil } from 'src/app/shared/util/excelutil';
import { Column } from 'src/app/shared/model/model';
import { FormConfiguradorUtil } from '../../util/form-configurador.util';
import { FormConfig } from 'src/app/shared/components/dynamic-form/models/field-config.interface';
import { GridConfiguradorUtil } from '../../util/grid-configurador.util';
import { ButtonConfiguradorUtil } from '../../util/button-configurador.util';
import { ProcessConfiguradorUtil } from '../../util/process-configurador.util';

@Component({ 
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.sass']
})
export class SearchPageComponent  extends BasePageComponent implements OnInit, ISearchPageComponent {

  @ViewChild(DynamicFormComponent,{static: false}) form: DynamicFormComponent;
  @ViewChild(GridPaginadoComponent,{static: false}) grid: GridPaginadoComponent;
  @ViewChild(BarButtonComponent,{static: false}) barButton: BarButtonComponent;
  _meta: SearchPage;
  filtro: any;
  barButtonConfig: BarButtonConfig;
  gridConfig: GridConfig;
  formConfig: FormConfig;

  defaultBarButtonConfig: BarButtonConfig;
  defaultFormConfig: FormConfig;
  defaultGridConfig: GridConfig;

  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router, 
    private auth: AuthenticationService, 
    private configService: ConfigService, 
    private notificacionService:NotificacionService,
    private clientSessionStorageService: ClientSessionStorageService
    ) {
      super();
      const self = this;
      self.defaultGridConfig = <GridConfig>{};
      self.defaultFormConfig = <FormConfig>{};
      self.defaultBarButtonConfig = {
        mostrarBuscar : true,
        mostrarExportarExcel : true,
        fnBuscar:() => { 
          self.grid.search();
          self.clientSessionStorageService.saveSessionStorage("demo", self.form.value);
        },
        fnExportarExcel: () => {
          let par:ExecuteQueryParam = {
            queryId: self.meta.grid.queryId,
            data: self.getFilter(),
            fnExito: (result:ResultConfig) => {
              
              if (result.list!=null && result.list.length>0){
                self.exportarExcel(self.meta, result.list);
              }
              else{
                self.notificacionService.info("Info","No existen datos para exportar");
              }
            }
          };
          self.contenedorPage.executeQuery(par);
        }
      };
  }

  ngOnInit() {
    const self = this;


  }

  get meta() {
    return this._meta;
  }


  set meta(meta: SearchPage){
    const self = this;
    //self.filtro = {queryId: meta.grid.queryId};
    self.gridConfig = self.createGridConfig(meta, meta.grid);
    self.formConfig = self.createFormConfig(meta, meta.form);
    self.barButtonConfig = self.createBarButtonConfig(meta.form.buttons);
    this._meta = meta;
  }

  private getFilter(){
    const self = this;
    let filterOriginal = self.form?self.form.value:{};
    let filter = {};
    let keys = Object.keys(filterOriginal);
    keys.forEach(key => {
      if (filterOriginal[key])
        filter[key] = filterOriginal[key];
    });
    return filter;    
  }

  getData(): any{
    const self = this;
    return null;
  }

  private createGridConfig(meta: SearchPage, gridComp: GridComp): GridConfig{
    const self = this;
    if (!gridComp || gridComp.columns.length==0) return self.defaultGridConfig;
    let gridConfig = GridConfiguradorUtil.gridToGridConfigBase(gridComp);
    gridConfig.fnCreateFilter = function(config: GridConfig){
      return {queryId: meta.grid.queryId, mapValue: self.getFilter()};
    };
    gridConfig.columns.forEach((columnConfig: ColumnConfig,index)=>{
      if (columnConfig['iconClass'])
        columnConfig.fnClick = self.createFunctionCellFromProcess(self, gridComp.columns[index].process)
    });
    return Object.assign(self.defaultGridConfig, gridConfig);
 }


  private createFormConfig(meta: BasePage, formComp: FormComp): FormConfig{
    const self = this;
    if (!formComp) return self.defaultFormConfig;
    let formConfig = FormConfiguradorUtil.createFormConfigBase(formComp);
    //asignar data inicial
    formConfig.value = Object.assign(meta.initialValue || {}, self.clientSessionStorageService.getSessionStorage("demo"));
    return Object.assign(self.defaultFormConfig, formConfig);
 }

 private createBarButtonConfig(buttons: Button[]): BarButtonConfig{
   const self = this;
   if (!buttons || buttons.length==0) return self.defaultBarButtonConfig;
   let barButtonConfig = ButtonConfiguradorUtil.createBarButtonConfigBase(buttons);
   barButtonConfig.arrayButtonConfig.forEach((buttonConfig,index)=>{
     if (buttons[index].process)/* solo si es distinto de nulo */
      buttonConfig.fnClick = self.createFunctionButtonFromProcess(self, buttons[index].process)
   });
   return Object.assign(self.defaultBarButtonConfig, barButtonConfig);
 } 

 private createFunctionButtonFromProcess(component: ISearchPageComponent, process: Process){
   return ProcessConfiguradorUtil.createFunctionFromProcess(
     component.contenedorPage, 
     process,
       ()=>{
         return component.form.value;
       },
       ()=>{
         if (component.form){
           component.form.validate();
           return component.form.valid();
         } 
         return true;
       }
     );
 }

 private createFunctionCellFromProcess(component: ISearchPageComponent, process: Process){
  return ProcessConfiguradorUtil.createFunctionFromProcess(
    component.contenedorPage, 
    process,
      (paramData?:any)=>{
        return paramData.data;
      },
      null
    );
}

 private exportarExcel(meta: SearchPage, data: any[]){
    let arrayColumn:Column[] = [];
    let col:Column[] = meta.grid.columns;
    /*
    meta.grid.columns.forEach((col:GridColumn) =>{
      if (col.label && col.name){
        arrayColumn.push({
          name: col.name,
          label: col.label,
          width: col.width/5
        });
      }
    });
    */
   //console.log(col);

    arrayColumn.push({
      name: col[2].name,
      label: "RQ",
      width: col[2].width/5,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    },{
      name: col[11].name,
      label: "Fecha de Registro",
      width: col[11].width/5,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    },{
      name: col[12].name,
      label: "Antigüedad",
      width: col[12].width/5,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    },{
      name: col[4].name,
      label: "Tipo",
      width: col[4].width/5,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    },{
      name: col[5].name,
      label: "Sub Tipo",
      width: col[5].width/5,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    },{
      name: col[7].name,
      label: "Nombre Requerimiento",
      width: col[7].width/5,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    },{
      name: "descripcion",
      label: "Descripción",
      width: 40,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    },{
      name: col[6].name,
      label: "Negocio",
      width: col[6].width/5,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    },{
      name: "gestion",
      label: "Gestión",
      width: 40,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    },{
      name: "segmento",
      label: "Segmento",
      width: 40,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    },{
      name: "producto",
      label: "Producto",
      width: 40,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    },{
      name: col[9].name,
      label: "Responsable TDP",
      width: col[9].width/5,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    },{
      name: col[10].name,
      label: "AnalistaQA",
      width: col[10].width/5,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    },{
      name: "areaSolicitante",
      label: "Área Solicitante",
      width: 40,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    },{
      name: col[8].name,
      label: "Solicitante",
      width: col[8].width/5,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    },{
      name: "responsableSegmentoCorreo",
      label: "Solicitante Correo",
      width: 40,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    },{
      name: "responsableSegmentoTelefono",
      label: "Solicitante Telefono",
      width: 40,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    },{
      name: "jefeArea",
      label: "Jefe/Gerente",
      width: 40,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    },{
      name: "estado",
      label: "Estado",
      width: 40,
      headerStyle: {
        backgroundColor:"#4f81bd",
        color:"#ffffff",
        border: 'true'
      },
      style: {
        border: 'true'
      }
    });

    let section: ExcelSectionConfig = {
      columns: arrayColumn,
      data: data
    };

    let sheet:ExcelSheetConfig = {
      tabTitle:'Datos',
      sections:[section]
    };

    let config:ExcelConfig = {
      preName:'reporte_',
      sheets:[sheet]
    } 

    ExcelReportUtil.export(config);
  }

}

