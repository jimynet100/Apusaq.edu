import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
//models
import {ResultadoPaginado,GridConfig,GridPaginadoBaseConfig,GridColumnAction, ColumnDefault, ColumnConfig, ColumnTipo} from 'src/app/shared/components/grid/model/model.grid'
import { ObjectUtil } from '../../../util/objectutil';
import { AgGridNg2 } from 'ag-grid-angular';
import { NotificacionService } from 'src/app/shared/services/util/notificacion.service';
import { StringUtil } from 'src/app/shared/util/stringutil';
import { ContextMenuService, ContextMenuComponent } from 'ngx-contextmenu';
import { OptionActionContext } from '../model/model.grid';
import { GridApi, RowNode } from 'ag-grid-community';


const ARRAY_COLUMN_CONFIG_BASE:{[key: string]: ColumnConfig;} = {
      'basica' : 
      {   
        name:ColumnDefault.basica,
        headerName: "",
        width: 80,
        headerTooltip:"",
      },
      'checkbox' : 
      { 
        name:ColumnDefault.checkbox,
        headerName: "",
        width: 40,
        headerCheckboxSelection:true,
        checkboxSelection :true 
      },
      'orden' : 
      {  
        name:ColumnDefault.orden,
        headerName: "#",
        //headerClass:"fa fa-hashtag",
        width: 60,
        headerTooltip:"Orden",
        //valueGetter: "node.id",
        pinned: 'left',
        filter: false,
        suppressMenu: true,
        floatingFilterComponentParams:{
          suppressFilterButton:true
        }
      },
      'consultar' : 
      { 
        tipo:ColumnTipo.Accion,
        orden:3,
        name:ColumnDefault.consultar,
        width: 40,
        headerClass:"fas fa-download",
        headerTooltip:"Descargar",
        html:'<i title="Descargar" class="search-icon fas fa-download"></i>' 
      },
      'editar' : 
      { 
        tipo:ColumnTipo.Accion,
        orden:2,
        name:ColumnDefault.editar,
        width: 40,
        headerTooltip:"Editar",
        headerClass:"fas fa-edit",
        html:'<i title="Editar" class="edit-icon fas fa-edit"></i>' 
      },
      'eliminar' : //<i class="fas fa-trash-alt"></i>
      { 
        tipo:ColumnTipo.Accion,
        orden:1,
        name:ColumnDefault.eliminar,
        width: 40,
        headerClass:"fas fa-trash-alt",
        headerTooltip:"Eliminar",
        html:'<i title="Eliminar" class="delete-icon fas fa-trash-alt"></i>',
        //html:'<a width="30px" class="btn btn-danger" href="" aria-label="Delete"><i class="fa fa-trash-o" aria-hidden="true"></i></a>',
        //html:'<a class="text-danger"><i title="Eliminar" class="fa fa-minus-circle" style="cursor: pointer;"></i></a>',
        msgConfirmar:'¿Esta seguro de eliminar el registro?' 
      }
};

export abstract class  GridBase  implements OnInit, OnChanges {
  @ViewChild('agGrid',{static: true}) protected agGrid: AgGridNg2;
  @ViewChild(ContextMenuComponent,{static: true}) public contextMenu: ContextMenuComponent;
  public arrayColumnConfig: ColumnConfig[];
  rowData=[];
  @Input() config: GridConfig;
  _filtro: any={};
  @Input() set filtro(value){
    this._filtro = value;
  }
  get filtro(){
    return this._filtro;
  }

  @Output() ordenClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() eliminarClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() consultarClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() editarClick: EventEmitter<any> = new EventEmitter<any>();
  public gridApi:GridApi;
  public configBase:GridPaginadoBaseConfig;

  protected fnCreateCellRenderer(fn:any,siHtml:string,noHtml:string){
    if (fn!=null){
      return (param):string=>{
        if (fn(param)){
          return siHtml;
        }
        else{
          return noHtml;
        }
      };
    }
    return (param):string=>{
      return siHtml;
    }; 
  }

