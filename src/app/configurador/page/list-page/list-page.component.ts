import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/security/authentication.service';
import { GridPaginadoComponent } from 'src/app/shared/components/grid/grid-paginado/grid-paginado.component';
import { GridConfig } from 'src/app/shared/components/grid/model/model.grid';
import { ConfigService } from 'src/app/shared/services/configurador/config.service';
import { NotificacionService } from 'src/app/shared/services/util/notificacion.service';
import { IListPageComponent, ListPage } from '../../model/model';
import { BasePageComponent } from '../../model/base-page-component';
import { GridConfiguradorUtil } from '../../util/grid-configurador.util';



@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.sass']
})
export class ListPageComponent  extends BasePageComponent implements OnInit, IListPageComponent {

  @ViewChild(GridPaginadoComponent,{static: false}) grid: GridPaginadoComponent;
  _meta: ListPage;
  filtro: any;
  gridConfig: GridConfig;

  defaultGridConfig: GridConfig;


  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router, 
    private auth: AuthenticationService, 
    private configService: ConfigService, 
    private notificacionService:NotificacionService) {
      super();
      const self = this;
      self.defaultGridConfig = <GridConfig>{};
  }

  ngOnInit() {
    const self = this;


  }




  get meta() {
    return this._meta;
  }
  
  set meta(meta: ListPage){
    const self = this;
    self.filtro = Object.assign({queryId: meta.grid.queryId}, {mapValue: self.contenedorPage.getPageParam()});
    self.gridConfig = GridConfiguradorUtil.gridToGridConfigBase(meta.grid);

    self.gridConfig = Object.assign(self.defaultGridConfig, self.gridConfig);
    this._meta = meta;
  }



  getData(): any{
    const self = this;
    return null;
  }
  
}

