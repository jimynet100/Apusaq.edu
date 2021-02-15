import { OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificacionService } from '../services/util/notificacion.service';
import { SessionStorageService } from 'ngx-store';
import { AppInjector } from '../services/base/app-injector.service';

export abstract class PaginaBaseComponent implements OnInit {
  protected injector:Injector;
  protected notificacionService:NotificacionService;
  protected router:Router;
  protected activatedRoute:ActivatedRoute;
  protected params;
  protected popupParams;
  protected modal:boolean;

  protected modalService: BsModalService;
  protected modalReference:BsModalRef;
  protected modalHijoReference:BsModalRef;

  protected fnModalClose:any;
  protected sessionStorageService: SessionStorageService;
  protected SESSION_STORAGE_DATA:string='SESSION_STORAGE_DATA_';

  constructor() { 
    let self =this;
    this.injector = AppInjector.getInjector(); 
    this.notificacionService = this.injector.get(NotificacionService);
    this.router = this.injector.get(Router);
    this.activatedRoute = this.injector.get(ActivatedRoute);
    this.modalService = this.injector.get(BsModalService);
    this.sessionStorageService = this.injector.get(SessionStorageService);


    /*NO FUNCIONA */
    /*
    self.activatedRoute.params.subscribe(params => {
      console.log('DATAAAAAAA',params);
      self.params = params; 
    });*/
    
    //console.log('DATAAAAAAA',window.location.href);

  }

  irHacia(url:string,value:any=null){//,estadoPagina:any=null
    if (value==null){
      this.router.navigate([url]);
    }
    else{
      this.router.navigate([url,value]);
    }
  }

  getParamId(){
    return this.getParamData()['id'];
  }

  getParamData(){
    if (this.isModal()){
      return this.popupParams;
    }
    //return this.params || {};
    return this.getDataFromUrl() || {};
  }

  openModal(content:any,params:any,fnClose:(param?) => void,fnOpen?:(param?) => void, dataFromParent?:any) {
    const modalRef = this.modalService.show(content, {backdrop: true, ignoreBackdropClick: false, class: 'modal-lg', animated: true});//,{ centered: true, size:'lg'})
    modalRef.content.popupParams = params;
    modalRef.content.modal = true;
    modalRef.content.fnModalClose = fnClose;
    modalRef.content.fnModalOpen = fnOpen;
    modalRef.content.dataFromParent = dataFromParent;
    modalRef.content.modalReference = modalRef;
    this.modalHijoReference = modalRef;
  }

  getDataFromParent(){
    return this['dataFromParent'];
  }

  isModal(){
    return this.modal;
  }

  closeModal(param = null){
    this.modalReference.hide();//close
    if (this.fnModalClose){
      this.fnModalClose(param);
    }
  }

  closeModalHijo(){
    this.modalHijoReference.hide();//close
  }

  success(body: string, title: string="Éxito"){
    this.notificacionService.success(title,body);
  } 

  error(body: string, title: string="Error"){
    this.notificacionService.error(title,body);
  } 

  info(body: string, title: string="Información"){
    this.notificacionService.info(title,body);
  } 

  warning(body: string, title: string="Aviso"){
    this.notificacionService.warning(title,body);
  } 

  saveSessionStorage(value:any){
    this.sessionStorageService.set(this.SESSION_STORAGE_DATA + this.constructor.name, value);
  }

  getSessionStorage():any{
    return this.sessionStorageService.get(this.SESSION_STORAGE_DATA + this.constructor.name);
  }

  getIPaginaBaseComponent():IPaginaBaseComponent{
    let self:any = this;
    return <IPaginaBaseComponent>self;
  }

  ngOnInit() {
    let self = this;
    let impl:IPaginaBaseComponent = self.getIPaginaBaseComponent();
    let dataSession = self.getSessionStorage();
    if (impl){
      if (impl.ngOnInit2){
        impl.ngOnInit2(dataSession);
      }
      if (dataSession){
        impl.postReloadSessionStorage(dataSession);
      }
    }
    
  }

  getDataFromUrl(){
    let url = window.location.href;
    if (url.lastIndexOf(";")>-1){ 
      let res = url.split(";");//llega de la forma : producto;ficId=25;proId=1679
      if (res && res.length>1){
          let param = {};
          //param = JSON.parse( "{" + res.slice(1, res.length).join(',') + "}" );
          for (let i = 1; i < res.length; i++) {
              let temp = res[i].split("=");//ficId=25
              param[temp[0]]=temp[1]; 
          }
          return param;
      }
    }
    else if (url.lastIndexOf("/")>-1 && url.lastIndexOf("/")<url.length){
      let resto = url.substring(url.lastIndexOf("/")+1, url.length);
      if (resto!=null && Number(resto)!=null)
      {
        return {id:Number(resto)};
      }
    }
    return null;
  } 

  //abstract ngOnInit2(): void;
  //bstract postReloadSessionStorage(value:any):void;
}


export interface IPaginaBaseComponent extends OnInit {
  ngOnInit2(dataSession?:any): void;
  postReloadSessionStorage(value:any): void;
  titulo?:string;
  //fnModalOpen?(param?) : void;
  //fnModalClose?(param?) : void;
}