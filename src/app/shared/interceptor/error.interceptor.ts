import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/security/authentication.service';
import { NotificacionService } from '../services/util/notificacion.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private notificacionService:NotificacionService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let self = this;
        return next.handle(request).pipe(catchError(err => {
            let error = err.error.message || err.statusText;
            if (err.status === 0) {
                error = 'No se puede acceder a: \n' + request.url;
            }
            else if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                location.reload(true);
            }
            
            self.notificacionService.error('Error', error);
            return throwError(error);
        }))
    }
}