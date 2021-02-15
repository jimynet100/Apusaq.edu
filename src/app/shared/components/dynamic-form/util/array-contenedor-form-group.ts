import { FormGroup, AbstractControl, FormControl, FormBuilder, FormArray } from "@angular/forms";
import { FieldConfig, FieldPadre, FormConfig } from "../models/field-config.interface";
import { BaseContenedorFormGroup, ItemFormGroup } from "./base-contenedor-form-group";
import { ObjectUtil } from "src/app/shared/util/objectutil";




export class ArrayContenedorFormGroup extends BaseContenedorFormGroup  {
    fieldArrayName='formArray';
    array:ItemFormGroup[]=[];

    constructor(fb: FormBuilder,  formConfig:FormConfig) {
        super(fb, formConfig);
        let self = this;
        self.formGroup = self.fb.group({'formArray': self.fb.array([])});

        if (formConfig.filas>0){
            self.updateMetaDataFormArray(new Array(formConfig.filas));/*si se espera iniciar el componente con n elementos */
        }

    }

    private updateMetaDataFormArray(value:any[]){
        let self = this;
        let cantidad = value.length;
        let cantidadActual = self.array.length;
        //eliminamos todo lo actual
        if (cantidadActual>0){
          self.removeAllField();
        }
        //creamos
        if (cantidad > 0){
          let array:ItemFormGroup[] = [];
          let arrayFormGroup:FormGroup[] = [];
          for(let i = 0; i < cantidad; i++){
            let item = self.createItemFormGroup(this.formConfig.arrayFieldConfig, true);
            arrayFormGroup.push(item.formGroup);
            array.push(item);
          }
          self.formGroup.setControl(self.fieldArrayName,self.fb.array(arrayFormGroup));
          self.array = array;
        }
      }



   /*Permite borrar los Field del formulario*/
  public removeAllField(){
    let self = this;
    self.array = [];
    self.formGroup.setControl(self.fieldArrayName,self.fb.array([]));/* se elimina todo para evitar activar eventos por cambio de cantidad de elementos */
    self.formGroup.updateValueAndValidity();
  }

  public clearAndRemoveAllField(){
    let self = this;
      self.removeAllField();
      self.setValue([]);
  }

  /*
  private createItemFormGroup():ItemFormGroup{
    let self = this;
    let arrayFieldConfig = ObjectUtil.copiarObjTodoNivel(self.formConfig.arrayFieldConfig);
    let formGroup:FormGroup = self.createItemFormGroup(arrayFieldConfig);
    return {formGroup:formGroup, arrayFieldConfig: arrayFieldConfig};
  }*/

  public getArrayItemFormGroup(){
      return this.array;
  }

  public getValue():any{
    let self = this;
    return  self.formGroup ? self.getFormArray().value : null;
  }

  public setValue(value: any){//(value: {[key: string]: any} | Array<any>)
    let self = this;
    if (self.hasControls){
       if (value instanceof Array){
            self.updateMetaDataFormArray(value);
            self.getFormArray().patchValue(value);
        }
    }
    else{
      self.valueSinAsignar = value;
    }
  }


   /* permite agregar una fila de los formularios array */
   public agregarItemFormGroup():ItemFormGroup{
    let self = this;
    let item = self.createItemFormGroup(this.formConfig.arrayFieldConfig, true);
    self.getFormArray().push(item.formGroup);
    self.array.push(item);
    return item;
  }

  /* permite eliminar una fila de los formularios array */
  public eliminarFormGroupContenedor(index){
    let self = this;
    self.array.splice(index,1);
    let formArray = self.getFormArray();
    formArray.removeAt(index);
  }

  public getFormArray():FormArray{
    let self = this;
    return (self.formGroup.get(self.fieldArrayName) as FormArray);
  }
  public patchValue(value):void{
    let self = this;
    self.getFormArray().patchValue(value);
  }
}
/*
get hasControls():boolean{ 
  let controls = self.controls;
  if (controls){
    if (!self.isArray && Object.keys(controls).length>0)
      return true;
    else if (self.isArray && self.getFormArray().length > 0)
      return true;
  }
  return false;
}*/