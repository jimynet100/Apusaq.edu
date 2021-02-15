import { Component, OnInit} from '@angular/core';
//models
import {GridBase} from 'src/app/shared/components/grid/base/grid-base'
import { GeneralService } from '../../../services/base/general.service';
import { NotificacionService } from 'src/app/shared/services/util/notificacion.service';
import { ContextMenuService } from 'ngx-contextmenu';


@Component({
  selector: 'app-grid', 
  templateUrl: './grid-paginado.component.html'
})
export class GridPaginadoComponent extends GridBase implements OnInit  {
  
  constructor(private generalService: GeneralService, public notificacionService:NotificacionService, public contextMenuService: ContextMenuService) {
    super(notificacionService, contextMenuService);
  }

  protected createDatasource(filtroCustom?:any){
    //console.log('GridPaginadoComponent.createDatasource');
    var self = this;
    return {
      rowCount: null,
      getRows: function(params) {
        let filtro = self.createFiltro(filtroCustom);
        self.gridApi.showLoadingOverlay();
        //console.log("asking for " + params.startRow + " to " + params.endRow);
        filtro.startRow = params.startRow ;
        filtro.endRow = params.endRow;
        self.generalService.createPost(self.config.url,filtro).subscribe((resutado:any) =>{
            params.successCallback(self.procesarReadDataExito(resutado.lista, params.startRow), resutado.filtro.total);
            //console.log(resutado.lista);
        },
        (error) =>{
          self.procesarReadDataError();
        });
      }
    };
  }

  search(filtro?:any) {
    if (this.gridApi){
      this.gridApi.setDatasource(this.createDatasource(filtro));
    }
  }

  getFilaData(index:number){
    if (this.rowData && this.rowData.length>=index){
      return this.rowData[index];
    }
    return null;
  }

}
