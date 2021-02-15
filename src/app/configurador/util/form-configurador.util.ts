import { FormConfig, FieldConfig, FIELD_MASK } from "src/app/shared/components/dynamic-form/models/field-config.interface";
import { FormField, ResultConfig, IContenerPageComponent, FormComp } from '../model/model';
import { TypeFormFieldEnum } from '../constantes/constante';
import { Validators, FormGroup, AbstractControl, ValidatorFn } from '@angular/forms';
import { Condition } from 'src/app/shared/model/model';
import { ConditionUtil } from 'src/app/shared/util/condition.utl';
import { DataTypeEnum } from 'src/app/shared/constantes/constantes';

export class FormConfiguradorUtil {

      static  createFormConfigBase(form: FormComp):FormConfig{
        let arrayFieldConfig: FieldConfig[] = [];
        let formconfig = <FormConfig>{};
        if (form.fields!=null && form.fields.length>0){
          form.fields.forEach(field=>{
            arrayFieldConfig.push(FormConfiguradorUtil.formFieldToFieldConfig(field));
          });
          formconfig.arrayFieldConfig = arrayFieldConfig;
        }
        return formconfig;
      } 
    

      static formFieldToFieldConfig(field: FormField): FieldConfig{

        field.type = field.type || TypeFormFieldEnum.TEXT;
        field.column = field.column || 6;
        let fieldConfig:FieldConfig = {
          type: null,
          name: field.name,
          label: field.label,
          column: field.column,
          value: field.value,
          tooltip: field.tooltip,
          isVisibleCondition: field.isVisibleCondition,
          format: field.format,
          validationCondition: field.validation
        };



        if (field.required===true){
          fieldConfig.validation = [Validators.required];
        }
        if (field.readOnly===true){
          fieldConfig.readOnly = true;
        }

        if (field.tooltipCondition){
          fieldConfig.fnTooltip = function(form:FormGroup){
            return ConditionUtil.evalConditionResult(field.tooltipCondition,form.value); 
          }
        } 
        /*
        if (field.validation) {
          fieldConfig.validation = fieldConfig.validation || [];
          fieldConfig.validation.push(FormConfiguradorUtil.createValidatorFromCondition(field.validation));
        }*/
        
        FormConfiguradorUtil.typeProcess(field,  fieldConfig);
        FormConfiguradorUtil.parentProcess(field,  fieldConfig);
        //console.log(fieldConfig);
        return fieldConfig;
      }
      /*
      static createValidatorFromCondition(condition:Condition){
          return (control: AbstractControl): {[key: string]: any} | null => {
            let value = control.parent.value;
            let result = ConditionUtil.evalConditionResult(condition,control.parent.value)
            return (!result || result!='') ? {'conditionValidator': 'todo mal'} : null;//{'conditionValidator': {value: result}} 
          };
      }*/

      static parentProcess(field: FormField, fieldConfig: FieldConfig){
        if (field.parents!=null){
          fieldConfig.fieldPadre = [];
          field.parents.forEach(x=>{
            fieldConfig.fieldPadre.push({name:x.name, nameFiltro:x.nameFilter, required: x.required});
          });
        }
      }

      static typeProcess(field: FormField, fieldConfig: FieldConfig){
        switch(field.type) { 
          case TypeFormFieldEnum.TEXT: { 
            fieldConfig.type = 'input'; 
            fieldConfig.dataType = DataTypeEnum.STRING;
            break;
          } 
          case TypeFormFieldEnum.NUMBER: { 
            fieldConfig.type = 'input';
            fieldConfig.mask = FIELD_MASK.NUMBER; 
            fieldConfig.dataType = DataTypeEnum.NUMBER;
            break;
          } 
          case TypeFormFieldEnum.DATE: { 
            fieldConfig.type = 'date'; 
            fieldConfig.dataType = DataTypeEnum.DATE;
            break;
          } 
          case TypeFormFieldEnum.LIST: { 
            fieldConfig.type = 'select';
            fieldConfig['useMapValue'] = true;
            fieldConfig.propertyLabel = 'label';
            fieldConfig.propertyValue = 'value';
            fieldConfig.url = 'configurador/GetList'
            fieldConfig['filtroBase'] = {queryId: field.queryId};
            fieldConfig.dataType = DataTypeEnum.STRING;
            if (field.readOnly===true){
              fieldConfig.searchable = false;
              fieldConfig.clearable = false;
            }  
            if (!field.parents || field.parents.length == 0){/* si es un combo dependiente, debe guardarse en cache */
              fieldConfig.cache = true;
            }
            break;
          }
          case TypeFormFieldEnum.TEXTAREA: { 
            fieldConfig.type = 'textarea'; 
            fieldConfig.dataType = DataTypeEnum.STRING;
            break;
          } 
          case TypeFormFieldEnum.SECTION: { 
            fieldConfig.type = 'section'; 
            fieldConfig.column = 12;
            break;
          } //
          case TypeFormFieldEnum.HIDDEN: { 
            fieldConfig.type = 'hidden'; 
            fieldConfig.dataType = DataTypeEnum.STRING;
            break;
          }
          case TypeFormFieldEnum.EMAIL: { 
            fieldConfig.type = 'input'; 
            fieldConfig.mask = FIELD_MASK.EMAIL; 
            fieldConfig.dataType = DataTypeEnum.STRING;
            break;
          }
          case TypeFormFieldEnum.PHONE: { 
            fieldConfig.type = 'input'; 
            fieldConfig.mask = FIELD_MASK.PHONE; 
            fieldConfig.dataType = DataTypeEnum.STRING;
            break;
          }
          case TypeFormFieldEnum.STATIC:{
            fieldConfig.type = 'texto'; 
            fieldConfig.styleClass = field.styleClass;
            fieldConfig.dataType = DataTypeEnum.STRING;
            fieldConfig.fnTexto = function(form:FormGroup){
              return ConditionUtil.evalConditionResult(field.valueCondition,form.value); 
            }
            break;
          }
          case TypeFormFieldEnum.CHECKBOX:{
            fieldConfig.type = 'checkbox'; 
            fieldConfig.dataType = DataTypeEnum.STRING;
            fieldConfig.options = field.options;
            fieldConfig.propertyLabel = 'label';
            fieldConfig.propertyValue = 'value';
          }
          case TypeFormFieldEnum.RADIO:{
            fieldConfig.type = 'radio'; 
            fieldConfig.dataType = DataTypeEnum.STRING;
            fieldConfig.options = field.options;
            fieldConfig.propertyLabel = 'label';
            fieldConfig.propertyValue = 'value';
            fieldConfig.extra = field.extra;
          }
          default: { 
             //statements; 
             break; 
          } 
       } 
      }

}

//url:urlCombo, propertyLabel:'tabGenDesUsuario',propertyValue:'tabGenCodigo'