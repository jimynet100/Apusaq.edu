import { Injectable } from '@angular/core';
import {SnotifyService, SnotifyPosition, SnotifyToastConfig} from 'ng-snotify';

@Injectable({providedIn: 'root'})
export class NotificacionService { 
    public timeout = 3000;
    public position: SnotifyPosition = SnotifyPosition.rightTop;
    public progressBar = true;
    public closeClick = true;
    public newTop = true;
    public backdrop = -1;
    public dockMax = 8;
    public blockMax = 6;
    public pauseHover = true;
    public titleMaxLength = 15;
    public bodyMaxLength = 80;

    constructor(private snotifyService: SnotifyService) {
      this.snotifyService.setDefaults({
        global: {
          newOnTop: this.newTop,
          maxAtPosition: this.blockMax,
          maxOnScreen: this.dockMax,
        }
      });
    }
    getConfig(): SnotifyToastConfig {
        return {
          bodyMaxLength: this.bodyMaxLength,
          titleMaxLength: this.titleMaxLength,
          backdrop: this.backdrop,
          position: this.position,
          timeout: this.timeout,
          showProgressBar: this.progressBar,
          closeOnClick: this.closeClick,
          pauseOnHover: this.pauseHover
        };
      }

      success(title: string, body: string){
        this.snotifyService.success(body,title,this.getConfig());
      } 

      error(title: string, body: string){
        this.snotifyService.error(body,title,this.getConfig());
      } 

      info(title: string, body: string){
        this.snotifyService.info(body,title,this.getConfig());
      } 

      warning(title: string, body: string){
        this.snotifyService.warning(body,title,this.getConfig());
      }
      
      onlyconfirm(title: string, body: string, fnSi: ()=>void){
        let config = this.getConfig();
        config.position = SnotifyPosition.centerCenter;
        config.closeOnClick = false;
        config.timeout = 2000,
        config.backdrop = -1;
        config.pauseOnHover = false;
        //setTimeout((toast) => {this.snotifyService.remove(toast.id);fnSi();});
        //this.snotifyService.confirm(body,title,config).on('remove', (toast) => {fnSi();});
        return this.snotifyService.success(body,title,config)
        .on('mounted',(toast) => {setTimeout(() => {this.snotifyService.remove(toast.id);fnSi();},2000);})
        .on('click', (toast) => {this.snotifyService.remove(toast.id);fnSi();});

      }

      confirm(title: string, body: string, fnSi: ()=>void){
        let config = this.getConfig();
        config.position = SnotifyPosition.centerCenter;
        config.closeOnClick = false;
        config.timeout = 10000,
        config.backdrop = -1;
        config.pauseOnHover = true;
        config.buttons = [
          {text: 'Si', action: (toast) => { 
            fnSi();
            //console.log('Clicked: Si'); 
            this.snotifyService.remove(toast.id);
          }, bold: false},
          {text: 'No', action: (toast) => {console.log('Clicked: No'); this.snotifyService.remove(toast.id); } },
          {text: 'Cancelar', action: (toast) => {console.log('Clicked: Cancelar'); this.snotifyService.remove(toast.id); }, bold: true},
        ];
        return this.snotifyService.confirm(body,title,config);
      }
}
