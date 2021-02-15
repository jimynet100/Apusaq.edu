import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute, RouteConfigLoadStart, RouteConfigLoadEnd, Route } from '@angular/router';
import { AuthenticationService } from './shared/services/security/authentication.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dynamo-workspace';
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private auth: AuthenticationService) {
    this.router.events.subscribe((event: Event) => {

      if (event instanceof RouteConfigLoadStart) {
        if (event.route.path == 'c'){
          //console.log(event);
        }
      } else if (event instanceof RouteConfigLoadEnd) {

        if (event.route.path == 'c'){
          
          //let route = event.route;
          //debugger;

          //console.log(router.config);

          /*
          let routes = [];
          auth.pages.forEach((page: Page) => {
            routes.push({  path: page.url, component: PageComponent });
          });
          let newRoutes = [];
          router.config.forEach((r:Route) => {
            if (r.path!=''){
              newRoutes.push(r);
            }
          });
          newRoutes.push({path:'', });

          router.resetConfig(newRoutes);*/

        }

        /*
        if (event.route.path == 'c'){
          
          let route = event.route;
          debugger;
          
          console.log(router.config);
 
          let routes = [];
          //let lstPages = auth.pages;
          auth.pages.forEach((page: Page) => {
            routes.push({  path: page.url, component: PageComponent });
          });
          let newRoutes = [];
          router.config.forEach((r:Route) => {
            if (r.path!=''){
              newRoutes.push(r);
            }
          });
          newRoutes.push({path:'', });

          router.resetConfig(newRoutes);

          //route['_loadedConfig'].routes.push({  path:'requerimiento/admin', component: PageComponent });
          //route['_loadedConfig'].routes.push({  path:'requerimiento/detalle', component: PageComponent });

          
          //{  path:'requerimiento/detalle', component: PageComponent, runGuardsAndResolvers: 'always' },

        }*/
      }
      if (event instanceof NavigationStart) {
          // Show loading indicator
          //console.log('NavigationStart',event);
      }

      if (event instanceof NavigationEnd) {
          // Hide loading indicator
          
          //console.log(this.activatedRoute.snapshot);
          //console.log('NavigationEnd',event,this.activatedRoute.snapshot);
      }

      if (event instanceof NavigationError) {
          // Hide loading indicator

          // Present error to user
          //console.log('NavigationError',event.error);
      }

      
  });
  }
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      //console.log('AppComponent.scrollTo')
      window.scrollTo(0, 0);
    });



  }
}


