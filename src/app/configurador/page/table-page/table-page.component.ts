import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/security/authentication.service';
import { BarButtonConfig, BarButtonComponent } from 'src/app/shared/components/bar-button/bar-button.component';
import { ConfigService } from 'src/app/shared/services/configurador/config.service';
import { NotificacionService } from 'src/app/shared/services/util/notificacion.service';
import { ITablePageComponent, TablePage } from '../../model/model';
import { BasePageComponent } from '../../model/base-page-component';
import { TableComponent, TableConfig } from 'src/app/shared/components/table/table.component';
import { ExcelConfig, ExcelSheetConfig, ExcelSectionConfig, ExcelReportUtil } from 'src/app/shared/util/excelutil';


 
@Component({
  selector: 'app-table-page',
  templateUrl: './table-page.component.html',
  styleUrls: ['./table-page.component.sass']
})
export class TablePageComponent  extends BasePageComponent implements OnInit, ITablePageComponent {
  @ViewChild(TableComponent,{static: false}) table: TableComponent;
  @ViewChildren('tables') tables:QueryList<TableComponent>;
  @ViewChild(BarButtonComponent,{static: false}) barButton: BarButtonComponent;
  defaultButtonConfig: BarButtonConfig;
  tableConfig:TableConfig;
  arrayTableConfig:TableConfig[];
  filtro: any;
  filtros: any[];
  _meta: TablePage;
  //params;

  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router, 
    private auth: AuthenticationService, 
    private configService: ConfigService, 
    private notificacionService:NotificacionService) {
      super();
      const self = this;
      //this.params = this.activatedRoute.snapshot.queryParamMap['params'];
  }

  ngOnInit() {
    const self = this;


  }

  get meta() {
    return this._meta;
  }

  set meta(meta: TablePage){
    const self = this;
    let tableConfig:TableConfig;
    let arrayTableConfig:TableConfig[];
    let filtro: any;
    let filtros: any[];

    if (meta.table){
      tableConfig = {
        title : meta.table.title,
        url: 'configurador/GetList', 
        columns: meta.table.columns,
        headerStyle: meta.headerStyle
      };
      filtro = {queryId: meta.table.queryId, params: self.contenedorPage.getPageParam()};
    }

    if (meta.tables){
      arrayTableConfig = [];
      filtros = [];
      meta.tables.forEach(table => {
        arrayTableConfig.push({
          title : table.title,
          url: 'configurador/GetList', 
          columns: table.columns,
          headerStyle: meta.headerStyle
        });
        filtros.push({queryId: table.queryId, params: self.contenedorPage.getPageParam()});
      });
    }
    this.tableConfig = tableConfig;
    this.arrayTableConfig = arrayTableConfig;
    this.filtro = filtro;
    this.filtros = filtros;
    this._meta = meta;
  }

  exportarExcel(){ 
    //components
    const self = this;
    let sheet: ExcelSheetConfig = {tabTitle:'Data', sections:[]};
    let config: ExcelConfig = {preName: 'Informe_', sheets: [sheet]};

    if (self.table){

    }
    if (self.tables){
      self.tables.forEach((tab:TableComponent) => {
        let configTable:TableConfig = tab.config;
        if (tab.getData() && tab.getData().length>0) {
          let section: ExcelSectionConfig = {
            title: configTable.title, 
            columns: configTable.columns,
            data: tab.getData()
          };
          sheet.sections.push(section);
        }
      });
    }
    ExcelReportUtil.export(config);
  }

  getData(){
    return null;
  }

}

