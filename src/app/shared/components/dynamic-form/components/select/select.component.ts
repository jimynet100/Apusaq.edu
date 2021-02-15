import { Component, OnInit,Input, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap, tap } from 'rxjs/operators'
import { NgSelectComponent } from '@ng-select/ng-select';
import { FieldPadre, FieldConfig } from '../../models/field-config.interface';
import { GeneralService } from 'src/app/shared/services/base/general.service';
import { FiltroBase } from 'src/app/shared/filtro/filtrobase';
import { ObjectUtil } from 'src/app/shared/util/objectutil';
import { ClientSessionStorageService } from 'src/app/shared/services/util/client-session-storage.service';




export interface SelectConfig extends FieldConfig {

  propertyLabel?:string; 
  propertyValue?:string;
  fnSearch: (filtro: any) => Observable<any[]>;
  fnFiltroValue: (value) => Observable<any[]>;//funcion que se ejecuta cuando se setea el value
  fnFiltro: () => any;
  filtro?: any;
  filtroBase?: any;
  fnOnAdd: (value) => void;
  fnOnChange: (value) => void;
  fnOnRemove: (value) => void;
  propagarObjeto?:boolean;
  propagarPropiedad?:string;
  selectMultiple?:boolean;
  searchOnLine?:boolean;
  fnTemplate?:(value: any, select: any | NgSelectComponent) => string;
  fnTemplateLabel?:(value: any, select: any | NgSelectComponent) => string;
  seleccionarSiSoloUno?:boolean;
  clearable?:boolean;
  fieldPadre?:FieldPadre[];
  closeOnSelect?:boolean;
  showButton?:boolean;
  fnOnClickButton?:(component:SelectComponent) => any;
  searchable?:boolean;
  url?:string;
  addTag?:boolean;
  isOpen?:boolean;
  hideSelected?:boolean;
  useMapValue?:boolean;//los filtros que se envian al servidor se envian dentro de la propiedad MapValue
  cache?:boolean;
}

export enum SelectComponentStyleEnum
{
    NULO = '',
    VALIDO = 'ng-select-custom-valid',
    INVALIDO = 'ng-select-custom-invalid',
    FORZADO_INVALIDO = 'ng-select-forzado-invalid' /* INVALIDO FORZADO NO NECESITA SER TOCADO POR EL USUARIO */
}

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',//class='ng-select-custom'  class="disable-arrow disable-dropdown disable-clear-all"
    //[ngClass]="{'ng-select-custom':classStyle==null, 'ng-select-custom-valid': classStyle==='ng-select-custom-valid', 'ng-select-custom-invalid': classStyle==='ng-select-custom-invalid'}"
    styleUrls: ['./select.component.css'],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectComponent),
        multi: true
      }
    ]
})
export class SelectComponent implements ControlValueAccessor, OnInit {//Validator
  
  @ViewChild('selectTemplate',{static: true}) selectTemplate: ElementRef;
  @ViewChild(NgSelectComponent ,{static: false}) select: NgSelectComponent;
  //@Input() marcarConEstiloInvalido?:boolean=null;
  disabled:boolean=false;
  preDisabled:boolean=false;
  data;
  loading = false;
  @Input() configBase:SelectConfig=<SelectConfig>{
    clearable:true,
    closeOnSelect:true
  };
  //_config:SelectConfig;
  private onTouchedCallback: () => void;
  private onChangeCallback: (_: any) => void;
  _value;
  valuePadre;//objeto que contiene todos los valores asociados a los fields del padre
  _filtro;
  //busqueda multiple base de datos 
  typeahead;
  valueLabel;/* se usa en el estado de solo lectura */

  constructor(private cd: ChangeDetectorRef, private generalService: GeneralService, private clientSessionStorageService: ClientSessionStorageService)  {}

  @Input() estiloValidoInvalido;
  @Input() config:SelectConfig;


  @Input() set filtro(value) {
    if (value){
      if (value['reset']){//reseta la data del combo
        this.resetData();  
      }
      else{
        this._filtro = value;
        this.actualizar();
      }
    }
  }

  get filtro() {
    return this._filtro;
  }

  get value() {
    return this._value;
  }
  set value(value) {
    let self = this;
    self._value = value;
    self.propagarCambio();
  }

