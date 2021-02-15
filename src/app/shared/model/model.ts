
export interface Condition{
    expression?:string;
    result?:any;
    conditions?:Condition[];
}

export interface Style{
    backgroundColor?:string;
    color?:any;
    border?: string; //alex07012020
}

export class Field{
  type?:number;/* tipo de componente */
  label?:string;
  name?:string;
  dataType?:number;/* tipo de dato nativo : string, number, date */
}

export class OptionValue{
  label:string;
  value:string;
}

export  class ColumnDesign 
{
  colspan?:number;
  rowspan?:number;
}

export class Column extends Field
{
    width?:number;
    headerStyle?: Style;
    style?: Style;
    columnsDesign?:ColumnDesign[];
    columns?:Column[];
    styleType?;
    styleValue?;
    colspan?:number;
    rowspan?:number;

    static getTotalChild(col:Column):number{
      let total = 0;
      if (col.columns && col.columns.length > 0){
        col.columns.forEach(subcol => {
          total = total + Column.getTotalChild(subcol);
        });
      }
      else{
        total++;
      }
      return total;
    }
}


export enum ButtonType {
    Standard = 1,
    UploadCliente = 2,
    UploadServidor = 4,
    Donwload = 3
  }
  
  export enum ButtonDefault {
    buscar = "buscar",
    nuevo = "nuevo",
    crear = "crear",
    caida = "caida",
    limpiar = "limpiar",
    cancelar = "cancelar",
    modificar = "modificar",
    agregar = "agregar",
    vigente = "vigente",
    exportarExcel = "exportarExcel",
    exportarPdf = "exportarPdf",
    cargarCliente = "cargarCliente",
    cargarServidor = "cargarServidor",
    regresar = "regresar"
  }
  
  export interface ButtonConfig {
    name?:string;
    iconClass?:string;
    tooltip?:string;
    mostrar?:boolean;
    titulo?:string;
    fnClick?:(data?:any) => any;
    //fnPreClick?:() => boolean;
    fnIsVisible?:() => boolean;
    //fnUploadCliente?:(value) => any;
    fnIsDisabled?:() => any;
    orden?:number;
    type?:ButtonType;
    urlDownload?:string;
  }