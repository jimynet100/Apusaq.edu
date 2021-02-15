import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
//models
import {ResultadoPaginado,GridConfig,GridPaginadoBaseConfig,GridColumnAction, ColumnFromData} from 'src/app/shared/components/grid/model/model.grid'
import {GridBase} from 'src/app/shared/components/grid/base/grid-base'
import { GeneralService } from '../../../services/base/general.service';
import { NumericEditor } from '../editor/numeric.editor';
import { SelectEditor } from '../editor/select.editor';
import { DynamicEditor } from '../editor/dynamic.editor';
import { NotificacionService } from 'src/app/shared/services/util/notificacion.service';
import { ContextMenuService, ContextMenuComponent } from 'ngx-contextmenu';

@Component({
  selector: 'app-grid-simple',
  templateUrl: './grid-simple.component.html',
  styleUrls: ['./grid-simple.component.css'],
})
export class GridSimpleComponent extends GridBase implements OnInit {
  
  
  fieldRowDrag;
  existenCambios:boolean=false;
  frameworkComponents = {
    numericEditor: NumericEditor,
    selectEditor: SelectEditor,
    dynamicEditor: DynamicEditor
  };

  constructor(private generalService: GeneralService, public notificacionService:NotificacionService, public contextMenuService: ContextMenuService) {
    super(notificacionService, contextMenuService);
    this.configBase.defaultColDef = {
      sortable: true,
      suppressMenu: true,
      filter: true
    };
  }

  onRowDragEnd(value){
    let self = this;
    if (self.fieldRowDrag){
      let orden=0;
      this.gridApi.forEachNode(function(node){
        orden++;
        node.data[self.fieldRowDrag] =  orden;
      });
      self.gridApi.refreshCells();
      self.existenCambios = true;
    }
  } 

  search(filtroCustom?:any) {
    let self = this;
    let config = self.config;
    if (config && self.gridApi){// || config.fnCreateColumnFromData
      self.gridApi.showLoadingOverlay();



      self.generalService.createPost(config.url,self.createFiltro(filtroCustom)).subscribe({
        next: (data: any) => {
          let lista = config.fnCreateColumnFromData?self.procesarCreateColumnFromData(data):data;
          self.rowData = self.procesarReadDataExito(lista);
          if (self.config.fnSearchCompleteExito){
            self.config.fnSearchCompleteExito(data);
          }
        }, 
        error: (error: any) => {
          self.procesarReadDataError();
        }, 
        complete: () => {
          self.existenCambios = false;
        }
      });
    }
  }

  

  procesarCreateColumnFromData(data):any[]{
    let self = this;
    let config = this.config;
    let columnFromData :ColumnFromData = config.fnCreateColumnFromData(config,data);
    if (columnFromData){
      self.arrayColumnConfig = self.createColumns(config,columnFromData.columns);
      return columnFromData.data;
    }
    return [];
  }

  procesarDragRow(column){
    let self = this;
    column.forEach(function(col, index) {
      if (col['rowDrag']){
        self.config.rowDragManaged = true;
        self.fieldRowDrag = col.field;
      }
    });
  }

  /*
  addItemsAtIndex(items:any[]) {
    var res = this.gridApi.updateRowData({
      add: newItems,
      addIndex: 2
    });
    printResult(res);
  }*/

  //let rowNode = self.grid.gridApi.getRowNode(proId);
  //      this.getRow(proId).setDataValue(field, value);
  
  setDataValue(rowNodeId, field, value){
    this.gridApi.getRowNode(rowNodeId).setDataValue(field, value);
  }      

  refresh(rowNodeId, field){
    //let param: RefreshCellsParams = new RefreshCellsParams();
    this.gridApi.refreshCells(
      {
        force:true,
        rowNodes: [this.gridApi.getRowNode(rowNodeId)],
        columns: [field]
      }
    );
  }

  addRows(items:any[]) {
    let self = this;
    self.addDataAdicional(items, (self.rowData?self.rowData.length:0));
    var res = self.gridApi.updateRowData({
      add: items
    });
  }


  iniciarHijo(config:GridConfig){
    this.procesarDragRow(config.columns);
  }

  guardar(){
    let self = this;
    let obj = self.rowData;
    if (self.config.fnCreateDataUpdate){
      obj = self.config.fnCreateDataUpdate(self.rowData);
    }
    self.generalService.createPost(self.config.urlUpdate,obj).subscribe(
      data =>{
        self.search();
      },
      () =>{
        self.existenCambios = false;
      }
    );
  }

  onCellValueChanged(value){
    this.existenCambios = true;
  }

  
  

  getFilaData(index:number){
    if (this.rowData && this.rowData.length>=index){
      return this.rowData[index];
    }
    return null;
  }

  exportarExcel(){
/*
    let arrayTitulo = [];
    let arrayCampo = [];
    //extraemos los titulos
    this.arrayColumnConfig.forEach(x=>{
      if (x.headerName && x.headerName!='' && x['field'] && x['field']!='' && x.name==null) {
        arrayTitulo.push(x.headerName);
        arrayCampo.push(x['field']);
      }
    });

    let re = new RegExp('<br>', 'g');
 
    let data = this.rowData;
    let matriz = [];
    matriz.push(arrayTitulo); //titulos
    data.forEach(x=>{
      let array = [];
      arrayCampo.forEach(y=>{
          array.push(x[y].replace(/<br>/g,'\r\n'));
      });
      matriz.push(array);
    });

    const workBook:XLSX.WorkBook = XLSX.utils.book_new(); 
    const workSheet:XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(matriz);

    XLSX.utils.book_append_sheet(workBook, workSheet, 'data'); // add the worksheet to the book
    XLSX.writeFile(workBook, 'exporta.xlsx');
    */
  }

  ARRAY_COLUMN = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];


  
  /*
  onCellContextMenu(param){
    let event = param.event;
    let data = param.data;
    console.log('onCellContextMenu',param,event);
    this.contextMenuService.show.next({
      anchorElement: event.target,
      // Optional - if unspecified, all context menu components will open
      contextMenu: this.contextMenu,
      event: <any>event,
      item: {data:data},
    });
    event.preventDefault();
    event.stopPropagation();
  }*/




  /*
  public contextMenuActions = [
    {
      fnLabel: (item) => `Say hi!`,
      fnClick: (item) => alert('Hi, ' + item.name),
      enabled: (item) => true,
      visible: (item) => true,
    },
    {
      divider: true,
      visible: true,
    },
    {
      fnLabel: (item) => `Something else`,
      click: (item) => alert('Or not...'),
      enabled: (item) => false,
      visible: (item) => true,
    },
  ];*/





  
}
