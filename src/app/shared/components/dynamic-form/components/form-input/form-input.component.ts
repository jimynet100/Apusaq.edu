import { Component, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
//models
import { BaseInputComponent } from 'src/app/shared/components/dynamic-form/models/base-input.component';
import { Field } from 'src/app/shared/components/dynamic-form/models/field.interface';
import { FieldConfig } from 'src/app/shared/components/dynamic-form/models/field-config.interface';

@Component({
  selector: 'form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css']
})
export class FormInputComponent extends BaseInputComponent implements Field {
  public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public getTypeTemplate(): number{
    const self = this;
    if (!self.config) return 0;
    else if (self.config.readOnly) return 6;
    else if (self.config.case==1 && !self.config.mask) return 1;
    else if (self.config.case!=1 && !self.config.mask) return 2;
    else if (self.config.case==1 && self.config.mask && !self.config.mask.icon && !self.config.mask.iconText) return 3;
    else if (self.config.mask.icon || self.config.mask.iconText) return 5;
    return 0;
  }
}