  constructor(public notificacionService:NotificacionService, public contextMenuService: ContextMenuService) {
    let self = this;
    let config = <GridPaginadoBaseConfig>{
      rowNodeOrdenName: "orden___",
      rowNodeIdName: "id",
      rowSelection : "multiple",
      rowModelType : "infinite",
      cacheOverflowSize : 2,
      maxConcurrentDatasourceRequests : 2,
      infiniteInitialRowCount : 1,
      maxBlocksInCache : 2,
      paginationPageSize : 10,
      cacheBlockSize : 10,
      overlayLoadingTemplate : '<span class="ag-overlay-loading-center">Por favor espere mientras se realiza la búsqueda</span>',
      overlayNoRowsTemplate :  "<span style=\"padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;\">No se encontraron resultados</span>",
      defaultColDef : {
          sortable: false,
          suppressMenu: true,
          filter: false,
          resizable:true
       }, 
      getRowNodeId : function(item) {
        return item[self.configBase.rowNodeIdName];
      }
      
    };
    this.configBase = config;
  }

  private procesarColumnaDefaultDesdeConfig(gridConfig:GridConfig, name:string):ColumnConfig{
    let self = this;
    let temp:ColumnConfig =  ARRAY_COLUMN_CONFIG_BASE[name];
    if (temp){
      let nameFirstUpperCase = StringUtil.firstLetterToUpperCase(name);
      if (gridConfig["mostrar" + nameFirstUpperCase] || gridConfig["fnMostrar" + nameFirstUpperCase]){
        let columnConfig:ColumnConfig = ObjectUtil.copiarObjPrimerNivel(temp);
        columnConfig.mostrar = gridConfig["mostrar" + nameFirstUpperCase];
        columnConfig.fnMostrar = gridConfig["fnMostrar" + nameFirstUpperCase];
        columnConfig.fnClick = gridConfig['fnClick' + nameFirstUpperCase];
        columnConfig.mostrarConfirmar = gridConfig['mostrarConfirmar' + nameFirstUpperCase];
        if (columnConfig.html){
          columnConfig['cellRenderer'] = self.fnCreateCellRenderer(columnConfig.fnMostrar,columnConfig.html,null);
        }
        return columnConfig;
      }
    }
    return null;
  }

  protected createColumns(gridConfig:GridConfig, columnsBase:ColumnConfig[]):ColumnConfig[]{
    let self = this;
    //debugger;
    let map = new Map<string, ColumnConfig>();
    let arrayColumnConfig:ColumnConfig[] = [...columnsBase];
    let arrayColumnAccionConfig:ColumnConfig[];
    Object.keys(gridConfig).forEach(key => {
      let name = self.getNameFirstLowerCase(key);
      if (ARRAY_COLUMN_CONFIG_BASE[name] && ARRAY_COLUMN_CONFIG_BASE[name].tipo == ColumnTipo.Accion){
        if (!map.has(name)){
          let button = self.procesarColumnaDefaultDesdeConfig(gridConfig, name);
          if (button){
            map.set(name,button);
          }
         
        }
      }
    });

    arrayColumnAccionConfig = Array.from( map.values() );
    if (arrayColumnAccionConfig.length>0){
      arrayColumnAccionConfig.sort((a: ColumnConfig, b: ColumnConfig) => {
        if (a.orden && b.orden)
          return a.orden - b.orden;
        else{
          return -1;
        }
      });
      if (gridConfig.mostrarAccionesPrimero){
        arrayColumnConfig.unshift(...arrayColumnAccionConfig);
      }
      else{
        arrayColumnConfig.push(...arrayColumnAccionConfig);
      }
    }
   
    if (gridConfig.mostrarOrden){
      
      let col = self.procesarColumnaDefaultDesdeConfig(gridConfig,ColumnDefault.orden);// ARRAY_COLUMN_CONFIG_BASE.orden;
      col.field = gridConfig.rowNodeOrdenName || self.configBase.rowNodeOrdenName;
      if (gridConfig.cellStyleOrden){
        col['cellStyle'] = gridConfig.cellStyleOrden;
      }
      arrayColumnConfig.unshift(col);
    }
    if (gridConfig.mostrarCheckbox){
      //let col = self.procesarColumnaDefaultDesdeConfig(gridConfig,ColumnDefault.checkbox);
      let col = Object.assign({},ARRAY_COLUMN_CONFIG_BASE.checkbox);
      col.checkboxSelection = gridConfig.fnMostrarCheckbox ? gridConfig.fnMostrarCheckbox : true;
      arrayColumnConfig.unshift(col);
    }

    arrayColumnConfig.forEach(col => {
      if (col instanceof GridColumnAction) {
        col['cellRenderer'] = this.fnCreateCellRenderer(col.fnMostrar,col.html,null);
      }
      else{
        col.resizable = true;
      }
    });
    //debugger;
    return arrayColumnConfig;
  }

