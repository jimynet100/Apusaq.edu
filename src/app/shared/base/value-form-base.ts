import { OnInit, ViewChild, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DynamicFormComponent } from '../components/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { FormConfig } from '../components/dynamic-form/models/field-config.interface';


export interface ConfigValueFormBaseComponent{
  tipo?: number;
}
export function copiarTemplateValueFormBaseComponent(selector:string, componentType:any){
  return {
    template: `
    <dynamic-form [config]="formConfig" #form="dynamicForm"></dynamic-form>
    ` ,
    selector: selector,
    //host: {'(blur)': 'onTouched($event)'},
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => componentType),
        multi: true
      }/*,
      {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => componentType),
        multi: true,
      }  */
    ] //    {{form?.value | json}} 
  }
}
export abstract class ValueFormBaseComponent implements OnInit, ControlValueAccessor { //implements IPaginaBaseComponent 
  protected touched:boolean=false;
  protected nombre;
  @Input() protected config:ConfigValueFormBaseComponent;
  protected _value:any;
  protected lastValuePropagate:any;
  @ViewChild('form',{static: true}) form: DynamicFormComponent;
  public formConfig: FormConfig;

  propagateChangeBase = (_: any) => {};
  propagateTouchedBase: any = () => { /*Empty*/ }
  registerOnChange(fn) {this.propagateChangeBase = fn;}
  registerOnTouched(fn: any) {this.propagateTouchedBase = fn;} 
  writeValue(value: any) {
    //console.log('writeValue',value);
    this._value = value;
    this.setValue(value);
  }
  
  ngOnInit() {
    let self = this;
    self.formConfig = self.createFormConfig(self.config);
  }

  protected abstract createFormConfig(config:ConfigValueFormBaseComponent):FormConfig;
  protected abstract getValue():any;
  protected abstract setValue(value):void;
  protected abstract isValid():boolean;

  get value(){
    return this.getValue();
  }

  set value(value){
    this._value = value;
    this.setValue(value);
  }  

  protected propagateChange(){
    let val = this.value;
    if (this.form && this._value!=val){//propagar solo si es diferente
      console.log('propagando:' + this.nombre,val);
      this.propagateChangeBase(val);
      this._value = val;
      this.lastValuePropagate = val;
    }
  }

  protected isReady():boolean{
    return this.form.getForm()!=null;
  }

  public reset(){
    this.form.getForm().reset();
  }
  /*
  public validate(c: FormControl) {

    if (this.isValid()){
      return null;
    }
    return {
      'required':{valid:false}
    };
  }*/

}
