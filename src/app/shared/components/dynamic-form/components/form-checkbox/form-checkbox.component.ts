import { Component } from '@angular/core';
//models
import { BaseInputComponent } from 'src/app/shared/components/dynamic-form/models/base-input.component';
import { Field } from 'src/app/shared/components/dynamic-form/models/field.interface';


@Component({
  selector: 'form-checkbox',
  template: `
    <ng-container [formGroup]="group">
      <app-checkbox-group 
        [formControlName]="config.name" 
        [config]="config"
        [readonly]="contenedorControl?.isReadOnly()"
        tooltip="{{fnTooltip()}}"
        ></app-checkbox-group>
    </ng-container>
  `
})
export class FormCheckboxComponent extends BaseInputComponent implements Field {

}

