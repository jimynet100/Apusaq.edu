import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpUtil } from '../../util/httputil';
import { Injector } from '@angular/core';
import { AuthenticationService } from '../security/authentication.service';
import { shareReplay } from 'rxjs/operators';
import { ClientSessionStorageService } from '../util/client-session-storage.service';


export class BaseService {

  protected actionUrl: string;
  protected http:HttpClient;
  protected authenticationService:AuthenticationService;
  protected clientSessionStorageService: ClientSessionStorageService;

  //private cache$: Observable<any>;

  constructor(private injector:Injector, _url:string) {
    this.actionUrl = _url;
    this.http = this.injector.get(HttpClient);
    this.authenticationService = this.injector.get(AuthenticationService);
    this.clientSessionStorageService = this.injector.get(ClientSessionStorageService);
  }
  /*
  createPost(metodo:string,filtro:any, cache?:boolean): Observable<any> {
    const self = this;
    if (cache)
    {
      let idPost = 'datatatatata';
      debugger;
      let result = <Observable<any>>self.clientSessionStorageService.getSessionStorage(idPost);
      if (!result) {
        result = HttpUtil.createPost(this.http,this.actionUrl + metodo,filtro).pipe(
          shareReplay(1)
        );
        self.clientSessionStorageService.saveSessionStorage(idPost, result);
      }
      return result;
    }
    else{
      return HttpUtil.createPost(this.http,this.actionUrl + metodo,filtro);
    }
  }*/
  createPost(metodo:string,filtro:any): Observable<any> {
      return HttpUtil.createPost(this.http,this.actionUrl + metodo,filtro);
  }

  createPostAction(action:string, metodo:string,filtro:any): Observable<any> {
    return HttpUtil.createPost(this.http,action + metodo,filtro);
  }
  createSeguridadPostAction(action:string, metodo:string,filtro:any): Observable<any> {
    return HttpUtil.createSeguridadPost(this.http,action + metodo,filtro);
  }

  createPostFullUrl(url:string,filtro:any): Observable<any> {
    return HttpUtil.createPostFullUrl(this.http,url,filtro);
  }

  createGetFullUrl(url:string,filtro:any): Observable<any> {
    return HttpUtil.createGetFullUrl(this.http,url,filtro);
  }
  createFilePostFullUrl(url:string,formData: FormData): Observable<HttpEvent<any>> {
    return HttpUtil.createFilePostFullUrl(this.http,url,formData);
  }

  
}

/*
constructor(private injector:Injector) { 
  this.notificacionService = injector.get(NotificacionService);
  this.router = injector.get(Router);
  this.activatedRoute = injector.get(ActivatedRoute);
  this.modalService = injector.get(NgbModal);
  //this.activeModal = injector.get(NgbActiveModal);
  this.activatedRoute.params.subscribe(params => {
    this.params = params; 
  });
}*/