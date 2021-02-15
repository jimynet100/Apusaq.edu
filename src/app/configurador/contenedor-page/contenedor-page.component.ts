import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/security/authentication.service';
import { IContenerPageComponent, ResultConfig, ExecuteQueryParam, ContainerPage, ITablePageComponent, IPageComponent, IFileMultiplePageComponent, ISearchPageComponent, IDetailPageComponent, IListDetailPageComponent, IListPageComponent, Process } from '../model/model';
import { ButtonConfiguradorUtil } from '../util/button-configurador.util';
import { TypePageEnum } from '../constantes/constante';
import { ConfigService } from 'src/app/shared/services/configurador/config.service';
import { NotificacionService } from 'src/app/shared/services/util/notificacion.service';
import { Type }  from '@angular/core';
import { HeaderPageConfig } from 'src/app/shared/components/header-page/header-page.component';
import { DetailPageComponent } from '../page/detail-page/detail-page.component';
import { SearchPageComponent } from '../page/search-page/search-page.component';
import { ListDetailPageComponent } from '../page/list-detail-page/list-detail-page.component';
import { TablePageComponent } from '../page/table-page/table-page.component';
import { FileMultiplePageComponent } from '../page/file-multiple-page/file-multiple-page.component';
import { ErrorPageConfig } from '../page/error-page/error-page.component';
import { ListPageComponent } from '../page/list-page/list-page.component';
import { ProcessConfiguradorUtil } from '../util/process-configurador.util';

