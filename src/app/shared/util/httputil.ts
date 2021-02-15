import { HttpClient, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlUtil } from './urlutil';

export class HttpUtil {
    static getUrlBase(): string {
      return UrlUtil.getApiUrl();
    }

    static getUrlSeguridadBase(): string {
        return UrlUtil.getApiSeguridadUrl();
    }

    static createJsonHttpHeaders(): HttpHeaders {
        let option = {
            'Content-Type':'application/json',
            'Accept':'application/json'
        };
        /*
        if (token){
            option['Authorization'] = 'Bearer ' + token;
            //console.log('Token:' + token);
        }*/
        return new HttpHeaders(option);
    }

    static createFileHttpHeaders(): any {
        let option = {
            'Content-Type':'multipart/form-data',
            'Accept':'application/json'
        };
        return { 
                headers: new HttpHeaders(option),
                reportProgress: true,
                };
    }

    static createHttpHeaders(): any {
        return { headers: this.createJsonHttpHeaders()};
    }


    static createPost(http: HttpClient, url: string, filtro: any): Observable<any> {
        //return http.post<any[]>(HttpUtil.getUrlBase() + url, filtro, this.createHttpHeaders());
        return HttpUtil.createPostBase(http, HttpUtil.getUrlBase() + url, filtro);
    }

    static createSeguridadPost(http: HttpClient, url: string, filtro: any): Observable<any> {
        //return http.post<any[]>(HttpUtil.getUrlSeguridadBase() + url, filtro, this.createHttpHeaders());
        return HttpUtil.createPostBase(http, HttpUtil.getUrlSeguridadBase() + url, filtro);
    }

    static createPostFullUrl(http: HttpClient, url: string, filtro: any): Observable<any> {
        //return http.post<any[]>(url, filtro, this.createHttpHeaders());
        return HttpUtil.createPostBase(http, url, filtro);
    }

    static createGetFullUrl(http: HttpClient, url: string, filtro: any): Observable<any> {
        return http.get<any[]>(url, this.createHttpHeaders());
    }

    static createFilePostFullUrl(http: HttpClient, url: string, formData: FormData): Observable<HttpEvent<any>> {
        return http.post<any>(url, formData/*,  { headers: headers, reportProgress: true }*/);
    }

    static createPostBase(http: HttpClient, url: string, data: any): Observable<any> {
        //console.log("url"+url+"data:"+data);
        return http.post<any>(url, data, this.createHttpHeaders());
    }


}
