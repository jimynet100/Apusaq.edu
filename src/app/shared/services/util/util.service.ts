import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base/service-base';


@Injectable({providedIn: 'root'})
export class UtilService  extends BaseService  {
    
    constructor(injector:Injector) {
        super(injector,'util/');
    }

    getListaCombo(filtro:any): Observable<any[]> {
        return this.createPost('GetListaCombo',filtro);
    }

    getReporte(url:string,filtro:any): Observable<any[]> {
        return this.createGetFullUrl(url,filtro); 
    }
}