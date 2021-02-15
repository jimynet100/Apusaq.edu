import { NgModule, InjectionToken, ANALYZE_FOR_ENTRY_COMPONENTS, Compiler, FactoryProvider } from '@angular/core';
import { Routes, RouterModule, Router, ROUTES } from '@angular/router';
import { AppInjector } from '../shared/services/base/app-injector.service';
import { AuthenticationService } from '../shared/services/security/authentication.service';
import { ContainerPage } from './model/model';
import { ContenedorPageComponent } from './contenedor-page/contenedor-page.component';
import { NgModuleFactory } from '@angular/core/src/r3_symbols';

//let routes = [];
export let getDynamicRoutes = function() {
  let pages = AppInjector.getInjector().get(AuthenticationService).pages; 
  let children = [];
  pages.forEach((page: ContainerPage) => {
    children.push({path:page.url, component: ContenedorPageComponent});
  });
  children.push({  path:'**', component: ContenedorPageComponent  });
  return [{
      path: '', 
      children: children
  }];
};

export function MainRoutingLazyRoutesFactory(compiler: Compiler): Routes {
  return getDynamicRoutes();
}

@NgModule({
  imports: [
    //RouterModule.forChild(getDynamicRoutes())
    RouterModule
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: ROUTES,
      multi: true,
      deps: [Compiler],
      useFactory: MainRoutingLazyRoutesFactory,
      useValue: {}
    },
  ]
})
export class ConfiguradorRoutingModule { 
  constructor(private router: Router) {
  }
} 


//https://github.com/angular/angular/issues/22700