  getNameFirstLowerCase(str){
    if (str.indexOf("mostrarConfirmar")>-1){
      return StringUtil.firstLetterToLowerCase(str.substring("mostrarConfirmar".length,str.length));
    }
    else if (str.indexOf("mostrar")>-1){
      return StringUtil.firstLetterToLowerCase(str.substring("mostrar".length,str.length));
    }
    else if (str.indexOf("fnMostrar")>-1){
      return StringUtil.firstLetterToLowerCase(str.substring("fnMostrar".length,str.length));
    } 
    return null;
  }//

  iniciarHijo(config:GridConfig){

  }

  onGridReady(params) {
    //console.log('onGridReady');
    this.gridApi = params.api;
    this.configBase.gridColumnApi = params.columnApi;
    this.gridApi.doLayout();
    //params.api.sizeColumnsToFit();
    this.primerSearch();
  }

  private fnClick(columnConfig:ColumnConfig, params:any){
    let self = this;
    if (columnConfig.fnClick){
      columnConfig.fnClick(params);
    }
    else if (self[columnConfig.name + 'Click']){
      self[columnConfig.name + 'Click'].emit(params);
    }
  }

  onCellClicked(params){
    let self = this;
    let columnConfig = <ColumnConfig>params.colDef;
    if (!columnConfig.fnMostrar ||  columnConfig.fnMostrar(params)){
      if (columnConfig.mostrarConfirmar){
        self.notificacionService.confirm('', columnConfig.msgConfirmar, function(){
            self.fnClick(columnConfig, params);
        });
      }
      else{
        self.fnClick(columnConfig, params);
      }
    }
  }

  onCellDoubleClicked(params){
    let self = this;
    if(self.config.fnDoubleClick){
      self.config.fnDoubleClick(params);
    }
  }

