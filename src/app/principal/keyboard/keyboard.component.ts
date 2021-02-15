import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KeyboardComponent),
      multi: true
    }
  ]
})
export class KeyboardComponent implements ControlValueAccessor, OnInit {
  value:string='';
  private onTouchedCallback: () => void;
  private onChangeCallback: (_: any) => void;

  constructor() { }
 
  ngOnInit() {
  }

  writeValue(value: any) {
    if (value !== undefined) {
        this.value = value;//no se debe activar el propagar cambio debido a que activa el evento change
    }
  }
  
  //Virtual keyboard logic to login
  clickButton(letra){
    let temp = this.value || '';
    
    if(letra==-1){
      if (temp){
        this.value = temp.substring(0,temp.length-1);
        this.onChangeCallback(this.value);
      }
    }else if (temp.length < 8) {
      this.value = temp + '' + letra;
      this.onChangeCallback(this.value);
    }
  }

    //From ControlValueAccessor interface
    registerOnChange(fn) {
      this.onChangeCallback = fn;
    }
    //From ControlValueAccessor interface
    registerOnTouched(fn: any): void{
      this.onTouchedCallback = fn;
    }
  
    //Set touched on blur
    onBlur() {
      this.onTouchedCallback(); 
    }

}
