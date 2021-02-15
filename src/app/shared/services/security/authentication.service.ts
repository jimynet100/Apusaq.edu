import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionStorageService } from 'ngx-store';
//util
import { HttpUtil } from 'src/app/shared/util/httputil';
//model
import { Router, ActivatedRoute } from '@angular/router';
import { MonitorService } from '../util/monitor.service';
import { ContainerPage } from 'src/app/configurador/model/model';
import { ClientSessionStorageService } from '../util/client-session-storage.service';
import {SnotifyService, SnotifyPosition, SnotifyToastConfig} from 'ng-snotify';
import { NotificacionService } from 'src/app/shared/services/util/notificacion.service';


@Injectable({providedIn: 'root'})
export class AuthenticationService  {
    protected actionUrl: string;
    protected _loginDto;
    protected _pages;
    protected _user;
    protected _credential;
    protected _captchaEncryptString;
    protected LOGIN_VAR:string='LOGIN_VAR'; 
    protected PAGE_VAR:string='PAGE_VAR'; 
    protected CREDENTIAL_VAR:string='CREDENTIAL_VAR'; 
    //// it will be stored under ${prefix}itWillBeRemovedAfterBrowserClose in session storage
    //@SessionStorage()
    

    constructor(
        private router: Router,   
        private route: ActivatedRoute,
        private http:HttpClient, 
        private monitorService: MonitorService,
        private sessionStorageService: SessionStorageService,
        private clientSessionStorageService: ClientSessionStorageService,
        private notificacionService: NotificacionService
    ) {
        this.actionUrl = 'seguridad/';
    }

    setCaptchaEncryptString(val: string){
        this._captchaEncryptString = val;
    }

    set loginDto(val){
        this._loginDto = val;
        if (val){
            //console.log('guardando en sessionStorageService');
            this.sessionStorageService.set(this.LOGIN_VAR, val);
            this.iniciarMonitor(this._loginDto.user.tiempoInactividadBrowser);
        }
        else{
            //console.log('borrando de sessionStorageService');
            this.sessionStorageService.remove(this.LOGIN_VAR);
        }
    };

    get loginDto(){
        if (!this._loginDto){
            //console.log('tratando de recuperar de sessionStorageService');
            this._loginDto = this.sessionStorageService.get(this.LOGIN_VAR);
            if (this._loginDto){
                //console.log('usuario recuperado de sessionStorageService');
                this.iniciarMonitor(this._loginDto.user.tiempoInactividadBrowser);
            }
        }
        return this._loginDto;
    };
    
    set credential(val){
        if (val){
            val = {userName:btoa(val.userName), password:btoa(val.password)};
            this.sessionStorageService.set(this.CREDENTIAL_VAR, val);
        }
        else{
            this.sessionStorageService.remove(this.CREDENTIAL_VAR);
        }
        this._credential = val;
    };

    get credential(){
        if (!this._credential){
            this._credential = this.sessionStorageService.get(this.CREDENTIAL_VAR);
        }
        return this._credential;
    };

    set pages(val){
        if (val){
            this.sessionStorageService.set(this.PAGE_VAR, val);
            this._pages = val;
        }
        else{
            this.sessionStorageService.remove(this.PAGE_VAR);
            this._pages = null;
        }
    };

    get pages(){
        if (!this._pages){
            this._pages = this.sessionStorageService.get(this.PAGE_VAR);
        }
        return this._pages;
    };

    get user(){
        return this.loginDto?this.loginDto.user:null;
    };

    createSeguridadPost(metodo:string,filtro:any): Observable<any> {
        return HttpUtil.createSeguridadPost(this.http,this.actionUrl + metodo,filtro); 
    }

    login(credential): Observable<any> {
        credential['captchaEncryptString'] = this._captchaEncryptString;
        return this.createSeguridadPost('login',credential);
    }

    getCaptcha(): Observable<any> {
        return this.createSeguridadPost('GetCaptcha',null);
    }

