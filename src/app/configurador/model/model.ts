
import { BarButtonComponent } from 'src/app/shared/components/bar-button/bar-button.component';
import { DynamicFormComponent } from 'src/app/shared/components/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { GridPaginadoComponent } from 'src/app/shared/components/grid/grid-paginado/grid-paginado.component';
import { Condition, Style, Field, Column, OptionValue } from 'src/app/shared/model/model';
import { TableComponent, TableConfig } from 'src/app/shared/components/table/table.component';
import { GridSimpleComponent } from 'src/app/shared/components/grid/grid-simple/grid-simple.component';



export class ExecuteQueryParam {
    queryId?:number; 
    pageId?:number;
    data?:any;
    params?:any;
    fnExito?: (result: ResultConfig) => void; 
    fnError?: (error: ResultConfig) => void;
    process?: Process;
    notificationId?:number;
}

/* Component interface */
export interface IContenerPageComponent
{
    navigateByPageId : (pageId:number, param?:any, data?:any) => void;
    navigateByUrl : (url:string, param?:any, data?:any) => void;
    executeQuery : (param: ExecuteQueryParam) => void;
    getPageParam : () => any;
    //executeQueryToPage : (queryId:number, pageId:number, param?:any, data?:any, fnExito?: (result: ResultConfig)=> void, fnError?: (error: ResultConfig)=> void) => void;
}
export interface IPageComponent {
    meta;
    contenedorPage: IContenerPageComponent;
    getData: () => any;
}



















export class Process {
    pageId:number;
    queryId:number;
    param:number;
    validate:boolean;
    validations;
    errorValidationMessage:string;
    successMessage:string;
    errorMessage:string;
    notificationId:number;
}


export abstract class Elemento
{
    id: number;
}
export class ParentFormField {
    name: string;
    nameFilter: string;
    required: boolean;
}
export class Button {
    label: string;
    iconClass: string;
    name: string;
    tooltip: string;
    process:Process;
    url:string;
}
export class FormField extends Field {
    column: number;
    queryId: number;
    tooltip: string;
    value: string;
    required: boolean;
    readOnly: boolean;
    parents:ParentFormField[];
    isVisibleCondition: Condition;
    validation: Condition;
    size: number;
    valueCondition: Condition;
    tooltipCondition: Condition;
    styleClass: string;
    format: string;
    options: OptionValue[];
    extra: any;
}
export class GridColumn extends Column {
    styleType: number;
    styleValue;
    formatType: number; 
    iconClass: string;
    tooltip: string;
    listAction;
    process:Process;
}
export class FormComp extends Elemento {
    fields: FormField[];
    buttons: Button[];
    dataParams: string[];
    dataQueryId: number;
    updateQueryId: number;
    insertQueryId: number;
    deleteQueryId:number;
}    
export class GridComp extends Elemento {
    queryId: number;
    deleteQueryId: number;
    columns: GridColumn[];
}    
export class ContainerPage extends Elemento {
    title: string;
    iconClass: string;
    url: string;
    components:any[];
    buttons: Button[];
}    
export class TableColumn extends Column {
    columns: TableColumn[];
}
export class TableComp{
    title: string;
    queryId: number;
    columns: TableColumn[];
}

export class ResultConfig {
    errorMessage;
    exitoMessage;
    internalError;
    detalleError;
    list;
    listPaginated;
    mapValue;
    page: ContainerPage;
}



export interface BasePage {
    id: number;
    type: number;
    title: string;
    initialValue: any;
}



/* METADATA DE CONFIGURACION PROPORCIONADA POR EL CONFIGURADOR */
export interface DetailPage extends BasePage {
    form: FormComp;
}
export interface TablePage extends BasePage {
    table: TableComp;
    tables: TableComp[];
    headerStyle:Style[];
}
export interface FileMultiplePage extends BasePage {
    grid: GridComp;
    donwloadUrl: string;
    uploadUrl: string;
    insertQueryId: number;
}
export interface SearchPage extends BasePage  {
    form: FormComp;
    grid: GridComp;
    filtro: any;
}

export interface ListPage extends BasePage  {
    grid: GridComp;
    filtro: any;
}
export interface ListDetailPage extends BasePage  {
    form: FormComp;
    grid: GridComp;
    filtro: any;
}


/* interfaces de los componentes dinamicos */

export interface IDetailPageComponent extends IPageComponent {
    form: DynamicFormComponent;
    barButton: BarButtonComponent;
    meta: DetailPage;
}
export interface ITablePageComponent extends IPageComponent {
    table: TableComponent;
    meta: TablePage;
}
export interface IFileMultiplePageComponent extends IPageComponent {
    grid: GridSimpleComponent;
    barButton: BarButtonComponent;
    meta: FileMultiplePage;
    //filesId: string;
    //filesTotal: number;
}
export interface ISearchPageComponent extends IPageComponent {
    form: DynamicFormComponent;
    grid: GridPaginadoComponent;  
    barButton: BarButtonComponent;
    meta: SearchPage;
}

export interface IListDetailPageComponent extends IPageComponent {
    form: DynamicFormComponent;
    grid: GridPaginadoComponent;
    barButton: BarButtonComponent;
    meta: ListDetailPage;
}

export interface IListPageComponent extends IPageComponent {
    grid: GridPaginadoComponent;
    meta: ListPage;
}