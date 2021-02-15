import { Input} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from 'src/app/shared/components/dynamic-form/models/field.interface';
import { FieldConfig } from 'src/app/shared/components/dynamic-form/models/field-config.interface';
import { ContenedorFormControl } from '../util/contenedor-form-control';

export abstract class BaseInputComponent implements Field {
  @Input() config: FieldConfig;
  public group: FormGroup;
  contenedorControl:ContenedorFormControl;

  /*
  get invalid(){
    if (this.config && this.config.field)
      return this.config.field.errors && this.config.field.touched;
    else
      return false;
  }
  get valid(){
    if (this.config && this.config.field)
      return !this.config.field.errors && this.config.field.touched;
    else
      return true;
  }*/
  get errorMessage(){
    let message='';
    
    
    if (this.config && this.config.field && this.config.field.errors){
      let errors = this.config.field.errors;
      //errors = errors['0']?errors['0']:errors;
      let errorsProps = Object.keys(errors);
      for (let key of errorsProps) {
        if (key){
          message = this.arrayErrorMessage[key];
        }
      }
    }
    return message;
  }

  arrayErrorMessage = {
    'minlength':'',
    'required':'El valor es requerido'
  };

  public actualizarPorPadre(group: FormGroup, formValue:any){}
  public resetPorPadre(){}


  public getContenedor(){
    
  }

  public fnTooltip(){
    if (this.config.fnTooltip){
      return this.config.fnTooltip(this.group);
    }
    return this.config.tooltip;
  }

  /*
  postCreation(form:FormGroup){
    
  }*/
}
