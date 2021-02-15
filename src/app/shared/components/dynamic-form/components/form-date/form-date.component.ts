import { Component, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
//models
import { BaseInputComponent } from 'src/app/shared/components/dynamic-form/models/base-input.component';
import { Field } from 'src/app/shared/components/dynamic-form/models/field.interface';

@Component({
  selector: 'form-date',
  template: `
    <ng-container [formGroup]="group">
      <app-date 
        [formControlName]="config.name" 
        [config]="config"
        [readonly]="contenedorControl?.isReadOnly()"
        tooltip="{{fnTooltip()}}"
        
        ></app-date>
    </ng-container>
  `,
  styleUrls: ['./form-date.component.css']
})//placeholder="yyyy-mm-dd"  [ngClass]="{'is-invalid': invalid, 'is-valid': valid}"
export class FormDateComponent extends BaseInputComponent implements Field {
  public actualizarPorPadre(group: FormGroup, formValue:any):any{
  };
}
