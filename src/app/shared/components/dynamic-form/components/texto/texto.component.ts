import { Component, OnInit,Input, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-texto',
  template: `
    <span class="form-control" style="background-color: #f9f9f9" >
      {{value}}
    </span>
    `,
    styleUrls: ['./texto.component.css'],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TextoComponent),
        multi: true
      }
    ]
})
export class TextoComponent implements ControlValueAccessor, OnInit {
  propagateChange = (_: any) => {};
  _value;

  constructor(private cd: ChangeDetectorRef)  {
  }

  get value() { 
    return this._value; 
  }

  set value(val) {
    this._value = val;
    this.propagateChange(this.value);
  }

  writeValue(value: string) {
    if (value !== undefined) {
      this._value = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched() {}

  ngOnInit() {
  }


  //necesario para transmitir el estado disabled
  setDisabledState(isDisabled: boolean): void {

  }

}