    loginExito(loginDto, credential){
        let self = this;
        let returnUrl = '/c/requerimiento/status';//self.route.snapshot.queryParams['returnUrl'] || '/c/requerimiento/admin';
        self.clientSessionStorageService.clear();
        self.loginDto = loginDto;
        self.credential = credential;
        console.log("loginExito: "+returnUrl);
        //cargamos las url dinamicas desde el configurador
        self.loginConfigurador().subscribe(pages => {
        self.pages = pages;
        this.notificacionService.onlyconfirm("Acceso satisfactorio","Bienvenido: "+this.getNombreUser()+".", function(){self.irHacia(returnUrl);});
        });
    }

    private loginConfigurador(): Observable<ContainerPage[]> {
        return HttpUtil.createPost(this.http,'configurador/login',{}); 
    }

    iniciarMonitor(tiempoInactividadBrowser:number){
        let self = this;
        self.monitorService.iniciarTimer(tiempoInactividadBrowser,function(){
            self.logout();
        });
    }

    getUser(){
        return this.user;
    }

    getNombreUser(){
        if (this.existeSession())
            return `${this.getUser().nombres} ${this.getUser().apellidoPaterno}`;
        return '';
    }

    getDniUser(){
        if (this.existeSession())
            return `DNI: ${this.getUser().nroDni || ''}`;
        return '';
    }

    

    getUltimoLogin(){
        if (this.existeSession())
            return this.getUser().fechaAnteriorLogin;
        return '';
    }

    existeSession():boolean{
        return this.user!=null;
    }

    logout(){//Logout
        const self = this;
        const logout = {sisUsuId:self.loginDto.sisUsuId, sisUsuLogId:self.loginDto.sisUsuId};
        
        self.createSeguridadPost('logout',logout).subscribe({
            next: (result: any) => {
                //  self.logoutInterno();
            }, 
            error: (error: any) => {
                // self.logoutInterno();
            }, 
            complete: () => {}
        });     
        self.logoutInterno();
    }

    private logoutInterno(){
        let self = this;
        self.monitorService.cerrarAlertaCierreSesion();
        self.monitorService.stopTimer();
        self.loginDto = null;
        this.sessionStorageService.remove(this.LOGIN_VAR);
        this.sessionStorageService.remove(this.PAGE_VAR);
        self.router.navigate(['login']); 
    }
    /*
    login(credential:Credential): Observable<User> {
        credential.captchaEncryptString = this._captchaEncryptString;
        return this.createSeguridadPost('login',credential);
    }*/

    getToken(){
        if (this.user){
            return this.user['token'];
        }
        return null;
    }

    getMenu(){
        let menu = [];
        if (this.existeSession()){
            if (this.getUser().menu==null || this.getUser().menu.lstMenu==null){
                return menu;
            }
            let lst = this.getUser().menu.lstMenu;
            lst.forEach(item => {
                let opcion = {
                    name: item.nombre,
                    url: '/' + item.url,
                    icon: 'fa fa-file-o'
                };
                if (item.lstMenu){
                    opcion['children'] = [];
                    opcion['url'] = '';
                    opcion['icon'] = 'fas fa-ellipsis-v'
                    
                    item.lstMenu.forEach(item => {
                        opcion['children'].push({
                            name: item.nombre,
                            url: '/' + item.url,
                            icon: 'fa fa-file-o'
                        });
                    });
                }
                menu.push(opcion);
            });    
        }
        //console.log(menu);
        return menu;
        /*
        name: 'Dashboard',
        url: '/dashboard',
        icon: 'icon-speedometer',
        badge: {
          variant: 'info',
          text: 'NEW'
        }*/
    }

    private irHacia(returnUrl){
        let self = this;
        try {
            var res = returnUrl.split(";");//llega de la forma : producto;ficId=25;proId=1679
            console.log(returnUrl);
            if (res && res.length>1){
                let param = {};
                //param = JSON.parse( "{" + res.slice(1, res.length).join(',') + "}" );
                for (let i = 1; i < res.length; i++) {
                    let temp = res[i].split("=");//ficId=25
                    param[temp[0]]=temp[1]; 
                }
                self.router.navigate([res[0],param]);
            }
            else{
                self.router.navigate([returnUrl]); 
            }
          }
          catch(err) {
            console.log(err);
            self.router.navigate(['/']); 
          }
    }

}
