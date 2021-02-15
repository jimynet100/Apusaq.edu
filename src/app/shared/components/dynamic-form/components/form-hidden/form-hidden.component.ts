import { Component, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
//models
import { BaseInputComponent } from 'src/app/shared/components/dynamic-form/models/base-input.component';
import { Field } from 'src/app/shared/components/dynamic-form/models/field.interface';
import { FieldConfig } from 'src/app/shared/components/dynamic-form/models/field-config.interface';


@Component({
  selector: 'form-hidden',
  template: `
    <ng-container [formGroup]="group">
      <input type="hidden" [formControlName]="config.name">
    </ng-container>
  `,
  styleUrls: ['./form-hidden.component.css']
})
export class FormHiddenComponent extends BaseInputComponent implements Field {
  constructor() {
    super();
  }

  public actualizarPorPadre(group: FormGroup, formValue:any):any{

  };
}
