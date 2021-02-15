import { Component, ChangeDetectorRef } from '@angular/core';
//models
import { BaseInputComponent } from 'src/app/shared/components/dynamic-form/models/base-input.component';
import { Field } from 'src/app/shared/components/dynamic-form/models/field.interface';


@Component({
  selector: 'form-radio',
  template: `
    <ng-container [formGroup]="group">
      <app-radio-group 
        [formControlName]="config.name" 
        [config]="config"
        [readonly]="contenedorControl?.isReadOnly()"
        tooltip="{{fnTooltip()}}"
        ></app-radio-group>
    </ng-container>
  `,
  styleUrls: ['./form-radio.component.css']
})
export class FormRadioComponent extends BaseInputComponent implements Field {
  constructor( private cdref: ChangeDetectorRef ) {
    super();
  }


  /*
  <ng-container [formGroup]="group" class="form-inline">
        <div class="form-group">
          <div class="btn-group" btnRadioGroup [formControlName]="config.name">
            <ng-container *ngFor="let item of config.options; let i =index;">
              <label btnRadio="{{getValue(i)}}" class="btn btn-outline-primary" tabindex="0" role="button">
                {{getLabel(i)}}
              </label>
            </ng-container>
          </div>
        </div>
    </ng-container>
  getValue(index){
    return this.config.options[index][this.config.propertyValue];
  }
  getLabel(index){
    return this.config.options[index][this.config.propertyLabel];
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  */
}

