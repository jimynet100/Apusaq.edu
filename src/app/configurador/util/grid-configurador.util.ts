import { ColumnConfig, GridConfig, GridColumnAction } from 'src/app/shared/components/grid/model/model.grid';
import { GridComp, GridColumn, IContenerPageComponent, Process } from '../model/model';
import { TypeStyleGridColumnEnum, TypeGridColumnEnum, TypeFormatGridColumnEnum } from '../constantes/constante';
import { GridUtil } from 'src/app/shared/components/grid/base/grid-util';
import { ProcessConfiguradorUtil } from './process-configurador.util';
import { ObjectConfiguradorUtil } from './object-configurador.util';

export class GridConfiguradorUtil { 

    
      

      

      static styleTypeProcess(col: GridColumn, columnConfig: ColumnConfig){
        switch(col.styleType) { 
            case TypeStyleGridColumnEnum.BADGE: { 
                //columnConfig.cellStyle = GridUtil.createCellStyleColorByValue(col.styleValue);
                columnConfig.cellRenderer = GridUtil.createCellRendererBadge(col.styleValue);
                break; 
            } 
            default: { 
                //statements; 
                break; 
            } 
         }
      }
      static formatTypeProcess(col: GridColumn, columnConfig: ColumnConfig){
        switch(col.formatType) { 
            case TypeFormatGridColumnEnum.SECOND_TO_LITERAL: { 
                columnConfig.valueFormatter = GridUtil.createValueFormatterSecondToLiteral();
                break; 
            } 
            default: { 
                //statements; 
                break; 
            } 
         }
    }










    static  gridToGridConfigBase(grid: GridComp):GridConfig{
      let columns: ColumnConfig[] = [];
      let gridConfig = <GridConfig>{
        autoLoad: true,
        mostrarOrden:true,
        url: 'configurador/GetListPaginated' 
      };
      if (grid.columns != null && grid.columns.length > 0){//columns
        grid.columns.forEach(col=>{
          columns.push(GridConfiguradorUtil.gridColumnToColumnConfigBase(col));
        });
        gridConfig.columns = columns;
      } 
      return gridConfig;
    } 
    
    static  gridSimpleToGridConfigBase(grid: GridComp):GridConfig{
      let columns: ColumnConfig[] = [];
      let gridConfig = <GridConfig>{
        autoLoad: true,
        mostrarOrden:true,
        url: 'configurador/GetList' 
      };
      if (grid.columns != null && grid.columns.length > 0){//columns
        grid.columns.forEach(col=>{
          console.log(col);
          columns.push(GridConfiguradorUtil.gridColumnToColumnConfigBase(col));
        });
        gridConfig.columns = columns;
      }

      //console.log(gridConfig);
      return gridConfig;
    } 

    static gridColumnToColumnConfigBase(col: GridColumn): ColumnConfig{
        switch(col.type) { 
          case TypeGridColumnEnum.ACTION: { 
            let html = `<i title="${col.tooltip}" style="cursor: pointer;" class="${col.iconClass}"></i>`;
            return new GridColumnAction({
              iconClass: col.iconClass,
              html: html,
              fnClick: null,//ProcessConfiguradorUtil.createGridCellFnIsVisible(page, col.process)
              fnMostrar : GridConfiguradorUtil.createGridCellFnIsVisible(col.process)
            });
            break; 
          } 
          default: { 
            break; 
          } 
      }
      let columnConfig = {
          field: col.name,
          headerName: col.label,
          width: Number(col.width)
        };
      GridConfiguradorUtil.styleTypeProcess(col, columnConfig);
      GridConfiguradorUtil.formatTypeProcess(col, columnConfig);
      return columnConfig;
    }
    /*
    static createGridCellFnClick(page: IContenerPageComponent, col: GridColumn){
      if (col.process==null) return null;
      return ProcessConfiguradorUtil.createGridCellFnClick(page, col.process);
    }*/

    static createGridCellFnIsVisible(process:Process): (data: any) => boolean {
      return function(param: any){
        if (process==null) return true;
        return ObjectConfiguradorUtil.existParamInData(param.data, process.param);
      }
    }

}

/*

cellRenderer:GridUtil.createCellRendererBadge('ficEstado','ficEstadoDes',
            new Map<any,any>([
                [EstadoFichaEnum.EDICION, ["badge-primary"]],
                [EstadoFichaEnum.VIGENTE, ["badge-success"]],
                [EstadoFichaEnum.NO_VIGENTE, ["badge-dark"]]
            ]) 
          )
*/