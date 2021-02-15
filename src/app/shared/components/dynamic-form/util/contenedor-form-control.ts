import { FormGroup, AbstractControl, FormControl, FormBuilder, ValidatorFn } from "@angular/forms";
import { FieldConfig, FormConfig } from "../models/field-config.interface";
import { ConditionUtil } from 'src/app/shared/util/condition.utl';

export class ContenedorFormControl{
    private control:FormControl;
    private valType: {[dataType: string]: number};
    constructor(private fb: FormBuilder, public formGroup:FormGroup,public formConfig:FormConfig, public fieldConfig: FieldConfig) {
        let self = this;
        
        let r = {};
        formConfig.arrayFieldConfig.forEach(field=>{
          r[field.name] = field.type;
        });
        self.valType = r;
        self.control = self.createFormControl(formGroup, fieldConfig);
    }
    
    private createFormControl(formGroup:FormGroup, fieldConfig: FieldConfig):FormControl {
        const self = this;
        const { disabled, value } = fieldConfig;
        let formControl:FormControl;
        formControl = self.fb.control({ disabled, value });
        let validation = fieldConfig.validation || [];
        
        if (fieldConfig.validationCondition){
          validation.push(self.createValidatorFromCondition(fieldConfig));
        }
          
        formControl.setValidators(validation);
        //formControl.setValidators(self.createCustomValidator(fieldConfig));
        if (fieldConfig.fnChange){
          formControl.valueChanges.subscribe(value => {
            fieldConfig.fnChange(formGroup,value);
          });
        }
        
        fieldConfig.field = formControl;
        return fieldConfig.field; 
    }
    
    private createValidatorFromCondition(fieldConfig: FieldConfig){
      const self = this;
      return function(formControl: FormControl){
          let result = ConditionUtil.evalConditionBoolean(self.fieldConfig.validationCondition, self.formGroup.value, self.valType); 
          return result ? null : {
            validateCondition: {
              valid: false
            }
          };

      }
    }
    /*
    function emailConditionallyRequiredValidator(formControl: AbstractControl) {
      if (!formControl.parent) {
        return null;
      }
      
      if (formControl.parent.get('myCheckbox').value) {
        return Validators.required(formControl); 
      }
      return null;
    }*/

    public getFormControl(){
        return this.control;
    }
    public getFieldConfig(){
      return this.fieldConfig;
    }
    public getFormGroup():FormGroup{
      return this.formGroup;
    }
    public getLabel(){
      return this.fieldConfig.fnLabel?this.fieldConfig.fnLabel(this.formGroup):this.fieldConfig.label;
    }
    public isVisible():boolean{
      const self = this;
      let result: boolean = true;
      if (self.formGroup){
        if (self.fieldConfig.fnIsVisible)
          result = self.fieldConfig.fnIsVisible && self.fieldConfig.fnIsVisible(self.formGroup);
        else if (self.fieldConfig.isVisibleCondition){
          result = ConditionUtil.evalConditionBoolean(self.fieldConfig.isVisibleCondition, self.formGroup.value); 
        }
      }
      /*
      if (self.control){
        if (!result && self.control.disable && !self.control.disabled){
          setTimeout(function(){
            self.control.disable({emitEvent: false });
          }, 100);
        }
        else if (result && self.control.enable && !self.control.enabled){
          setTimeout(function(){
            self.control.enable({emitEvent: false }); 
          }, 100);
        }
      }*/
      return result;
    }
    public isHidden():boolean{   
      return this.fieldConfig.type=='hidden';
    }
    public isReadOnly():boolean{
      return this.fieldConfig.readOnly || ( this.fieldConfig.fnIsReadOnly && this.fieldConfig.fnIsReadOnly(this.formGroup));
    }
    public getErrorTooltip():string{
      if (this.formConfig.mostrarErrorTooltip && this.mostrarError()){
        return this.fieldConfig.component.errorMessage;
      }
      return null;
    }

    public mostrarError():boolean{
      return this.control && this.control.invalid && this.control.touched;
    }
    public mostrarErrorLabel():boolean{
      return !this.formConfig.mostrarErrorTooltip && this.mostrarError();
    }
    public showButton():boolean{
      return this.fieldConfig.showButton;
    }
    public getErrorMessage():string{
      return this.fieldConfig.component.errorMessage;
    }
    public existeLabelIzquierda():boolean{
      return !this.formConfig.mostrarTituloColumnaSuperior && (this.fieldConfig.fnLabel!=null || this.fieldConfig.label!=null);
    }
    public getColumnClass():string{
      return "col-md-" + this.fieldConfig.column;
    }
    public getButttonTooltip():string{
      return this.fieldConfig.butttonTooltip;
    }
    public getButttonIconClass():string{
      return this.fieldConfig.butttonIconClass;
    }
    public onClickButton(){
      //fieldConfig.fnOnClickButton(formGroup, fieldConfig);=> arreglar mvargas 
      this.fieldConfig.fnOnClickButton(this.fieldConfig);
    }
}