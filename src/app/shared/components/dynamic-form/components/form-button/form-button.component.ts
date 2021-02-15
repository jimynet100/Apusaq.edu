import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { ContenedorFormControl } from '../../util/contenedor-form-control';

@Component({
  selector: 'form-button',
  template: `
  <div
    [formGroup]="group">
    <button
      class="btn btn-primary"
      [disabled]="config.disabled"
      type="submit">
      {{ config.label }}
    </button>
  </div>
  `
})
export class FormButtonComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
  contenedorControl:ContenedorFormControl;

  postCreation(form:FormGroup){
    //console.log(this.config);
  }
}
