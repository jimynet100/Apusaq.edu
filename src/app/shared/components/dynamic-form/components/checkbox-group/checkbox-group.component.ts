import { Component, OnInit,Input, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldConfig } from '../../models/field-config.interface';
import { OptionValue } from 'src/app/shared/model/model';


class OptionCheckbox extends OptionValue{
  checked: boolean;
}

@Component({
  selector: 'app-checkbox-group',
  template: ` 
    <ng-container *ngFor="let item of listOption; let i =index;">
      <div class="form-check">
        <input class="form-check-input" (click)="clickOption(item)" [checked]="item.checked" type="checkbox"  >
        <label class="form-check-label">
          {{item.label}}
        </label>
      </div>
    </ng-container>



    <div class="btn-group" role="group">
      <ng-container *ngFor="let item of listOption; let i =index;">
        <button type="button" class="btn btn-outline-dark" [ngClass]="{'active': item.checked}" (click)="clickOption(item)" >{{item.label}}</button>
      </ng-container>
    </div>

    {{ listOption | json  }}
    `,
    styleUrls: ['./checkbox-group.component.css'],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CheckboxGroupComponent),
        multi: true
      }
    ]
})
export class CheckboxGroupComponent implements ControlValueAccessor, OnInit {
  listOption: OptionCheckbox[];
  _config:FieldConfig;

  @Input() 
  set config(value: FieldConfig){
    const self = this;
    if (value)
      self.listOption = value.options.map(opt => <OptionCheckbox>{
        label: opt[value.propertyLabel],
        value: opt[value.propertyValue],
        checked: false
      });
    this._config = value;
    
  }

  get config(): FieldConfig{
    return this._config;
  }

  @Input() readonly:any;
  @Input() ngClass:any;
  _value:any;
  propagateChange = (_: any) => {};

  
  constructor()  {
    
  }



  get value() {
    const self = this;
    return self._value;
  }

  set value(val){
    this._value = val;
  }

  writeValue(value) {
    if (value !== undefined) {
      this.listOption.forEach(opt => {
        if (value.split(",").includes(opt.value))
          opt.checked = true;
      });
    }
  }

  onChange: (_: any) => void = () => {};
  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }
  onTouch: (_: any) => void = () => {};
  registerOnTouched(fn: any) { this.onTouch = fn; }

  ngOnInit() {
    const self = this;  
  }






  clickOption(option: OptionCheckbox){
    const self = this;
    option.checked = !option.checked;
    //self._value =  self.listOption.filter(opt=>opt.checked).map(opt => opt.value);//para array
    let result = self.listOption.filter(opt=>opt.checked).map(opt => opt.value).join(",");
    this._value = result != "" ? result:null;
    self.propagateChange(self.value);
  }

}
