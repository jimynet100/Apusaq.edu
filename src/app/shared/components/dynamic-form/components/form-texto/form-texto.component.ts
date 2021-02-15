import { Component, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
//models
import { BaseInputComponent } from 'src/app/shared/components/dynamic-form/models/base-input.component';
import { Field } from 'src/app/shared/components/dynamic-form/models/field.interface';


@Component({
  selector: 'form-texto',
  template: `
    <div [ngClass]="config.styleClass" style="font-size:small;">
      {{ getTexto() }}
    </div>
  `,
  styleUrls: ['./form-texto.component.css']
})
export class FormTextoComponent extends BaseInputComponent implements Field {
  constructor( ) {
    super();
  }

  getTexto():string{
    const self = this;
    return self.config.fnTexto ? self.config.fnTexto(self.group) : self.config.value 
  }

}
//styleClass //class="form-control align-middle border-0"