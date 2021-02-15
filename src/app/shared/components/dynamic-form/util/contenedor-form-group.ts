import { FormBuilder } from "@angular/forms";
import { FormConfig } from "../models/field-config.interface";
import { BaseContenedorFormGroup } from "./base-contenedor-form-group";

export class ContenedorFormGroup extends BaseContenedorFormGroup {

    constructor(fb: FormBuilder,  formConfig:FormConfig) {
        super(fb,formConfig);
        let  self = this;
        let  item = self.createItemFormGroup(formConfig.arrayFieldConfig);
        self.formGroup = item.formGroup;
        self.arrayControl = item.arrayControl;
    }
    public getValue():any{
        let self = this;
        return self.formGroup ? self.formGroup.value : null;
    }
    
    public setValue(value: any){//(value: {[key: string]: any} | Array<any>)
        let self = this;
        if (self.hasControls){//cuando se setee el valor podria no existir el componente
            self.formGroup.patchValue(value || {});
        }
        else{
            self.valueSinAsignar = value;
        }
      }

    public removeAllField(){
        let self = this;
        self.formConfig.arrayFieldConfig = [];
        Object.keys(self.formGroup.controls).forEach(name=>{
            self.formGroup.removeControl(name);
        });
        self.formGroup.updateValueAndValidity();
    }
    public clearAndRemoveAllField(){
        let self = this;
        if (self.hasControls){
            self.formGroup.reset();
            self.removeAllField();
            self.setValue({});
        }
    }
    public patchValue(value){
        let self = this;
        self.getFormGroup().patchValue(value);
    }
}