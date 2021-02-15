import { Component, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
//models
import { BaseInputComponent } from 'src/app/shared/components/dynamic-form/models/base-input.component';
import { Field } from 'src/app/shared/components/dynamic-form/models/field.interface';
import { FieldConfig } from 'src/app/shared/components/dynamic-form/models/field-config.interface';


@Component({
  selector: 'form-seccion', 
  templateUrl: './form-seccion.component.html',
  styleUrls: ['./form-seccion.component.css']
})
export class FormSeccionComponent extends BaseInputComponent implements Field {
  getColor(){
    return this.config && this.config.style ? this.config.style.color : 'black';
  }
  getBackgroundColor(){
    return this.config && this.config.style ? this.config.style.backgroundColor : '#17a2b8';
  }
}
