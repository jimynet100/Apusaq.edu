import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
//models
import { BaseInputComponent } from 'src/app/shared/components/dynamic-form/models/base-input.component';
import { Field } from 'src/app/shared/components/dynamic-form/models/field.interface';
import { SelectComponent, SelectComponentStyleEnum } from '../../components/select/select.component';


@Component({
  selector: 'form-select',
  template: `
    <ng-container [formGroup]="group">
      <app-select utilSelect [preConfig]="config" [estiloValidoInvalido]="getEstiloValidoInvalido()"  [formControlName]="config.name"></app-select>
    </ng-container>
  `
})
export class FormSelectComponent extends BaseInputComponent implements Field {
  @ViewChild(SelectComponent,{static: true} ) select: SelectComponent;
  /*
  postCreation(form:FormGroup){
    
  }*/

  ngOnInit() {
    let self = this;

    if (self.config.fnFiltro){
      let fn = self.config.fnFiltro;
      self.config.fnFiltro = function(){ 
        return fn(self.group);
      };
    }

    if (self.config.fnChangeComponent){
      let fn = self.config.fnChangeComponent;
      self.config['fnOnChange'] = function(value){ //form: FormGroup,component:any,value:any
        return fn(self.group,self.select,value);
      };
    }
   }
  /*
	getClassStyle():string{
    if (this.config && this.config.field){
      return this.config.field.valid?'ng-select-custom-valid':'ng-select-custom-invalid';
    }
    return '';
  }*/
  getEstiloValidoInvalido():any{
    if (this.config && this.config.field){
      if (this.config.readOnly){
        return 'read-only';
      }

      if (this.config.field.valid){
        return SelectComponentStyleEnum.VALIDO;
      }
      else{
        return SelectComponentStyleEnum.INVALIDO;
      }
      //return !this.config.field.valid;
    }
    return SelectComponentStyleEnum.NULO;
  }

  public actualizarPorPadre(group: FormGroup, formValue:any):any{
    this.select.actualizarPorPadre(formValue);
  };
  public resetPorPadre(){
    this.select.resetPorPadre();
  }

}
//[classStyle]="getClassStyle()"