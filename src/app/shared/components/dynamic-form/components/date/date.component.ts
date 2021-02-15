import { Component, OnInit,Input, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BsDatepickerConfig, BsLocaleService, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { DateUtil, DateFormat } from 'src/app/shared/util/dateutil';
import { FIELD_MASK, MaskField } from '../../models/field-config.interface';

export interface Dateconfig{
  format?:string;
  mask?:MaskField;
}  
  
@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateComponent),
      multi: true
    }
  ]
})
export class DateComponent implements ControlValueAccessor, OnInit {
  @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;
  @Input() config:any;
  @Input() readonly:any;
  @Input() ngClass:any;
  valueUser:string;//solo para visualizar
  valueDate:Date;
  bsConfig: Partial<BsDatepickerConfig>;
  propagateChange = (_: any) => {};
  isDisabled:boolean=false;
  
  constructor(private localeService: BsLocaleService)  {

  }

  onClick(){
    this.datepicker.toggle();
  }
  onDatePickerChange(value){
    this.valueDate = value;
    this.valueUser = DateUtil.dateToString(this.valueDate, this.config.format);
    this.propagateChange(this.value);
  }
  onValueUserChange(value){
    let dateTemp = DateUtil.stringToDate(value, this.config.format);
    if (!dateTemp || isNaN(dateTemp.getTime())){
      this.valueDate = null;
      this.datepicker._bsValue = null;
    }
    else{
      this.valueDate = dateTemp;
      this.datepicker._bsValue = this.valueDate;
    }
    this.propagateChange(this.value);
  }
  get value() {
    const self = this;
    if (self.config.format == DateFormat.YYYMMDD || self.config.format == DateFormat.DDMMYYY){
      return DateUtil.dateToString(this.valueDate, DateFormat.YYYMMDD);
    }
    else if (self.config.format == DateFormat.YYYMMDD_HHmm || self.config.format == DateFormat.DDMMYYY_HHmm){
      return DateUtil.dateToString(this.valueDate, DateFormat.YYYMMDD_HHmm);
    }
    return DateUtil.dateToString(this.valueDate, DateFormat.YYYMMDD_HHmm);    
  }

  writeValue(value: string) {/* se espera una fecha en formato iso */
    if (value) {
      if (value.length == 10){
        this.valueDate = DateUtil.stringToDate(value, DateFormat.YYYMMDD);
      }
      else{
        this.valueDate = DateUtil.stringToDate(value, DateFormat.YYYMMDD_HHmm);
      }
      this.valueUser = DateUtil.dateToString(this.valueDate, this.config.format);
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
    if (!self.config) self.config = {};

    self.config['format'] = self.config['format'] || DateFormat.YYYMMDD;

    if (self.config.format == DateFormat.YYYMMDD){
      self.config['mask'] = FIELD_MASK.DATE_YYYYMMDD;
    }
    else if (self.config.format == DateFormat.YYYMMDD_HHmm){
      self.config['mask'] = FIELD_MASK.DATE_YYYYMMDD_HHMM;
    }
    else if (self.config.format == DateFormat.DDMMYYY){
      self.config['mask'] = FIELD_MASK.DATE_DDMMYYYY;
    }
    else if (self.config.format == DateFormat.DDMMYYY_HHmm){
      self.config['mask'] = FIELD_MASK.DATE_DDMMYYYY_HHMM;
    }
    else{
      self.config['mask'] = null;
    }

    self.bsConfig = Object.assign({showWeekNumbers:false, adaptivePosition: true}, { containerClass: 'theme-default' });
    self.localeService.use('es');
    
  }

  //necesario para transmitir el estado disabled
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}

/**
 * 
 * <div class="input-group">
      <input
        class="form-control"
        [ngClass]="{'is-invalid': invalid, 'is-valid': valid}"
        ngbDatepicker #d="ngbDatepicker"
        [placeholder]="config.placeholder"
        [formControlName]="config.name"
      >
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" (click)="d.toggle()" type="button">
          <i class="fa fa-calendar" style="width: 1.2rem; height: 1rem; cursor: pointer;"></i>
        </button>
      </div>
    </div>
 */