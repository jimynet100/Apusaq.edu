import { Injectable } from '@angular/core';
//model
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../security/authentication.service';
import { HttpUtil } from '../../util/httputil';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ContainerPage, ResultConfig, ExecuteQueryParam } from 'src/app/configurador/model/model';
import { UrlUtil } from '../../util/urlutil';


@Injectable({providedIn: 'root'})
export class ConfigService  {
    
    protected actionUrl: string = 'configurador/';
    constructor(
        private router: Router,    
        private route: ActivatedRoute,
        private http: HttpClient, 
        private auth: AuthenticationService
    ) {}

    private createPost(metodo:string,filtro:any): Observable<any> {
        return HttpUtil.createPost(this.http,this.actionUrl + metodo,filtro); 
    }

    public loadPage(url: string): Observable<ResultConfig>{
        let page = this.getPage(url);
        let params = UrlUtil.getQueryParamsFromUrl(url);
        return this.createPost('loadPage',{pageId: page.id, params: params});
    }


    public existPage(url: string):boolean {
        url = url.indexOf('?') > -1 ? url.substr(0, url.indexOf('?')):url;
        let elems = this.auth.pages.filter(x => x.url === url) || [];
        return elems.length>0 ? true : false;
    }

    public getPage(url: string):ContainerPage{
        url = url.indexOf('?') > -1 ? url.substr(0, url.indexOf('?')):url;
        let elems = this.auth.pages.filter(x => x.url === url) || [];
        return elems.length>0 ? elems[0] : null;
    }

    public getPageUrl(pageId:number):string{
        let elems = this.auth.pages.filter(x => x.id === pageId) || [];
        return elems.length>0 ? elems[0].url : null;
    }

    public executeQuery(par: ExecuteQueryParam): Observable<ResultConfig>{
        return this.createPost('executeQuery',{queryId: par.queryId, mapValue: par.data, params: par.params, notificationId: par.notificationId});
    }

    public reloadConfig(): void {
        this.createPost('reloadData',null).subscribe({
            next:(result)=>{
                console.log('data recargada');
            }
        });
    }
}

