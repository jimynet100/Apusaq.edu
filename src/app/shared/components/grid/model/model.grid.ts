export enum ColumnTipo {
  Standard = 1,
  Accion = 2,
  Seleccion = 3,
  Orden = 4
}

export interface OptionActionContext {
  name:string;
  divider?:boolean;
  fnClick?:(data: any, optionAction:OptionActionContext) => void; 
  fnLabel?:(optionActionContext: OptionActionContext) => string;
  fnIsVisible?:(optionActionContext: OptionActionContext) => boolean;
  fnIsEnable?:(optionActionContext: OptionActionContext) => boolean;
}

export interface ColumnConfig {
  name?:string;
  pinned?:string;
  
  headerName?:string;
  width?:number;
  headerCheckboxSelection?:boolean;
  checkboxSelection?:any;
  headerTooltip?:string;
  tooltip?:string;
  headerClass?:string;
  valueGetter?:any; 
  html?:string;
  orden?:number;
  tipo?:ColumnTipo;
  mostrar?:boolean;
  mostrarConfirmar?:boolean;
  msgConfirmar?:string;
  fnMostrar?:(data: any) => boolean;
  fnClick?:(data: any) => void; 
  fnCellContextMenu?:(data: any, optionAction:OptionActionContext) => void; 
  field?:string;
  filter?:any;
  columnGroupShow?:string;
  floatingFilterComponent?:string;
  floatingFilterComponentParams?:any;
  suppressMenu?:boolean;
  resizable?:boolean;
  cellRenderer?:any;
  cellStyle?:any; 
  valueFormatter?:any;
}

export enum ColumnDefault
{ 
    basica = 'basica',
    checkbox = 'checkbox',
    orden = 'orden',
    consultar = 'consultar',
    editar = 'editar',
    eliminar = 'eliminar'
}

export interface GridConfig {
  url: string;
  urlUpdate?:string;
  fnCreateDataUpdate?:(data: any[]) => any;
  autoLoad?:boolean;
  mostrarCheckbox?:boolean;
  mostrarOrden?:boolean;
  cellStyleOrden?:(data: any) => any;
  mostrarGuardar?:boolean;
  mostrarEditar?:boolean;
  mostrarEliminar?:boolean;
  mostrarConfirmarEliminar?:boolean;
  mostrarConsultar?:boolean;
  mostrarAccionesPrimero?:boolean;
  fnMostrarEditar?:(data: any) => boolean;
  fnMostrarEliminar?:(data: any) => boolean;
  fnMostrarConsultar?:(data: any) => boolean;
  fnMostrarCheckbox?:(data: any) => boolean;
  columns: any[];
  columnsAction?: GridColumnAction[];
  fnCreateColumnFromData?:(config:GridConfig,data: any) => ColumnFromData;
  getRowHeight?:(params:any) => number;
  rowDragManaged?:boolean;
  style?:any;
  sortable?:boolean;

  fnClickEditar?:(data: any) => void;
  fnClickEliminar?:(data: any) => void;
  fnClickConsultar?:(data: any) => void;

  fnSearchCompleteExito?:(data: any) => void;
  fnFirstDataRendered?:(data: any) => void;
  rowNodeIdName?:string;
  rowNodeOrdenName?:string;
  floatingFilter?:boolean;
  frameworkComponents?:any;

  getContextMenuItems?:any;

  
  fnDoubleClick?:(data: any) => void;

  optionsActionContext?:OptionActionContext[];

  titulo?:string;
  icons?:any;

  headerButton?:any;

  fnCreateFilter?:(config:GridConfig)=>any;
}

export interface GridPaginadoBaseConfig {
  gridColumnApi;
  components?;
  rowSelection;
  rowModelType;
  cacheOverflowSize;
  maxConcurrentDatasourceRequests;
  infiniteInitialRowCount;
  maxBlocksInCache;
  paginationPageSize;
  cacheBlockSize;
  getRowNodeId;
  defaultColDef;
  overlayLoadingTemplate:string;
  overlayNoRowsTemplate:string;
  rowNodeOrdenName:string;
  rowNodeIdName:string;
}


export class GridColumnAction implements ColumnConfig {
  headerName; 
  field; 
  width=40;
  html?:string;
  iconClass?:string;
  fnMostrar?:(data: any) => boolean;
  fnClick?:(data: any) => void;
  tooltip?:string;
  public constructor(init?:Partial<GridColumnAction>) {
    Object.assign(this, init);
  }

}

export class ResultadoPaginado {
  filtro: any;
  lista: any;
}

export class ColumnFromData {
  data: any[];
  columns: ColumnConfig[];
}