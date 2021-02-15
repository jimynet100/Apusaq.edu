import { FormGroup,ValidatorFn } from '@angular/forms';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import emailMask from 'text-mask-addons/dist/emailMask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';
import { DynamicFormComponent } from '../containers/dynamic-form/dynamic-form.component';
import { BaseInputComponent } from './base-input.component';
import { Condition, Field, OptionValue, Style } from 'src/app/shared/model/model';




export enum CaseFieldEnum {
  None=1,
  UpperCase=2,
  LowerCase=3
}

export interface FieldConfig {
  label?: string,
  name: string,
  type: any,
  dataType?: number;

  disabled?: boolean,
  readOnly?: boolean,
  fnLabel?:(form: FormGroup) => string;
  options?: OptionValue[],
  placeholder?: string,
  validation?: ValidatorFn[],
  value?: any,
  column?:number,
  propertyLabel?:string,
  propertyValue?:string,
  tipoCombo?:number,
  fieldPadre?:FieldPadre[],
  field?:any,
  component?:BaseInputComponent,
  propagarObjeto?:boolean,//se utiliza para exponer todo el objeto que brinda el componente
  propagarPropiedad?:string,//se utilizan para exponer una propiedad especifica del componente
  fnChange?:(form: FormGroup,value:any) => void;
  fnChangeComponent?:(form: FormGroup,component:any,value:any) => void;/* se activa cuando cambia el componente directamente */
  fnIsVisible?:(form: FormGroup) => boolean;
  
  fnIsReadOnly?:(form: FormGroup) => boolean;
  fnFiltro?:(form: FormGroup) => any;//se utiliza para crear filtro de forma dinamica
  filtro?:any;
  //PARA SELECT
  fnTemplate?:(value: any, component: any) => string;
  selectMultiple?:boolean;
  showButton?:boolean;
  butttonIconClass?:string;
  butttonTooltip?:string;
  fnOnClickButton?:(component:any) => any//(form: FormGroup, component:any) => any; =>arreglar mvargas 
  fnOnAdd?:(component:any) => any;

  seleccionarSiSoloUno?:boolean;
  clearable?:boolean;
  searchable?:boolean;
  mask?:MaskField;
  formConfig?:FieldConfig[];
  case?:CaseFieldEnum;
  maxlength?:number;
  addTag?:boolean;
  isOpen?:boolean;
  closeOnSelect?:boolean;
  hideSelected?:boolean;
  searchOnLine?:boolean;
  url?:string;
  tooltip?:string;
  fnTooltip?:(form: FormGroup) => string;

  fnTexto?:(form: FormGroup) => string;
  styleClass?:string; 
  format?:string;

  isVisibleCondition?: Condition;
  validationCondition?: Condition;
  style?:Style;

  extra?: any;
  cache?:boolean;
}


export interface FormConfig{
  getDynamicFormComponent?: () => DynamicFormComponent;
  getForm?: () => FormGroup;

  urlData?: string;
  fnFiltroData?:(form: FormGroup) => any;
  fnChange?:(form: FormGroup,change) => void;
  fnChangeStatus?:(form: FormGroup,status:string) => void;
  fnChangeStatusValid?:(form: FormGroup) => void;
  fnFormCreateComplete?:(form: FormGroup, componente: DynamicFormComponent) => void;

  arrayFieldConfig:FieldConfig[];
  isArray?:boolean;
  mostrarArrayNoTabla?:boolean;/*los elementos del array se mostraran de forma consecutiva*/
  filas?:number;
  titulo?:string;
  mostrarAgregar?:boolean;
  mostrarEliminar?:boolean;
  mostrarTituloColumnaSuperior?:boolean;/* muestra los titulos en la columna superior  y no a la izquierda de cada field*/
  mostrarErrorTooltip?:boolean;
  fnIsVisible?:(dynamicForm: DynamicFormComponent) => boolean;

  value?:any;/* default value */
}

export interface FieldPadre {
  name: string;//nombre del campo padre, puede ser cualquier campo
  nameFiltro?:string;//nombre con el que el valor del padre se enviará
  required:boolean; //indica que el campo debe estar lleno para que el combo se filtre 
}

export interface MaskField {
    mask:Array<string | RegExp>,
    guide: boolean,
    icon?:string,
    iconText?:string
}

export const FIELD_MASK = {
  PHONE:{mask:[ /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],guide:true,icon:'fas fa-phone'},
  //PHONE:{mask:['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],guide:true},
  NUMBER:{mask:createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: false,
    thousandsSeparatorSymbol:false,
    allowDecimal:false,
    decimalLimit :0,
    integerLimit :null,
    requireDecimal:false,
    allowNegative:false,
    allowLeadingZeroes:false
  }),guide:true,
    icon:'fa fa-hashtag'
  },
  AMOUNT:{mask:createNumberMask({ 
    prefix : '',
    suffix : '',
    includeThousandsSeparator : false,
    thousandsSeparatorSymbol : false,
    allowDecimal: true,
    decimalLimit : 2,
    integerLimit : 4,
    requireDecimal : false,
    allowNegative : false,
    allowLeadingZeroes : false
  }),guide:true,iconText:'S/'},//,icon:'fa fa-dollar'
  DATE_DDMMYYYY:{mask:[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],guide:true/*,pipe:createAutoCorrectedDatePipe('dd/mm/yyyy')*/},
  DATE_DDMMYYYY_HHMM:{mask:[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/,':', /\d/, /\d/],guide:true/*,pipe:createAutoCorrectedDatePipe('dd/mm/yyyy')*/},
  DATE_YYYYMMDD:{mask:[/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/],guide:true},//,pipe:createAutoCorrectedDatePipe('yyyy/mm/dd')
  DATE_YYYYMMDD_HHMM:{mask:[/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, ' ', /\d/, /\d/,':', /\d/, /\d/],guide:true},
  //DATE_DDMMYYYY:{mask:createAutoCorrectedDatePipe('dd/mm/yyyy'),guide:true},//mm/dd/yyyy HH:MM
  EMAIL:{mask:emailMask,guide:true,icon:'fa fa-at'}
}

   