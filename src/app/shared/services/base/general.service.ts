import { Injectable, Injector } from '@angular/core';
//services
import { BaseService } from './service-base';

@Injectable({providedIn: 'root'})
export class GeneralService  extends BaseService  {
    constructor(injector:Injector) {
        super(injector,'');
    }
}
