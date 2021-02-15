import { HttpEvent } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base/service-base';

@Injectable({providedIn: 'root'})
export class UploadService  extends BaseService  {
    
    constructor(injector:Injector) {
        super(injector,'file/');
    }

    uploadFile(url:string, file: File): Observable<HttpEvent<any>> {
        let formData: FormData = new FormData();
        formData.append('uploadFile', file, file.name);//userfile upload
        return this.createFilePostFullUrl(url,formData);
    }
}

