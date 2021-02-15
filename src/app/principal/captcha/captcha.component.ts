import { Component, OnInit, ChangeDetectorRef, forwardRef } from '@angular/core';
import { AuthenticationService } from '../../shared/services/security/authentication.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CaptchaComponent),
      multi: true
    }
  ]
})
export class CaptchaComponent implements ControlValueAccessor, OnInit {
  _value:string;
  private onTouchedCallback: () => void;
  private onChangeCallback: (_: any) => void;

  public imageContent: string;
  constructor(private cdRef: ChangeDetectorRef, private authenticationService:AuthenticationService) { }

  writeValue(value: any) {
    if (value !== undefined) {
        this._value = value;//no se debe activar el propagar cambio debido a que activa el evento change
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

  get value(){
    return this._value;
  }

  set value(val){
    this._value=val;
    if (this.onChangeCallback){
      this.onChangeCallback(this._value);
    }
  }

  ngOnInit() {
    this.refresh();
  }

  refresh(){
    let self = this;
    this.authenticationService.getCaptcha().subscribe((r) =>{
      self.imageContent = r.imagen64;
      //self.cdRef.detectChanges();
      self.authenticationService.setCaptchaEncryptString(r.encryptString);
      self.value = null;
    });
  }

}
