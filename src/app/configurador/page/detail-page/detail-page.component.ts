import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/security/authentication.service';
import { DynamicFormComponent } from 'src/app/shared/components/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { BarButtonConfig, BarButtonComponent } from 'src/app/shared/components/bar-button/bar-button.component';
import { FormConfig } from 'src/app/shared/components/dynamic-form/models/field-config.interface';
import { ConfigService } from 'src/app/shared/services/configurador/config.service';
import { NotificacionService } from 'src/app/shared/services/util/notificacion.service';
import { BasePageComponent } from '../../model/base-page-component';
import { DetailPage, Process, ResultConfig, Button, FormComp, BasePage, IDetailPageComponent } from '../../model/model';
import { FormConfiguradorUtil } from '../../util/form-configurador.util';
import { ButtonConfiguradorUtil } from '../../util/button-configurador.util';
import { ProcessConfiguradorUtil } from '../../util/process-configurador.util';


@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.sass']
})
export class DetailPageComponent extends BasePageComponent implements OnInit, IDetailPageComponent  {
  @ViewChild(DynamicFormComponent,{static: false}) form: DynamicFormComponent;
  @ViewChild(BarButtonComponent,{static: false}) barButton: BarButtonComponent;

  formConfig: FormConfig;
  barButtonConfig: BarButtonConfig;

  _meta: DetailPage;
  defaultBarButtonConfig: BarButtonConfig;
  defaultFormConfig: FormConfig;
  filtro: any;
  
  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router, 
    private auth: AuthenticationService, 
    private configService: ConfigService, 
    private notificacionService:NotificacionService) {
      super();
      const self = this;

      self.defaultBarButtonConfig = {
        
      };
      self.defaultFormConfig = <FormConfig>{

      };
  }

  ngOnInit() {
    const self = this;
  } 

  get meta() {
    return this._meta;
  }

  set meta(meta: DetailPage){
    const self = this;
    self.formConfig = self.createFormConfig(meta, meta.form);
    self.barButtonConfig = self.createBarButtonConfig(meta.form.buttons);
    this._meta = meta;
  }

  private createFormConfig(meta: BasePage, formComp: FormComp): FormConfig{
     const self = this;
     if (!formComp) return self.defaultFormConfig;
     let formConfig = FormConfiguradorUtil.createFormConfigBase(formComp);
     //asignar data inicial
     formConfig.value = meta.initialValue;
     return Object.assign(self.defaultFormConfig, formConfig);
  }

  private createBarButtonConfig(buttons: Button[]): BarButtonConfig{
    const self = this;
    if (!buttons || buttons.length==0) return self.defaultBarButtonConfig;
    let barButtonConfig = ButtonConfiguradorUtil.createBarButtonConfigBase(buttons);
    barButtonConfig.arrayButtonConfig.forEach((buttonConfig,index)=>{
      buttonConfig.fnClick = self.createFunctionFromProcess(self, buttons[index].process);
    });
    return Object.assign(self.defaultBarButtonConfig, barButtonConfig);
  } 

  private createFunctionFromProcess(component: IDetailPageComponent, process: Process){
    const self = this;
    return ProcessConfiguradorUtil.createFunctionFromProcess(
      component.contenedorPage, 
      process,
        ()=>{
          return component.form.value;
        },
        ()=>{
          if (component.form){
            component.form.validate();
            let r = component.form.valid();
            if (!r){
              self.notificacionService.error("", process.errorValidationMessage  || "Existen campos incompletos o inválidos");
            }
            return r;
          } 
          return true;
        }
      );
  }

  getData(): any{
    const self = this;
    return null;
  }

  
}
