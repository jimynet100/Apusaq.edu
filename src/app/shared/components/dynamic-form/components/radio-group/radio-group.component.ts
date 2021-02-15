import { Component, OnInit,Input, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldConfig } from '../../models/field-config.interface';
import { OptionValue } from 'src/app/shared/model/model';

const COL_STYLE = {
  "c1" : "col-md-12", 
  "c2" : "col-md-6",
  "c3" : "col-md-4",
  "c4" : "col-md-3"   
}

interface OptionRadioConfig{
  styleType: number;
  optionPerRow: number;
}  

class OptionRadio extends OptionValue{
  checked: boolean;
}
 
@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true
    }
  ]
})
export class RadioGroupComponent implements ControlValueAccessor, OnInit {
  listOption: OptionRadio[];
  _config:FieldConfig;
  extra: OptionRadioConfig;
  @Input() 
  set config(value: FieldConfig){
    const self = this;
    if (value)
      self.listOption = value.options.map(opt => <OptionRadio>{
        label: opt[value.propertyLabel],
        value: opt[value.propertyValue],
        checked: false
      });
    this.extra  = <OptionRadioConfig>value.extra;  
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
        opt.checked = (opt.value == value);
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


  clickOption(option: OptionRadio){
    const self = this;
    option.checked = !option.checked;
    this.listOption.forEach(opt => {
      opt.checked = (opt.value == option.value);
    });
    this._value = option.value;
    self.propagateChange(self.value);
  }

  getColumnStyle(): string{
    let col = this.extra && this.extra.optionPerRow ? this.extra.optionPerRow : 1;
    return COL_STYLE["c" + col];
  }

  getStyleType():number{
    return this.extra && this.extra.styleType ? this.extra.styleType : 1;
  }

  getBackgroundColorCheked(option: OptionRadio){
    return option.checked ? '#212529' : '#fff';
  }

}