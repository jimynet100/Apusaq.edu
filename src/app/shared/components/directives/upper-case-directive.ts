import { Directive, ElementRef, Renderer, Input, ViewChild, OnInit, HostListener, forwardRef, Renderer2 } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { NG_VALUE_ACCESSOR, DefaultValueAccessor, ControlValueAccessor } from '@angular/forms';

const UPPERCASE_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UpperCaseDirective),
  multi: true
};

@Directive({ 
  selector: '[uppercase]',
  host: {
      "(input)": "onInput($event.target.value)",
      "(blur)": "onBlur()"
  },
  providers: [UPPERCASE_VALUE_ACCESSOR]
})
export class UpperCaseDirective  implements ControlValueAccessor {

    constructor(private renderer: Renderer, private elementRef: ElementRef) {
      elementRef.nativeElement.style.textTransform  = "uppercase";
    }
    
    onChange = (_: any) => {};
    
    onTouched = () => {};
    
    registerOnChange(fn: (value: any) => any): void { 
      this.onChange = fn; 
    }

    registerOnTouched(fn: () => any): void { 
      this.onTouched = fn; 
    }

    onBlur() {
      this.onTouched();
    }
    
    onInput(value : string) {
      const formatted: any = this.formatValue(value);
      
      this.onChange(formatted);
    }
    
    writeValue(value: any): void {
      const formatted: any = this.formatValue(value);
      
      this.renderer.setElementProperty(this.elementRef.nativeElement, 'value', formatted);
    }
    
    private formatValue(value: any): string {
      return value && typeof value == "string" ?
        value.toUpperCase() :
        value;
    }

}