@Component({
  selector: 'app-contenedor-page',
  templateUrl: './contenedor-page.component.html',
  styleUrls: ['./contenedor-page.component.sass']
})
export class ContenedorPageComponent implements OnInit, IContenerPageComponent {
  @ViewChild('container', { read: ViewContainerRef, static:true }) entry: ViewContainerRef;
  components: IPageComponent[];
  private url: string;
  headerPageConfig: HeaderPageConfig;
  resultConfig: ResultConfig;
  page: ContainerPage;
  params;
  errorPageConfig: ErrorPageConfig;

  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router, 
    private auth: AuthenticationService, 
    private configService: ConfigService, 
    private notificacionService:NotificacionService,
    private activatedRoute: ActivatedRoute) {
      this.params = this.activatedRoute.snapshot.queryParamMap['params'];
    }

  ngOnInit() {
    const self = this;
    let originalUrl = self.router.url;
    let url = originalUrl.replace('/c/','');
    if (self.configService.existPage(url))
    {
      self.configService.loadPage(url).subscribe(r=>{
        self.resultConfig = r;
        if (!r.errorMessage && !r.internalError){
          self.iniciar(r.page);
        }
        else{
          self.errorPageConfig = {
            url: originalUrl,
            error: r.errorMessage,
            internalError: r.internalError
          };
        }
      },
      (error: any) =>{
        self.errorPageConfig = {
          url: originalUrl,
          error: 'La página tiene errores',
          internalError: error
        };
      }
      );
    }
    else{
      self.errorPageConfig = {
        url: originalUrl,
        error: 'La página no existe',
        internalError: ''
      };
    }

  }

  iniciar(page: ContainerPage){
    const self = this;
    if (page==null){
      return;
    }
    let buttons = ButtonConfiguradorUtil.createHeaderArrayButtonConfig(page.buttons);
    if (buttons){
      buttons.forEach((buttonConfig,index) => {
        if (buttonConfig.name=='exportarExcel'){
          buttonConfig.fnClick = function(){
            self.exportarExcel();
          }
        }
        else {
          buttonConfig.fnClick = self.createFunctionFromProcess(page.buttons[index].process);
        }
      });
    } 
    

    self.headerPageConfig = {
      title: page.title,
      iconClass: page.iconClass,
      arrayButtonConfig: buttons
    };

    

    if (page.components){
      self.components = [];
      page.components.forEach(comp => {
        self.components.push(self.createSubPage(comp));
      });
    }
    self.page = page;
  }

  private createSubPage(component: any):any{
    const self = this;
    //debugger;
    switch(component.type) { 
        case TypePageEnum.SEARCH: { 
          let componentInstance:ISearchPageComponent = self.createComponent(SearchPageComponent);
          componentInstance.contenedorPage = self;
          componentInstance.meta = component;
          return componentInstance;
          break;
        } 
        case TypePageEnum.DETAIL: { 
          let componentInstance:IDetailPageComponent = self.createComponent(DetailPageComponent);
          componentInstance.contenedorPage = self;
          componentInstance.meta = component;
          return componentInstance;
          break;
        } 
        case TypePageEnum.LIST_DETAIL: { 
          let componentInstance:IListDetailPageComponent = self.createComponent(ListDetailPageComponent);
          componentInstance.contenedorPage = self;
          componentInstance.meta = component;
          //componentInstance.config = self.createListaDetallePageConfig(component, self, componentInstance);
          return componentInstance;
          break;
        }
        case TypePageEnum.TABLE: { 
          let componentInstance:ITablePageComponent = self.createComponent(TablePageComponent);
          componentInstance.contenedorPage = self;
          componentInstance.meta = component;
          return componentInstance;
          break;
        }
        case TypePageEnum.FILE_MULTIPLE: { 
          let componentInstance:IFileMultiplePageComponent = self.createComponent(FileMultiplePageComponent);
          componentInstance.contenedorPage = self;
          componentInstance.meta = component;
          return componentInstance;
          break;
        }
        case TypePageEnum.LIST: { 
          let componentInstance:IListPageComponent = self.createComponent(ListPageComponent);
          componentInstance.contenedorPage = self;
          componentInstance.meta = component;
          return componentInstance;
          break;
        }
        default: { 
          //statements; 
          break; 
        } 
    } 
  }

  


  navigateByPageId(pageId:number, param?:any, data?:any){
    let url = '/c/' + this.configService.getPageUrl(pageId);
    this.navigateByUrl(url, param, data);
  }

  navigateByUrl(url:string, param:any, data:any){
    if (param){
      this.router.navigate([url], {queryParams: param});
    }
    else{
      this.router.navigate([url]);
    }
  }

  //executeQueryToPage(queryId:number, pageId:number, param?:any, data?:any, fnExito?: (result: ResultConfig)=> void, fnError?: (error: ResultConfig)=> void) {
  executeQuery(par: ExecuteQueryParam) { 
    const self = this;
    //data = data || self.form.value;
    self.configService.executeQuery(par).subscribe({
        next: (result: ResultConfig) => {
          if (result.errorMessage || result.internalError){
            if (par.fnError) {
              par.fnError(result);
            }
            let error = result.errorMessage || (par.process? par.process.errorMessage : null) || result.internalError;
            self.notificacionService.error('Error', error);
            return;
          }
          else{
            if (par.fnExito){
              par.fnExito(result);
            }
            self.notificacionService.success('Exito', (par.process? par.process.successMessage : null) || "La operación se realizo de forma exitosa");
            if (par.pageId){
              self.navigateByPageId(par.pageId, par.params, par.data);
            }
          }
        }, 
        error: (error: any) => {
          let result = new ResultConfig();
          result.internalError = error;
          if (par.fnError) {
            par.fnError(result);
            self.notificacionService.error('Error', (par.process? par.process.errorMessage : null) || result.internalError);
          }
        }, 
        complete: () => {}
      }
    );
  }
  /*
  getPageParameters(){
    const self = this;
    self.activateRoute.queryParams.


  }*/



  private createComponent(clase:Type<any>):any{
    const factory = this.resolver.resolveComponentFactory(clase);
    const componentRef = this.entry.createComponent(factory);
    return componentRef.instance;
  }

  

  exportarExcel(){
    const self = this;
    if (self.components){
      self.components.forEach(comp=>{
        if (comp['exportarExcel']){
          comp['exportarExcel']();
        }

        /*
        if (comp['getData']){
          console.log('jajaja');
          comp['getData']();
        }*/
        
      });
    }
    
    
  }

  getPageParam(){
    return this.params;
  }

  private createFunctionFromProcess(process: Process){
    const self = this;
    return ProcessConfiguradorUtil.createFunctionFromProcess(self, process);
  }
  
}

