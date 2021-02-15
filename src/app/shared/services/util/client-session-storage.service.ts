import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-store';

@Injectable({providedIn: 'root'})
export class ClientSessionStorageService {
    protected DATA_VAR:string='DATA_VAR';
    protected DATA_MAP_VAR:string='DATA_MAP_VAR'; 
    private map: any;
    constructor(private sessionStorageService: SessionStorageService) {
      this.map = this.sessionStorageService.get(this.DATA_MAP_VAR) || {};
    }

    saveSessionStorage(id: string ,value:any){
      let cod = this.DATA_VAR + id;
      this.sessionStorageService.set(cod, value);
      this.map[cod] = true;
      this.sessionStorageService.set(this.DATA_MAP_VAR, this.map);
    }

    getSessionStorage(id: string):any{
      return this.sessionStorageService.get(this.DATA_VAR + id);
    }
 
    clear(){
      if (this.map){
        let keys = Object.keys(this.map);
        keys.forEach((key: string) => {
          this.sessionStorageService.remove(key);
        });
      }
      this.map = {};
    }





}   