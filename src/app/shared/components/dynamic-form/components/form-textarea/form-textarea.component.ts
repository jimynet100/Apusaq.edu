import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { BaseInputComponent } from 'src/app/shared/components/dynamic-form/models/base-input.component';
import { Field } from 'src/app/shared/components/dynamic-form/models/field.interface';

@Component({
  selector: 'form-textarea',
  templateUrl: './form-textarea.component.html',
  styleUrls: ['./form-textarea.component.scss']
})
export class FormTextareaComponent extends BaseInputComponent implements Field {
  
  constructor(public el: ElementRef) {
    super();
    /*
      this.el.nativeElement.onkeypress = (evt) => {
          if (evt.which < 48 || evt.which > 57) {
              evt.preventDefault();
          }
      };*/

  }
  /*
  @HostListener('keyup') onKeyUp() {
    debugger;
    if (this.el.nativeElement.value){
      debugger;
      this.el.nativeElement.value = this.el.nativeElement.value.toUpperCase();
    }
    
  }*/
  public getTypeTemplate(): number{
    const self = this;
    if (!self.config) return 0;
    else if (self.config.readOnly) return 3;
    else if (self.config.case==1) return 1;
    else return 2;
    return 0;
  }
  
}