import { FormGroup, AbstractControl, FormControl, FormBuilder } from "@angular/forms";
import { FieldConfig, FieldPadre, FormConfig } from "../models/field-config.interface";
import { ContenedorFormControl } from "./contenedor-form-control";
import { ObjectUtil } from "src/app/shared/util/objectutil";


export interface ItemFormGroup{
  formGroup:FormGroup;
  arrayFieldConfig:FieldConfig[];
  arrayControl: ContenedorFormControl[];
}

export abstract class BaseContenedorFormGroup{
    protected formGroup: FormGroup;
    protected arrayControl: ContenedorFormControl[];
    protected valueSinAsignar:any;
    constructor(protected fb: FormBuilder,protected formConfig:FormConfig) {
      let self = this;
      self.actualizarFieldConfigDefaultValues(formConfig.arrayFieldConfig);
    }
    //let arrayFieldConfig = ObjectUtil.copiarObjTodoNivel(self.formConfig.arrayFieldConfig);
    protected createItemFormGroup(arrayFieldConfig:FieldConfig[], clonar:boolean=false):ItemFormGroup{
      let self = this;
      if (arrayFieldConfig && arrayFieldConfig.length==0) return;
      if (clonar){
        arrayFieldConfig = ObjectUtil.copiarObjTodoNivel(arrayFieldConfig);
      }
      let arrayControl = [];
      let formGroup = self.fb.group({});
      arrayFieldConfig.forEach(fieldConfig => {
        let contenedorControl = new ContenedorFormControl(self.fb, formGroup, self.formConfig , fieldConfig);
        arrayControl.push(contenedorControl);
        formGroup.addControl(fieldConfig.name, contenedorControl.getFormControl());
      });
      //para procesar la dependencia de padres
      arrayFieldConfig.forEach(fieldConfig => self.procesarDependencia(formGroup, fieldConfig));
      //self.arrayControl = arrayControl;
      return {
        arrayFieldConfig: arrayFieldConfig,
        formGroup: formGroup,
        arrayControl: arrayControl
      };
    }
    
    private procesarDependencia(group: FormGroup, fieldConfig:FieldConfig){
      let self = this;
      if (fieldConfig.fieldPadre!=null && fieldConfig.fieldPadre.length>0){
        fieldConfig.fieldPadre.forEach((padre:FieldPadre) => {    
          group.get(padre.name).valueChanges.subscribe(value => {
            if (fieldConfig.component){//no siempre existe
              //fieldConfig.component.actualizarPorPadre(group,formValue);
              self.actualizarPorPadre(group, fieldConfig, padre, value);
            }
            else{
              fieldConfig['fnPostCreationComponentUi'] = function(){//group: FormGroup, fieldConfig:FieldConfig
                //let formValue = Object.assign({},group.value);
                //fieldConfig.component.actualizarPorPadre(group,formValue);
                self.actualizarPorPadre(group, fieldConfig, padre, value);
              }
            }
          });  
        });
      }
    }

    private actualizarPorPadre(group: FormGroup, fieldConfig:FieldConfig, padre:FieldPadre, value){
      if (value){
        let formValue = Object.assign({},group.value);
        formValue[padre.name] = value;//seteamos el valor actual y actualizamos el combo 
        fieldConfig.component.actualizarPorPadre(group,formValue);
      }
      else{
        fieldConfig.component.resetPorPadre();
      }
    }

    public getFormGroup(){
      return this.formGroup;
    }

    public getArrayControl():ContenedorFormControl[]{
      return this.arrayControl;
    }

    private actualizarFieldConfigDefaultValues(arrayFieldConfig:FieldConfig[]){
      let self = this;
      arrayFieldConfig.forEach(fieldConfig => {
        fieldConfig['column'] = fieldConfig['column'] || 12;
        fieldConfig['placeholder'] = fieldConfig['placeholder'] || '';
        /*
        if (fieldConfig.fnFiltro){
          let fn = ObjectUtil.clonarFunction(fieldConfig.fnFiltro);
          fieldConfig.fnFiltro = () => { return fn(self.getForm())};
        }*/
      });
    }
    
    public existFormGroup():boolean{
      return this.formGroup!=null;
    }
    public hasControls():boolean{
      return this.existFormGroup() &&  this.formGroup.controls!=null && (Object.keys(this.formGroup.controls).length>0);
    }
    /*Permite remover los Field del formulario*/
    public abstract removeAllField():void;
    /*Permite limpiar la data y remover los Field del formulario*/
    public abstract clearAndRemoveAllField():void;
    public existControl(name: string):boolean{
      return this.hasControls() && this.formGroup.controls[name]!=null;
    }
    public getControl(name: string):AbstractControl{
      return this.hasControls() ? this.formGroup.controls[name]:null;
    } 
    public abstract getValue():any;
    public abstract setValue(value: any):void;

    public getControlValue(name: string):any{
      return this.getControl(name).value;
    }
  
    public setControlValue(name: string, value: any) {
      if (!this.existControl(name)) return null;
      this.getControl(name).setValue(value, {emitEvent: true});
    }
    public abstract patchValue(value):void;
    public getArrayFieldConfig():FieldConfig[]{
      return this.formConfig.arrayFieldConfig;
    }
    public getFormConfig():FormConfig{
      return this.formConfig;
    }
}