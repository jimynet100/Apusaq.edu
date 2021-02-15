import { ViewChild, ViewContainerRef, ComponentFactoryResolver,Type } from '@angular/core';

export class ManagerComponent {
  //protected componentRef: any;
  protected lstComponentRef:any[]=[];
  @ViewChild('container', { read: ViewContainerRef,static: false }) entry: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver) { }

  protected createComponentBase(clase:Type<any>):any{
    const factory = this.resolver.resolveComponentFactory(clase);
    const componentRef = this.entry.createComponent(factory);
    this.lstComponentRef.push(componentRef);
    return componentRef.instance;
  }

  destroyComponents() {
      //this.componentRef.destroy();
      for (let index = 0; index < this.lstComponentRef.length; index++) {
        this.lstComponentRef[index].destroy();
      }
      this.lstComponentRef = [];
  }

  hasComponents() {
    return this.lstComponentRef&&this.lstComponentRef.length>0; 
  }

}