  writeValue(value: any) {//se debe implementar en la busqueda
    //console.log('SelectComponent.writeValue');
    let self = this;
    //debugger;
    if (value !== undefined) {
      if (self.config.searchOnLine && value!=null){
        self._value = value;
        this.config.fnSearch(self.getFiltro({identificador: value, maxRow: 1})).subscribe(r => {
          this.data = r;
        });
      }
      else if (self.config.fnFiltroValue){
        self.buscarPorFiltroValue(value);
      }
      else{
        self._value = value;//no se debe activar el propagar cambio debido a que activa el evento change
      }
    }
  }

  private buscarPorFiltroValue(value){//logica para refrescar el combo en base al valor seteado
    this.config.fnSearch(this.config.fnFiltroValue(value)).subscribe(r => {
      this.data = r;
      this.value = r[0];
    });
  }

  //From ControlValueAccessor interface
  registerOnChange(fn) {
    this.onChangeCallback = fn;
  }
  //From ControlValueAccessor interface
  registerOnTouched(fn: any): void
  {
    this.onTouchedCallback = fn;
  }

  //Set touched on blur
  onBlur() {
    this.onTouchedCallback(); 
  }

  
  ngOnInit() {
    this.iniciar();
  }

  private processFilterUseMapValue(filter): FiltroBase{
    let newFilter = new FiltroBase();
    let defaultKeys = ["rolId", "pageId", "queryId", "mapValue", "url", "startRow", "endRow", "total", "totalPorPagina", "maxRow", "termino", "identificador", "historico"];//Object.keys(newFilter);
    let filterKeys = Object.keys(filter);
    newFilter.mapValue = {};
    for (let key of filterKeys){
      if (defaultKeys.includes(key)){
        newFilter[key] = filter[key];
      }
      else{
        newFilter.mapValue[key] = filter[key];
      }
    }
    return newFilter;
  }

  iniciar(){
    //console.log('SelectComponent.iniciar');
    let self = this;
    if (self.config && self.config.url){
      self.config.fnSearch = function(filtro:any):Observable<any[]>{
        let internalFilter = self.config.useMapValue ? self.processFilterUseMapValue(filtro) : filtro;
        return self.generalService.createPost(self.config.url,internalFilter);
      };
    }
    self.config = <SelectConfig>ObjectUtil.unirObj(self.config,self.configBase);
    //si es busqueda en linea en base de datos
    if (self.config.searchOnLine){
      self.iniciarSearchOnLine();
    }
    self.actualizar();
  }

  iniciarSearchOnLine(){
    let self = this;
    this.typeahead = new Subject<string>();
    self.config.searchable = true;
    this.typeahead.pipe(
      //tap(() => this.loading = true),
      distinctUntilChanged(),
      debounceTime(200),
      switchMap(termino => {
            this.loading = true;
            return self.config.fnSearch(self.getFiltro({termino:termino, maxRow: 10}));
          }
        ),
      ).subscribe(
      data => {
          this.data = data;
          this.cd.markForCheck();
          this.loading = false;
        },
        error=>{
          this.loading = false;
        }, 
        () => {
          this.data = [];
          this.loading = false;
        });
  }

  

 getFiltro(filtroAdicional?:object){
   //debugger;
  let filtro = this.config.fnFiltro?this.config.fnFiltro():{};//filtro funcion
  filtro = ObjectUtil.unirObj(filtro,this.config.filtroBase);//filtro base objeto
  filtro = ObjectUtil.unirObj(filtro,this.config.filtro);//fusionamos los filtros
  filtro = ObjectUtil.unirObj(this.filtro,filtro);//fusionamos los filtros
  filtro = ObjectUtil.unirObj(this.getFiltroPadre(),filtro);//filtro de field padre
  filtro = ObjectUtil.unirObj(filtro,filtroAdicional);
  return filtro;
 }

 public resetPorPadre(){
   //debugger;
  this.value = null;
  this.resetData();
 }

  public actualizarPorPadre(value) {
    let self = this;
    self.valuePadre = value;
    self.actualizar();  
    self.value = null;
  }

  public actualizar() {
    let self = this;
    if (!self.config || !self.config.fnSearch || !self.isFiltroPadreCumpleRequerido()){
      //throw new Error('SelectComponent => configuracion incorrecta: ' + (this.config?JSON.stringify(this.config):'null'));
      return;
    }
    if (!self.config.searchOnLine){
      self.actualizarSelectBase();
    }
    else{
      
    }
  }

