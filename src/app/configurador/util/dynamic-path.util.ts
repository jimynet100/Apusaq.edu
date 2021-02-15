import { Route } from '@angular/router';
import { ContenedorPageComponent } from '../contenedor-page/contenedor-page.component';
/*
export function addDynamicPath(config: Array<Route>, modulePath): Promise<Array<Route>> {

  return new Promise((resolve, reject) => {
    // Trigger change detection so _loadedConfig is available in router
    setTimeout(() => {
      let configIsChanged = false;
      config.forEach(root => {
        if (root.children) {          
          const foundChild: any = root.children.find(child => (child as any)._loadedConfig && child.path === modulePath);             
          if (foundChild && foundChild._loadedConfig.routes.length > 0) {
            foundChild._loadedConfig.routes.forEach(childRoute => {
              if (childRoute.data && childRoute.data.addDynamicChild) {                
                if (!childRoute.children) {
                  childRoute.children = [];
                }
                const foundDynamicChild = childRoute.children.find(child => child.path === 'dynamic');
                if (!foundDynamicChild) {
                  childRoute.children.push(
                    {
                      path: 'dynamic',
                      component: PageComponent
                    }
                  );
                  configIsChanged = true;
                }
              }
            });
          }
        }
      });      
      if (configIsChanged) {
        resolve(config);
      }
      resolve(null);
    }, 0);
  });
}*/



export class DynamicPathUtil {
  /*
    static addDynamicPath(config: Array<Route>) {

        let configIsChanged = false;
        config.forEach(root => {
            debugger;
          if (root.children) {          
            const foundChild: any = root.children.find(child => (child as any)._loadedConfig);             
            if (foundChild && foundChild._loadedConfig.routes.length > 0) {
              foundChild._loadedConfig.routes.forEach(childRoute => {
                if (childRoute.data && childRoute.data.addDynamicChild) {                
                  if (!childRoute.children) {
                    childRoute.children = [];
                  }
                  const foundDynamicChild = childRoute.children.find(child => child.path === 'dynamic');
                  if (!foundDynamicChild) {
                    childRoute.children.push(
                      {
                        path: 'dynamic',
                        component: ContenedorPageComponent
                      }
                    );
                    configIsChanged = true;
                  }
                }
              });
            }
          }
        });

      }
      static addDynamicPath2(config: Array<Route>, modulePath): Promise<Array<Route>> {

        return new Promise((resolve, reject) => {
          // Trigger change detection so _loadedConfig is available in router
          setTimeout(() => {
            let configIsChanged = false;
            config.forEach(root => {
              if (root.children) {          
                const foundChild: any = root.children.find(child => (child as any)._loadedConfig && child.path === modulePath);             
                if (foundChild && foundChild._loadedConfig.routes.length > 0) {
                  foundChild._loadedConfig.routes.forEach(childRoute => {
                    if (childRoute.data && childRoute.data.addDynamicChild) {                
                      if (!childRoute.children) {
                        childRoute.children = [];
                      }
                      const foundDynamicChild = childRoute.children.find(child => child.path === 'dynamic');
                      if (!foundDynamicChild) {
                        childRoute.children.push(
                          {
                            path: 'dynamic',
                            component: ContenedorPageComponent
                          }
                        );
                        configIsChanged = true;
                      }
                    }
                  });
                }
              }
            });      
            if (configIsChanged) {
              resolve(config);
            }
            resolve(null);
          }, 0);
        });
      }*/
}