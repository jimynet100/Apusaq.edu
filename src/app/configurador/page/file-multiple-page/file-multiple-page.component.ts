import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/security/authentication.service';
import { GridConfig } from 'src/app/shared/components/grid/model/model.grid';
import { BarButtonConfig, BarButtonComponent } from 'src/app/shared/components/bar-button/bar-button.component';
import { ConfigService } from 'src/app/shared/services/configurador/config.service';
import { NotificacionService } from 'src/app/shared/services/util/notificacion.service';
import { IFileMultiplePageComponent, FileMultiplePage, GridComp, BasePage, ExecuteQueryParam, ResultConfig, Process } from '../../model/model';
import { BasePageComponent } from '../../model/base-page-component';
import { GridConfiguradorUtil } from '../../util/grid-configurador.util';
import { GridSimpleComponent } from 'src/app/shared/components/grid/grid-simple/grid-simple.component';
import { ButtonConfig } from 'src/app/shared/model/model';

@Component({
  selector: 'app-file-multiple-page',
  templateUrl: './file-multiple-page.component.html',
  styleUrls: ['./file-multiple-page.component.sass']
})
export class FileMultiplePageComponent  extends BasePageComponent implements OnInit, IFileMultiplePageComponent {

  @ViewChild(GridSimpleComponent,{static: false}) grid: GridSimpleComponent;
  @ViewChild(BarButtonComponent,{static: false}) barButton: BarButtonComponent;
  _meta: FileMultiplePage;
  filtro: any; 
  defaultButtonConfig: BarButtonConfig; 
  defaultGridConfig: GridConfig;
  barButtonConfig: BarButtonConfig; 
  gridConfig: GridConfig;

  //property
  //filesId: string;
  //filesTotal: string;

  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router, 
    private auth: AuthenticationService, 
    private configService: ConfigService, 
    private notificacionService:NotificacionService) {
      super();
      const self = this;
      self.defaultGridConfig = <GridConfig>{
        mostrarAccionesPrimero:true,
        mostrarConsultar:true,
        mostrarEliminar:false,
        fnClickConsultar: (params) => {
          //FileUtil.donwloadFileFromUrl(self.meta.donwloadUrl + '/', params.data['name']);
          window.open(self.meta.donwloadUrl + '/' + params.data['name']);  
        },
        fnClickEliminar: (params)=>{
          let par:ExecuteQueryParam = {
            queryId: self.meta.grid.deleteQueryId,
            params: params.data,
            process: <Process>{
              successMessage: 'El archivo se eliminó correctamente',
              errorMessage:  'Problemas eliminando el archivo'
            },
            fnExito: (result:ResultConfig) => {
              //notificacionService.success("","Se eliminó el archivo correctamente");
              self.grid.search(self.filtro);
            },
            fnError: (result:ResultConfig) => {
              //self.notificacionService.error("","Problemas eliminando el archivo");
            }
          };
          self.contenedorPage.executeQuery(par);
        },
        columnsAction:[
         {
           iconClass:'fas fa-trash',
           fnMostrar: (data: any) => true,
           fnClick: (params) => {
            window.open(self.meta.donwloadUrl + '/' + params.data['name']);  
          }
         }
        ]
      };

      //console.log(self.defaultGridConfig);
  }

  ngOnInit() {
    const self = this;


  }

  get meta() {
    return this._meta;
  }

  set meta(meta: FileMultiplePage){
    const self = this;
    //debugger;

    self.defaultButtonConfig = {
      mostrarCargarServidor: true,
      fnUrlCargarServidor:function(){
        //let url:string = meta.uploadUrl;
        return meta.uploadUrl;
      },
      fnCargarServidor:function(param){
        
        if (param['success']){
          let par:ExecuteQueryParam = {
            queryId: self.meta.insertQueryId,
            params: self.contenedorPage.getPageParam(),
            data: param,
            process: <Process>{
              successMessage: 'El archivo se agregó correctamente',
              errorMessage:  'Problemas agregando el archivo'
            },
            fnExito: (result:ResultConfig) => {
                self.grid.search(self.filtro);
            },
            fnError: (result:ResultConfig) => {
            }
          };
          self.contenedorPage.executeQuery(par);
        }
        else{
          self.notificacionService.error("",param['message']);
        }
      },
      arrayButtonConfig:[
        {
          name: "cargarServidor",
          titulo: 'Adjuntar',
          tooltip: ''
        }
      ]
    };
    self.filtro = Object.assign({queryId: meta.grid.queryId}, {params: self.contenedorPage.getPageParam()});
    self.gridConfig = self.createGridConfig(meta, meta.grid);

    self.barButtonConfig = self.defaultButtonConfig;
    /*
    if (meta.form.buttons && meta.form.buttons.length>0){
      self.buttonConfig = ButtonConfiguradorUtil.createBarButtonBase(meta.form.buttons);
      let arrayButtonConfig = self.buttonConfig.arrayButtonConfig;
      let buttons = meta.form.buttons;
      for(let i=0; i<arrayButtonConfig.length; i++){
        arrayButtonConfig[i].fnClick = self.createButtonFnClick(self.contenedorPage, self, buttons[i].process);
      }
    }
    
    Object.assign(meta.buttonConfig, self.defaultButtonConfig);
    Object.assign(meta.gridConfig, self.defaultGridConfig);*/
    
    this._meta = meta;
  }



  getData(): any{
    const self = this;
    return null;
  }
  
  private createGridConfig(meta: BasePage, gridComp: GridComp): GridConfig{
    const self = this;
    if (!gridComp || gridComp.columns.length==0) return self.defaultGridConfig;
    let gridConfig = GridConfiguradorUtil.gridSimpleToGridConfigBase(gridComp);
    /*
    gridConfig.columns.forEach((columnConfig: ColumnConfig,index)=>{
      if (columnConfig['iconClass'])
        columnConfig.fnClick = self.createFunctionCellFromProcess(self, gridComp.columns[index].process)
    });*/
    return Object.assign(self.defaultGridConfig, gridConfig);
 }

/*
 _filesId: string;
 _filesTotal: string;
 get filesId(): string{
  return this._filesId;
 } 

 get filesTotal(): number {
  return (this.grid && this.grid.rowData ) ? this.grid.rowData.length : 0;
 }*/


}