  private completeActualizarSelectBase(){
    let self = this;
    self.loading = false;
    if (self.config.seleccionarSiSoloUno && self.data.length==1){
        self.value = self.data[0][self.config.propertyValue];
        self.onChange(self.data[0]);
      }
      self.actualizarValueLabel();
  }

  actualizarSelectBase(){
    let self = this;
    self.loading = true;
    let cacheId;
    let filter = self.getFiltro();
    let r = null;
    //self.config.cache = true;
    if (self.config.cache){
      let filtroStr = filter ? JSON.stringify(filter) : '';
      cacheId = self.config.url + filtroStr;
      r = self.clientSessionStorageService.getSessionStorage(cacheId);
    }

    if (!r) {
      self.config.fnSearch(filter).subscribe({
          next: (result: any) => {
            self.data = result;
            if (self.config.cache)/* solo si el cache esta activado */
              self.clientSessionStorageService.saveSessionStorage(cacheId, result);
          }, 
          error: (error: any) => {
            self.loading = false;
          }, 
          complete: () => {
            self.completeActualizarSelectBase();
          }
        }
      );
    }
    else{
      self.data =  r;
      self.completeActualizarSelectBase();
    }
  }



  actualizarValueLabel(){
    const self = this;
    if (self.value!=null && self.data.length > 0){
      let val = self.data.filter(item=>item[self.config.propertyValue] == self.value);
      if (val && val.length>0){
        self.valueLabel = val[0][self.config.propertyLabel];
      }
    }
  }
  


  public resetData() {
    
    this.data = [];
    /*
    this.data = Observable.create(observer => {
      observer.next([]);
      observer.complete();
    });*/
  }

  private propagarCambio(){
    const self = this;
    if (!self.onChangeCallback) return;
    if (self._value){
      if (self.config && self.config.propagarObjeto){
        self.onChangeCallback(self._value);
      }
      else if (self.config && self.config.propagarPropiedad){
        self.onChangeCallback(self._value[self.config.propagarPropiedad]);
      }
      else{
        self.onChangeCallback(self._value);
      }
    }
    else{
      self.onChangeCallback(null);
    }
  }

  onAdd(event){
    if (this.config.fnOnAdd){
      this.config.fnOnAdd(event);

    }
  }

  onRemove(event){
    if (this.config.fnOnRemove){
      this.config.fnOnRemove(event);
    }
  }

  onChange(event){
    if (this.config.fnOnChange){
      this.config.fnOnChange(event);
    }
  }

  //filtro que se llena a partir de otros datos 
  getFiltroPadre(){//objeto que contiene todo el formulario
    let filtro = {};
    let value = this.valuePadre || {};
    let fieldPadre = this.config.fieldPadre
    if ( fieldPadre && fieldPadre.length>0){
      fieldPadre.forEach(padre => {
        let campo = padre.nameFiltro || padre.name;
        filtro[campo] = value[padre.name];
      });
    }
    return filtro;
  }

  isFiltroPadreCumpleRequerido():boolean{//cuando todos los campos asociados al filtro padre son distintos de nulo
    let value = this.getFiltroPadre();
    let fieldPadre = this.config.fieldPadre
    if ( fieldPadre && fieldPadre.length>0){
      for (let i = 0; i < fieldPadre.length; i++) {
        let campo = fieldPadre[i].nameFiltro || fieldPadre[i].name;
        if (fieldPadre[i].required && !value[campo]){
          return false;
        }
      }
    }
    return true;
  }


  getNgSelectComponent():NgSelectComponent{
    return this.select;
  }

  onClickButton(){
    this.config.fnOnClickButton(this);
  }

  crearTemplate(item){
    return this.config.fnTemplate(item,this.select);
  }

  crearTemplateLabel(item){
    return this.config.fnTemplateLabel(item,this.select);
  }

  //necesario para transmitir el estado disabled
  setDisabledState(isDisabled: boolean): void {
    this.disabled  = isDisabled;
  }




  public getTypeTemplate(): number{
    const self = this;
    if (!self.config) return 0;
    else if (self.config.readOnly) return 1;
    else if (self.config.showButton) return 2;
    else return 3;
  }

}
