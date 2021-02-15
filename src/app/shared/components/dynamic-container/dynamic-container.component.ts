import { Component, OnInit,ViewChild, ViewContainerRef, ComponentFactoryResolver,ComponentRef, ComponentFactory,Type, Input, Output, EventEmitter } from '@angular/core';


export interface ConfigDynamicContainer {
  fnGenerateIdComponentFromMetaData: (metaDataItem: any) => string;/*genera el id desde la data que crea componentes*/ 
  fnGenerateIdComponentFromValue: (value: any) => string;/*genera el id desde el value que se setea al componentes*/ 
  clase:Type<any>;
}

@Component({
  selector: 'app-dynamic-container',
  template: `
    <template #container></template>
  `
})
export class DynamicContainerComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef,static:true }) entry: ViewContainerRef;
  protected lstComponentRef:any[]=[];
  protected mapComponentPorId = new Map();
  private _metadata:any[]; 
  private _value:any[];
  private iniciado:boolean=false;
  @Output() metadataChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() metadataExisteChange: EventEmitter<DynamicContainerComponent> = new EventEmitter<DynamicContainerComponent>();
  @Input() config:ConfigDynamicContainer;
  constructor(private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
  }

  @Input()
  set metadata(val) {
    //debugger;
    this._metadata = val;
    this.destroyComponents();
    this.metadataChange.emit(this);
    if (val && val.length>0){
      this.metadataExisteChange.emit(this);
      this.createComponentFromMetaData();
    }
  }

  get metadata() {
    return this._metadata;
  }

  private createComponent(clase:Type<any>, item:any):any{
    const factory = this.resolver.resolveComponentFactory(clase);
    const componentRef = this.entry.createComponent(factory);
    this.lstComponentRef.push(componentRef);
    if (this.config.fnGenerateIdComponentFromMetaData){
      this.mapComponentPorId.set(this.config.fnGenerateIdComponentFromMetaData(item),componentRef.instance)
    }
    return componentRef.instance;
  }

  public createComponentFromMetaData(){
    let self = this;
    if(self.config && self.metadata && self.metadata.length){
      
      self.metadata.forEach(item=>{
        let con:any = self.createComponent(self.config.clase, item);
        con.iniciar(item);
      });
      this.iniciado = true;
      this.cargarValue();
    }
  }

  public destroyComponents() {
    if (this.lstComponentRef.length>0){
      for (let index = 0; index < this.lstComponentRef.length; index++) {
        this.lstComponentRef[index].destroy();
      }
      this.lstComponentRef = [];
      this.mapComponentPorId = new Map();
    }
    this.iniciado = false;
  }

  get value() {
    let r=[];
    if (this.lstComponentRef && this.lstComponentRef.length>0){
      this.mapComponentPorId.forEach((comp, key)=>{
        let val = comp.value;
        if (val){
          r.push(val);
        }
      });
    }
    return r;
  }

  @Input()
  set value(val) {
    this._value = val;
    this.cargarValue();
  }



  private cargarValue(){
    if (this._value && this.iniciado){
      this._value.forEach(val=>{
        let key = this.config.fnGenerateIdComponentFromValue(val);
        this.mapComponentPorId.get(key).value = val;
      });
      //una vez cargado se destruye 
      this._value = null;
    }
  }

}
