import { Component, EventEmitter, Input, OnChanges, OnInit, Output,ViewChild,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder,FormArray, FormControl, AbstractControl } from '@angular/forms';

import { FieldConfig, FormConfig, FieldPadre } from '../../models/field-config.interface';
import { ObjectUtil } from 'src/app/shared/util/objectutil';
import { GeneralService } from '../../../../services/base/general.service';
import { ContenedorFormGroup } from '../../util/contenedor-form-group';
import { ArrayContenedorFormGroup } from '../../util/array-contenedor-form-group';
import { BaseContenedorFormGroup } from '../../util/base-contenedor-form-group';
import { ContenedorFormControl } from '../../util/contenedor-form-control';



@Component({
  exportAs: 'dynamicForm',
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})//invalid:{{item.field.invalid}} ,touched:{{item.field.touched}} ,dirty:{{item.field.dirty}}  
export class DynamicFormComponent implements OnChanges, OnInit, AfterViewInit {
  _config: FormConfig; 
  contenedorFormGroup:ContenedorFormGroup;
  arrayContenedorFormGroup:ArrayContenedorFormGroup;

  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  get controls():{[key: string]: AbstractControl} { return this.form?this.form.controls:null; }
  get hasControls():boolean{/* indica si ya se crearon los controles */
    return this.getContenedor() && this.getContenedor().hasControls();
  }

  //get changes() { return this.form.valueChanges; }
  valid():boolean { return this.getForm().valid; }
  get errors() { return this.form.value; }
  valueSinAsignar:any;
  constructor(private fb: FormBuilder, private generalService: GeneralService) { }

  ngOnInit() {
  }

  onControlCreateComplete(){
    if (this.valueSinAsignar!=null){
      this.value = this.valueSinAsignar;
    }

    
  }

  onFormCreateComplete(){
    if (this.valueSinAsignar!=null){
      this.value = this.valueSinAsignar;
    }
    if (this.config.fnFormCreateComplete){
      this.config.fnFormCreateComplete(this.getForm(),this);
    }
  }

  get value() {
    let self = this;
    if (self.hasControls) return self.getContenedor().getValue();
    return null; 
  }

  set value(value:any){
    let self = this;
    if (self.hasControls){
       self.getContenedor().setValue(value);
    }
    else{
      self.valueSinAsignar = value;
    }
  }

  public getValue(name: string){
    return this.getContenedor().getControlValue(name);
  }

  public setValue(name: string, value: any) {
    this.getContenedor().setControlValue(name,value);
  }

  public patchValue(value){
    this.getContenedor().patchValue(value);
  }

  public getForm(): FormGroup{
    return this.getContenedor().getFormGroup();
  }

  public getFormArray():FormArray{
    let self = this;
    return self.arrayContenedorFormGroup.getFormArray();
  }
  /*
    this.form.changes.subscribe(() => {
      if (this.form.valid !== previousValid) {
        previousValid = this.form.valid;
        this.form.setDisabled('buscar', !previousValid);
      }
    });
  */

  ngOnChanges() {
    //console.log('DynamicFormComponent.ngOnChanges');
    /*
    if (this.form) {
      
      const controls = Object.keys(this.form.controls);
      const configControls = this.controls.map((item) => item.name);

      controls
        .filter((control) => !configControls.includes(control))
        .forEach((control) => this.form.removeControl(control));

      configControls
        .filter((control) => !controls.includes(control))
        .forEach((name) => {
          const config = this.arrayFieldConfig.find((control) => control.name === name);
          this.form.addControl(name, this.createControl(config));
        });
    }*/
  }
  
  @Input()
  set config(formConfig:FormConfig){
    if (formConfig!=null){
      if (formConfig.value)
        this.value = formConfig.value;
      this._config = formConfig;
      this.iniciarComponente(formConfig);
    }
  }

  get config():FormConfig{
    return this._config;
  }