  onCellContextMenu(params){
    let self = this;
    let colDef = params.colDef;
    if (colDef && colDef.fnCellContextMenu)
    {
      let event = params.event;
      this.contextMenuService.show.next({
        anchorElement: event.target,
        // Optional - if unspecified, all context menu components will open
        contextMenu: this.contextMenu,
        event: <any>event,
        item: params,
      });
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private fnCellContextMenu(columnConfig:ColumnConfig, params:any, optionAction:OptionActionContext){
    let self = this;
    if (columnConfig.fnCellContextMenu){
      columnConfig.fnCellContextMenu(params, optionAction);
    }
  }

  openContextMenu(param){
    //console.log(param);
  }
  closeContextMenu(param){
    //console.log(param);
  }

  clickItemContextMenu(optionAction:OptionActionContext,paramsContextMenu){
    //console.log('clickItemContextMenu',paramsContextMenu);
    let self = this;
    let paramsGrid = paramsContextMenu.item;
    let columnConfig = <ColumnConfig>paramsGrid.colDef;

    /* para revision */
    if (optionAction.fnClick){
      optionAction.fnClick(paramsGrid, optionAction);
    }

    if (!columnConfig.fnMostrar ||  columnConfig.fnMostrar(paramsGrid)){
      self.fnCellContextMenu(columnConfig, paramsGrid, optionAction);
    }
    
  }



  getSelectedRows(){
    return this.gridApi.getSelectedRows();
  }

  mostrarConfirmarEliminar(){

  }

  /* Se ejecuta al detectarse cambios en los input, la primera vez se ejecuta antes que ngOnInit*/
  ngOnChanges(changes: SimpleChanges){
    let self = this;
    let changesConfig = changes.config;
    let changesFiltro = changes.filtro;
    //console.log('primer seteo de datos', changes);
    /*se ejecuta al cambiarse los valores de las propiedades*/
    if (changesConfig && !changesConfig.previousValue && changesConfig.currentValue){
      console.log('primer seteo de datos', changesConfig);
      self.procesarConfig();
    } else if (changesFiltro){
      console.log('cambio en el filtro', changesFiltro);
      self.searchBase();
    }
  }


  ngOnInit() {
 
  }

  /*Crea el filtro a partir del filtro enviado como input */
  createFiltro(filtroCustom?:any):any{
    if (this.filtro || filtroCustom || (this.config && this.config.fnCreateFilter)){
      let filtro = ObjectUtil.unirObj(filtroCustom,this.filtro);
      if (this.config && this.config.fnCreateFilter)
        filtro = ObjectUtil.unirObj(this.config.fnCreateFilter(this.config),filtro); 
      this._filtro = filtro;
      return this.filtro;
    } 
    return {};
  }

  //style="width: 100%; height: 100%;"
  procesarConfig(){
    let self = this;
    let config = self.config;
    let styleBase = {
      width: '100%',
      height: '400px'//100%
    };
    config.icons = {
      columnGroupOpened: '<i class="far fa-plus-square"/>',
      columnGroupClosed: '<i class="far fa-minus-square"/>'
    };  
    if (config.rowNodeIdName){
      self.configBase.getRowNodeId = function(item) {
        return item[config.rowNodeIdName];
      }
    }

    config.style = ObjectUtil.unirObj(config.style,styleBase);
    //esta logica debe ser sobreescrita por el hijo
    //debugger;
    self.iniciarHijo(config);
    if (!config.fnCreateColumnFromData){
      self.arrayColumnConfig = self.createColumns(config,config.columns);
      /* el primer search se ejecuta cuando las columnas ya se dibujaron */
    }
    else{
      //iniciamos la generacion de columnas con el primer search
      //self.primerSearch();
      self.arrayColumnConfig = [ARRAY_COLUMN_CONFIG_BASE.basica];
    }
    //self.primerSearch();
  }

  primerSearch(){
    if (this.config.autoLoad || this.filtro){//la primera vez vemos si se marco el autoload o se ingreso el filtro
      this.searchBase();
    }
  }

  searchBase(){
    //console.log('ejecutando: searchBase');
    this.search();
  }

  firstDataRendered(event){
    let self = this;
    //console.log('firstDataRendered');
    if (self.config.fnFirstDataRendered){
      self.config.fnFirstDataRendered(event);
    }
  }

  abstract search(filtroCustom?:any);
  abstract getFilaData(index:number);

  /* Agregamos el numero de orden a la data */
  protected addDataAdicional(data, startRow?:number){
    let self = this;
    data.forEach(function(fila, index) {
      let orden = index + (startRow || 0) + 1;
      if (!self.config.rowNodeIdName){//si no tiene un nombre id por defecto se genera uno en base al numero de orden
        fila[self.configBase.rowNodeIdName] = orden;
      }
      fila[self.configBase.rowNodeOrdenName] = orden 
    });
    return data;
  }

  protected procesarOverlayReadDataExito(data){
    let self = this;
    if (self.gridApi){
      if (!data || data.length==0){
        self.gridApi.showNoRowsOverlay();
      }
      else{
        self.gridApi.hideOverlay();
      }
    }
  }

  protected procesarReadDataError(){
    let self = this;
    if (self.gridApi){
      self.gridApi.showNoRowsOverlay();
    }
  }

  protected procesarReadDataExito(data, startRow?:number):any[]{
    let self = this;
    data = data || []
    self.addDataAdicional(data, startRow);
    self.procesarOverlayReadDataExito(data);
    return data;
  }

  public getDataFromVisibleNodes(){
    return this.gridApi.getRenderedNodes().map(value=>value.data);
  }
  public getIdDataFromVisibleNodes(){
    return this.gridApi.getRenderedNodes().map(value=>value.data[this.config.rowNodeIdName]);
  }
   
  public forEachNodeAfterFilter(callback: (rowNode: RowNode, index: number) => void): void{
    return this.gridApi.forEachNodeAfterFilter(callback);  //  .getRenderedNodes().map(value=>value.data);
  }

  public getIdRowsDataAfterFilter(): any[]{
    let self = this;
    let result:any[]=[];
    self.gridApi.forEachNodeAfterFilter( function(rowNode, index) {
      result.push(rowNode.data[self.config.rowNodeIdName]);
    });
    return result;
  }


  setHeight(num:number){
    if (num && this.config){
      this.config.style.height = num + 'px';
    }
    
  }
  /*
  public getIdRowsDataAfterFilter(){
    return null;//this.gridApi.getRenderedNodes().map(value=>value.data[this.config.rowNodeIdName]);
  }*/

}




