import { Component, OnInit, Input, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap, tap } from 'rxjs/operators'
import { NgSelectComponent } from '@ng-select/ng-select';
import { ObjectUtil } from 'src/app/shared/util/objectutil';

export interface SearchConfig {
  placeholder?:string;
  propertyLabel?:string;
  propertyValue?:string;
  fnSearch: (filtro: any) => Observable<any[]>;
  fnFiltroValue: (value) => Observable<any[]>;//funcion que se ejecuta cuando se setea el value
  fnFiltro: () => any;
  fnFiltroPorTexto: (term: string) => any;
  filtro?: any;
  filtroBase?: any;
  propagarObjeto?:boolean;
  propagarPropiedad?:string;
  fnOnAdd: (value) => void;
  fnOnChange: (value) => void;
  fnOnRemove: (value) => void;
  fnTemplate?:(value: any, select: NgSelectComponent) => string;
  fnTemplateLabel?:(value: any, select: NgSelectComponent) => string;
  showButton?:boolean;
  fnShowButton?:(value:any) => boolean;
  fnOnClickButton?:(component:SearchComponent) => any;
}

@Component({
  selector: 'app-search',
  template: `
  <table style="width:100%; border-collapse: collapse; border-spacing: 0px; border: none; padding: 0;">
    <tbody>
      <tr style="border: none; padding: 0;">
        <td style="border: none; padding: 0;">
          <ng-select
             #select 
             [ngClass]="estiloValidoInvalido"
             [items]="data"
             [placeholder]="config.placeholder"
             [bindLabel]="config.propertyLabel"
             [loading]="loading"
             [typeahead]="typeahead"
             (add)="onAdd($event)"
             (remove)="onRemove($event)"
             (change)="onChange($event)"
             [(ngModel)]="value">
             <ng-template *ngIf="config.fnTemplate" ng-option-tmp let-item="item" let-search="searchTerm">
                  <div innerHTML="{{crearTemplate(item)}}"></div>
              </ng-template>
              <ng-template *ngIf="config.fnTemplateLabel" ng-label-tmp let-item="item">
                  <div innerHTML="{{crearTemplateLabel(item)}}"></div>
              </ng-template>
          </ng-select>
        </td>
        <td *ngIf="mostrarBoton()" style="width:30px">
          <button type="button" (click)="onClickButton()" class="btn btn-outline-info"><i title="Editar" class="fa fa-plus" ></i></button>
        </td>
      </tr>
    </tbody>
  </table>
      
    `,
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SearchComponent),
        multi: true
      }
    ]
})
export class SearchComponent implements ControlValueAccessor, OnInit {
  @ViewChild(NgSelectComponent,{static: true} ) select: NgSelectComponent;
  data: any[] = [];
  loading = false;
  typeahead = new Subject<string>();
  _estiloValidoInvalido:string;
  @Input() config:SearchConfig;
  propagateChange = (_: any) => {};
  _value:any;
  _filtro;

  constructor(private cd: ChangeDetectorRef)  {}

  @Input() set estiloValidoInvalido(value){
    this._estiloValidoInvalido = value;
  }

  get estiloValidoInvalido(){
    return this._estiloValidoInvalido;
  }

  @Input() set filtro(value) {
    if (value){
      if (value['reset']){//reseta la data del combo
        this.reset();  
      }
      else{
        this._filtro = value;
      }
    }
  }

  get filtro() {
    return this._filtro;
  }

  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val;
    this.propagarCambio();
  }
  writeValue(value: any) {//se debe implementar en la busqueda
    if (value) {
      //this.value = value;
      this.buscarPorFiltroValue(value);
    }
    else{
      this.reset();
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched() {}

  
  ngOnInit() {
     this.iniciar();
  }

  private buscarPorFiltroValue(value){
    this.fnSearchPadre(this.config.fnFiltroValue(value)).subscribe(r => {
      //debugger;
      this.data = r;
      this.value = r[0];
    });
  }

  public iniciar() {
     if (this.config){
      this.typeahead.pipe(
        //tap(() => this.loading = true),
        distinctUntilChanged(),
        debounceTime(200),
        switchMap(term => {
           this.loading = true;
           let filtro = this.config.fnFiltroPorTexto(term);
           return this.fnSearchPadre(filtro);
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
  }

  private propagarCambio(){
    if (this._value){
      if (this.config && this.config.propagarObjeto){
        this.propagateChange(this._value);
      }
      else if (this.config && this.config.propagarPropiedad){
        this.propagateChange(this._value[this.config.propagarPropiedad]);
      }
      else{
        this.propagateChange(this._value[this.config.propertyValue]);
      }
    }
    else{
      this.propagateChange(null);
    }
  }

  public reset() {
    this.data = [];
    this.loading = false;
    this._value = null;
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

  crearTemplate(item){
    return this.config.fnTemplate(item,this.select);
  }

  crearTemplateLabel(item){
    return this.config.fnTemplateLabel(item,this.select);
  }


  onClickButton(){
    this.config.fnOnClickButton(this);
  }

  mostrarBoton(){
    return this.config.showButton || (this.config.fnShowButton && this.config.fnShowButton(this.value));
  }
  /*
  public actualizar() {
    this.writeValue(this._value+""); // Se fuerza la actualización del componente con (+"")
  }*/

  fnSearchPadre(fil:any):Observable<any[]>{
    let filtro = this.config.fnFiltro?this.config.fnFiltro():{};//filtro funcion
    filtro = ObjectUtil.unirObj(filtro,this.config.filtroBase);//filtro base objeto
    filtro = ObjectUtil.unirObj(filtro,this.config.filtro);//fusionamos los filtros
    filtro = ObjectUtil.unirObj(this.filtro,filtro);//fusionamos los filtros

    filtro = ObjectUtil.unirObj(filtro,fil);//fusionamos los filtros
    return this.config.fnSearch(filtro);
  }


}
