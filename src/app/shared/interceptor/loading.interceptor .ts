import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { LockComponent } from '../../principal/lock/lock.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    modalRef:BsModalRef;
    private peticionesActivas:number=0;
    private mapPeticion = new Map<string, string>();
    private PREFIJO_OPERACIONES_PESADAS = [
        "Crear",
        "Add",
        "Update",
        "Delete",
        "Guardar",
        "Cambiar",
        "Delete",
        "Eliminar",
        "Copiar",
        "Cargar",
        "Actualiza",
        "Actualizar",
        "login",
        "GetFichaJson",
        "GetProductoGridData",
        "Copiar",
        "GetFichaCartilla",
        "GetMasivo",
        "GetLogRedirect"
    ];
    private template:string = ` 
        <ng-template #template>
            <div class="modal-body text-center">
                <p>Do you want to confirm?</p>
                <button type="button" class="btn btn-default" (click)="confirm()" >Yes</button>
                <button type="button" class="btn btn-primary" (click)="decline()" >No</button>
            </div>
        </ng-template>
    `;

    private templateLock:string = ` 
        <div style="text-align:center">
            Procesando: <i class="fa fa-spinner fa-spin" style="font-size:24px"></i>
        </div>
    `;

    private mayorPeticionActiva:number=0;//se utiliza para otorgar id a las peticiones
    constructor(private modalService: BsModalService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const self = this;
        let esOperacionEscritura = this.esOperacionEscritura(request.url);
        let peticionId = self.inicioPeticion(esOperacionEscritura);
        //console.log(request);
        return next.handle(request).pipe(finalize(()=>{
            self.finPeticion(peticionId);        
        }),
        catchError(err => {
            self.finPeticion(peticionId); 
            return throwError(err);
        })
        );
    }

    inicioPeticion(esOperacionEscritura:boolean):number {
        let peticionId = this.generarPeticionId();
        this.mapPeticion.set(peticionId+"",peticionId+"");
        this.peticionesActivas++;
        //console.log(`iniciando request => Id: ${peticionId}, esOperacionEscritura: ${esOperacionEscritura}`);
        if (esOperacionEscritura){
            this.showWait();
        }
        return peticionId;
    }

    finPeticion(peticionId:number) {
        //console.log(`finalizando request => Id: ${peticionId}`);
        this.mapPeticion.delete(peticionId+"");
        this.peticionesActivas--;

        if (this.mapPeticion.size==0){
            this.resetPeticionId();
            this.hideWait();
        }

        if (this.peticionesActivas > 0) return;
        
    }

    generarPeticionId():number{
        this.mayorPeticionActiva++;
        return this.mayorPeticionActiva;
    }

    resetPeticionId(){
        this.mayorPeticionActiva=0;
    }

    esOperacionEscritura(url:string){
        let result:boolean=false;
        this.PREFIJO_OPERACIONES_PESADAS.forEach(x=>{
            if (url.indexOf(x)>-1){
                result = true;
            }
        });
        return result;
    }

    showWait(){
        if (!this.modalRef){
            //console.log('showWait.exito');
            this.modalRef = this.modalService.show(LockComponent, {backdrop: true, ignoreBackdropClick: true});
            //{ centered: true, size:'sm',backdrop:'static'}
        }
    }

    hideWait(){
        const self = this;
        setTimeout(function(){
            if (self.modalRef){
                //console.log('hideWait.exito');
                self.modalRef.hide();
                self.modalRef = null;
            }
        }, 100); 


        
       
    }

}