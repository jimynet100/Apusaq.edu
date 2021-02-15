import { Injectable, Injector } from '@angular/core';
import { Observable, Subscription, Subject, interval } from 'rxjs';
//model
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertaCierreSesionComponent } from '../../components/alerta-cierre-sesion/alerta-cierre-sesion.component';


@Injectable({providedIn: 'root'})
export class MonitorService  {
    private _timeoutSeconds: number;
    private _count: number;
    private timerSubscription: Subscription;
    private timer: Observable<number> = interval(1000);
    private _remainSeconds = new Subject<number>();
    /**
    * Observable to get session remaining time (in seconds).
    *
    * Subscribers need to unsubscribe to it before hosting element is destroyed.
    *
    * @memberof SessionTimerService
    */
    remainSeconds$ = this._remainSeconds.asObservable();
    lastActivity:Date = null;
    modalCierreSesion: BsModalRef;
    private logout:()=>void;

    constructor(private modalService: BsModalService) {
        let self = this;
        /*
        window.addEventListener('*', (event) => {
            console.log(event); 
        });*/
        
        window.addEventListener('keydown', (event) => {
            //console.log(event); 
            self.resetTimer();
        });

        window.addEventListener('mousemove', () => {
            //console.log('mousemove');
            self.resetTimer();
        });


        window.addEventListener('scroll', () => {
            //console.log('scrolling');
            self.resetTimer();
        });

        
    }

    iniciarTimer(tiempoInactividadBrowser:number,logout:()=>void){
        let self = this;
        self.logout = logout;
        this._timeoutSeconds = tiempoInactividadBrowser*60;
        self.startTimer();
    }

    resetTimer() {
        if (this._count < this._timeoutSeconds){
            //console.log('resetTimer');
            this._count = this._timeoutSeconds;
        }
    }



    mostrarAlertaCierreSesion(){
        let self = this;
        //console.log(this.modalCierreSesion);
        if (!this.modalCierreSesion){
            const initialState = {
                fnMensajeBase : function(){
                    return `La sesion se cerrara en ${self._count}, si desea seguir trabajando haga click fuera del recuadro`;  
                }
              };
            

            this.modalCierreSesion = this.modalService.show(AlertaCierreSesionComponent,{initialState});
            /*
            modalRef.content.fnMensajeBase = function(){
                return `La sesion se cerrara en ${self._count}, si desea seguir trabajando haga click fuera del recuadro`;  
            };*/
            /* mavargas ajustar
            modalRef.result.then((data) => {
                //cuando llamas a close
              }, (reason) => {
                //cuando pierdes el foco y se oculta
                self.startTimer();
                self.cerrarAlertaCierreSesion();
              });*/
            //this.modalCierreSesion = modalRef;
        }
    }

    cerrarAlertaCierreSesion(){
        if(this.modalCierreSesion){
            this.modalCierreSesion.hide();
            this.modalCierreSesion = null;
        } 
    }

    startTimer() {
        //console.log('iniciando MonitorService:' + this._timeoutSeconds + ' segundos');
        let self = this;
        this.stopTimer();
        this._count = this._timeoutSeconds;
        this.timerSubscription = this.timer.subscribe(n => {
          if (this._count > 0) {
            //console.log(this._count);
            this._count--;
            if (this._count==60){
                //console.log('cerrando sesion en:' + this._count);
                self.mostrarAlertaCierreSesion();
            }
            else if (this._count==0){
                self.stopTimer();
                self.logout();
            }
            this._remainSeconds.next(this._count);
          }
        });
      }
    
      stopTimer() {
        if (this.timerSubscription) {
          this.timerSubscription.unsubscribe();
        }
      }


}
/*
export class MonitorService  {
    idleState = 'Not started.';
    timedOut = false;
    lastPing?: Date = null;
    //alertaCierreSesion: boolean = false;
    modalCierreSesion:NgbModalRef;

    constructor(
        private idle: Idle, 
        private keepalive: Keepalive, 
        private modalService: NgbModal) {
    }

    iniciarTimer(tiempoInactividadBrowser:number,logout:()=>void){
        console.log('iniciando MonitorService');

        let self = this;
        // sets an idle timeout of 5 seconds, for testing purposes.
        self.idle.setIdle(tiempoInactividadBrowser*60);//600
        // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
        self.idle.setTimeout(60);
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        self.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        self.idle.onIdleEnd.subscribe(() => self.idleState = 'No longer idle.');
 
        self.idle.onTimeout.subscribe(() => {
            self.idleState = '';//Timed out!
            self.timedOut = true;
            logout();
            console.log('cerrando por inactividad');
        });

        self.idle.onIdleStart.subscribe(() => {
            self.idleState = 'You\'ve gone idle!';
            //console.log('iniciando contador');
        });
        self.idle.onTimeoutWarning.subscribe((countdown) => {
            self.idleState = countdown + ' segundos';
            console.log('cerrando sesion en:' + countdown);
            self.mostrarAlertaCierreSesion();
        });
        // sets the ping interval to 15 seconds
        self.keepalive.interval(15);
        self.keepalive.onPing.subscribe(() => {
            self.lastPing = new Date();
            //console.log('monitoreando:' + self.lastPing);
        });
        self.resetTimer();
    }

    resetTimer() {
        this.idle.watch();
        this.idleState = '';//Started.
        this.timedOut = false;
    }

    mostrarAlertaCierreSesion(){
        let self = this;
        //console.log(this.modalCierreSesion);
        if (!this.modalCierreSesion){
            const modalRef = this.modalService.open(AlertaCierreSesionComponent, { centered: true });
            modalRef.componentInstance.fnMensaje = function(){
                return `La sesion se cerrara en ${self.idleState}, si desea seguir trabajando haga click fuera del recuadro`;  
            };
            
            modalRef.result.then((data) => {
                //cuando llamas a close
              }, (reason) => {
                //cuando pierdes el foco y se oculta
                self.cerrarAlertaCierreSesion();
              });
            this.modalCierreSesion = modalRef;
        }
    }

    cerrarAlertaCierreSesion(){
        if(this.modalCierreSesion){
            this.modalCierreSesion.close();
            this.modalCierreSesion = null;
        }
    }


}
*/