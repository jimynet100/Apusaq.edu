import { Injectable, Component } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable({providedIn: 'root'})
export class DynamicPathGuard implements CanActivate {

  constructor(private router: Router) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    /*
    //const segments = parseUrlPathInSegments(state.url);   
    //const lastPath = segments.pop();
    console.log(state.url);
    debugger;
    if (state.url.indexOf('/c/') == 0) { 
      // Trigger change detection so url is known for router     
      setTimeout(()=>{
         this.router.navigateByUrl(state.url);  
      },0);
    } else {
      this.router.navigateByUrl('/404');
    }

    return false;*/
    return true;
  }
}