  private iniciarComponente(formConfig:FormConfig){
    let self = this;
    if (formConfig)
    {
      formConfig.getDynamicFormComponent = () => self;
      formConfig.getForm = () => self.form;

      if (formConfig.isArray){
        let arrayContenedorFormGroup = new ArrayContenedorFormGroup(self.fb,formConfig);
        self.form = arrayContenedorFormGroup.getFormGroup();
        self.arrayContenedorFormGroup = arrayContenedorFormGroup;
      }
      else{
        let contenedorFormGroup = new ContenedorFormGroup(self.fb,formConfig);
        self.form = contenedorFormGroup.getFormGroup();
        self.onControlCreateComplete();
        self.contenedorFormGroup = contenedorFormGroup;
      }
      
      if (formConfig.fnChange){
        self.form.valueChanges.subscribe(change => {
          formConfig.fnChange(self.form,change);
        })
      }
      if (formConfig.fnChangeStatus || formConfig.fnChangeStatusValid){
        self.form.statusChanges.subscribe(status => {//self.form.controls
          //fnChangeStatus?:(form: FormGroup,status:string)
          if (self.hasControls){
            if (formConfig.fnChangeStatus){
              formConfig.fnChangeStatus(self.getForm(), status);
            }
            if (formConfig.fnChangeStatusValid && 'VALID' == status){/* tener cuidado porque se activa cuando los controles se crean y los componentes no existen, un falso valido */
              formConfig.fnChangeStatusValid(self.getForm());
            }
          }
        }); 
      }

      self.onFormCreateComplete();
    }
  }

  public agregarFormGroupContenedor (){
    this.arrayContenedorFormGroup.agregarItemFormGroup();
  }

  public get isArray():boolean{
    return this._config!=null && this._config.isArray;
  }


  /* permite eliminar una fila de los formularios array */
  private eliminarFormGroupContenedor(index){
    this.arrayContenedorFormGroup.eliminarFormGroupContenedor(index);
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.submit.emit(this.value);
  }

  setDisabled(name: string, disable: boolean) {
    if (this.form && this.form.controls && this.form.controls[name]) {
      const method = disable ? 'disable': 'enable';
      this.form.controls[name][method]();
      return;
    }

    this.getArrayFieldConfig().map((item) => {
      if (item.name === name) {
        item.disabled = disable;
      }
      return item;
    });
  }

  setDisabledAll(disable: boolean) {
    let self = this;
    if (this.form && this.form.controls ) {
      const method = disable ? 'disable': 'enable';
      this.getArrayFieldConfig().forEach(field => {
        self.form.controls[field.name][method]()
      });
      return;
    }

    self.getArrayFieldConfig().map((item) => {
        item.disabled = disable;
      return item;
    });
  }

  existeControl(name: string){
    return this.form && this.form.controls && this.form.controls[name];
  }



  

  getAllErrors(){
    this.getAllErrorsBase(this.form);
  }


  getAllErrorsBase(form: FormGroup | FormArray): { [key: string]: any; } | null {
    let hasError = false;
    const result = Object.keys(form.controls).reduce((acc, key) => {
        const control = form.get(key);
        const errors = (control instanceof FormGroup || control instanceof FormArray)
            ? this.getAllErrorsBase(control)
            : control.errors;
        if (errors) {
            acc[key] = errors;
            hasError = true;
        }
        return acc;
    }, {} as { [key: string]: any; });
    return hasError ? result : null;
  }

  getReferencia(){
    return this;
  }
  /*
  addComponent(component:any,index:number){
    this.arrayFieldConfig[index].component = component;
  }*/

  ngAfterViewInit(){
    //console.log('DynamicFormComponent.ngAfterViewInit');
    //postCreation

    /* revisar urgente
    this.arrayFieldConfig.forEach(control => {
      control.component.postCreation(this.form);
      
      if (control.fnChange){
        control.field.valueChanges.subscribe(value => {
          control.fnChange(this.form,value);
        });
      }
    });*/
  }

  postCreacionComponente(){
    let self = this;
    if (!self.hasControls) return;
    if (!self.isArray){
      self.postCreationComponentFormGroup(self.form, self.getArrayFieldConfig());
    }
    else if (self.getArrayItemFormGroup()){
      self.getArrayItemFormGroup().forEach(formGroupContenedor=>{
        self.postCreationComponentFormGroup(formGroupContenedor.formGroup, formGroupContenedor.arrayFieldConfig);
      });
    }
    
  }

