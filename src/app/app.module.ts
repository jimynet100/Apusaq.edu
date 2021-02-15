import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//adicionales
import { WebStorageModule } from 'ngx-store';
import { ToastDefaults, SnotifyModule, SnotifyService } from 'ng-snotify';
//modulos
import { PrincipalModule } from './principal/principal.module';
import { ComponentsModule } from './shared/components/components.module';
//componente
import { AppComponent } from './app.component';
//routing
import { AppRoutingModule } from './app-routing.module';
import { AppInjector } from './shared/services/base/app-injector.service';
import { LoadingInterceptor } from './shared/interceptor/loading.interceptor ';
import { JwtInterceptor } from './shared/interceptor/jwt.interceptor';
import { ErrorInterceptor } from './shared/interceptor/error.interceptor';


@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    //Adicionales
    WebStorageModule,
    SnotifyModule,
    //modulos
    PrincipalModule,
    ComponentsModule,
    //routing
    AppRoutingModule
  ],
  exports:[
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { 
  constructor(injector: Injector) {
    AppInjector.setInjector(injector);
  }
}