  /* se debe ejecutar luego de que un componente es creado */
  postCreationComponentFormGroup(formGroup:FormGroup, arrayFieldConfig: FieldConfig[]){
    arrayFieldConfig.forEach(fieldConfig => {
      //fieldConfig.component.postCreation(formGroup);
      if (fieldConfig.fnChange){
        fieldConfig.field.valueChanges.subscribe(value => {
          fieldConfig.fnChange(formGroup,value);
        });
      }
    });
  }



  /*Permite borrar los Field del formulario*/
  public removeAllField(){
    let self = this;
    if (!self.hasControls) {return;}
    self.getContenedor().removeAllField();
  }

  /*Permite borrar los Field del formulario*/
  public clearAndRemoveAllField(){
    let self = this;
    if (!self.hasControls) {return;}
    self.getContenedor().clearAndRemoveAllField();
  }

  private createFiltroData(filtroCustom?:any):any{
    let filtro = this.getFormConfig().fnFiltroData?this.getFormConfig().fnFiltroData(this.getForm()):{};
    filtro = filtroCustom?ObjectUtil.unirObj(filtro,filtroCustom):filtro;
    return filtro;
  }

  public loadData(filtroCustom?:any,fnComplete?:(result)=>void) {
    let self = this;

    self.generalService.createPost(self.getFormConfig().urlData,self.createFiltroData(filtroCustom)).subscribe({
      next: (result: any) => {
        if (result){
          self.value = result;  
        }
        else{
          
        }
        if (fnComplete){
          fnComplete(result);
        }
      }, 
      error: (error: any) => {

      }, 
      complete: () => {}
    });
  }


  

  mostrarTitulo(){
    let self = this;
    return self.getFormConfig().mostrarAgregar || (self.getFormConfig().titulo && self.getArrayItemFormGroup().length>0);
  }
  mostrarTituloColumnaSuperior(){
    let self = this;
    return self.getArrayItemFormGroup().length>0 && self.getFormConfig().mostrarTituloColumnaSuperior;
  }
  mostrarFormArray(){
    let self = this;
    /*
    if(self.isArray && (self.getFormConfig().mostrarAgregar || self.getArrayItemFormGroup().length>0)){
      debugger;
    }*/
    return self.isArray && (self.getFormConfig().mostrarAgregar || self.getArrayItemFormGroup().length>0);
  }
  mostrarFormulario():boolean{
    let self = this;
    return self.hasControls && (!self.getFormConfig().fnIsVisible!=null || self.getFormConfig().fnIsVisible(self));
  }
  getArrayItemFormGroup(){
    return this.arrayContenedorFormGroup.getArrayItemFormGroup();
  }

  getContenedor():BaseContenedorFormGroup{
    return this.isArray?this.arrayContenedorFormGroup:this.contenedorFormGroup;
  }
  getRows():number{
    return this.getArrayItemFormGroup().length;
  }

  getArrayFieldConfig():FieldConfig[]{
    return this.getContenedor().existFormGroup()?this.getContenedor().getArrayFieldConfig():[];
  } 
  getFormConfig():FormConfig{
    return this.getContenedor().getFormConfig();
  } 

  public getArrayControl():ContenedorFormControl[]{
    return this.getContenedor().getArrayControl();
  }

  validarControl(control){
    return control!=null;
  }

  reset(){
    this.form.reset();
    //this.form.markAllAsTouched();
    //this.form.markAsUntouched();
    this.form.markAsPristine();
    /*
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key).setErrors(null) ;
    });*/
  }

  validate(){
    const self = this;
    /* desactivamos los field que no son visibles */
    self.contenedorFormGroup.getArrayControl().forEach((cont:ContenedorFormControl)=>{
      if (!cont.isVisible()) cont.getFormControl().disable({emitEvent:false});
    });

    self.form.updateValueAndValidity();
    self.validateBase(self.form);

    setTimeout(function(){
      self.contenedorFormGroup.getArrayControl().forEach((cont:ContenedorFormControl)=>{
        if (!cont.isVisible()) cont.getFormControl().enable({emitEvent:false});
      });
    },1000);
  }

  validateBase(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateBase(control);            //{6}
      }
    });
  }
}

