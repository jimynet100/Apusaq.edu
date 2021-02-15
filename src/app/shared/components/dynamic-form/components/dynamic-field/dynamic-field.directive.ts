import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnInit, Type, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
//componentes
import { FormButtonComponent } from 'src/app/shared/components/dynamic-form/components/form-button/form-button.component';
import { FormInputComponent } from 'src/app/shared/components/dynamic-form/components/form-input/form-input.component';
import { FormRadioComponent } from 'src/app/shared/components/dynamic-form/components/form-radio/form-radio.component';
import { FormCheckboxComponent } from 'src/app/shared/components/dynamic-form/components/form-checkbox/form-checkbox.component';


import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { FormGrupoComponent } from '../form-grupo/form-grupo.component';
import { FormTextareaComponent } from '../form-textarea/form-textarea.component';
import { FormHiddenComponent } from '../form-hidden/form-hidden.component';
import { FormTextoComponent } from '../form-texto/form-texto.component';
import { BaseInputComponent } from '../../models/base-input.component';
import { ContenedorFormControl } from '../../util/contenedor-form-control';
import { FormSeccionComponent } from '../form-seccion/form-seccion.component';
import { FormDateComponent } from '../form-date/form-date.component';
import { FormSelectComponent } from '../form-select/form-select.component';

const components: {[type: string]: Type<Field>} = {
  button: FormButtonComponent,
  input: FormInputComponent,
  textarea : FormTextareaComponent,
  select: FormSelectComponent,
  radio: FormRadioComponent,
  checkbox:  FormCheckboxComponent,
  grupo: FormGrupoComponent,
  texto: FormTextoComponent,
  hidden: FormHiddenComponent,
  section: FormSeccionComponent,
  date: FormDateComponent
};

@Directive({
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements Field, OnChanges, OnInit {

  @Input() padre: any;
  @Input() contenedorControl: ContenedorFormControl; 
  config: FieldConfig;
  group: FormGroup;
  component: ComponentRef<Field>;

  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {}

  ngOnChanges() {
    let self = this;
    if (self.component) {
      self.component.instance.contenedorControl = self.contenedorControl;
      self.component.instance.config = self.contenedorControl.getFieldConfig();
      self.component.instance.group = self.contenedorControl.getFormGroup();
    }
  }

  ngOnInit() {
    /*
    if (!components[this.config.type]) {
      const supportedTypes = Object.keys(components).join(', ');
      throw new Error(
        `Trying to use an unsupported type (${this.config.type}).
        Supported types: ${supportedTypes}`
      );
    }*/
    let self = this;
    self.config = self.contenedorControl?self.contenedorControl.getFieldConfig():null;
    self.group = self.contenedorControl?self.contenedorControl.getFormGroup():null;

    let type:any = components[self.config.type]?components[self.config.type]:self.config.type;
    const component = self.resolver.resolveComponentFactory<Field>(type);

    self.component = self.container.createComponent(component);
    self.component.instance.contenedorControl = self.contenedorControl;
    self.component.instance.config = self.config;
    self.component.instance.group = self.group;

    self.config.component = <BaseInputComponent>self.component.instance;
    if (self.config['fnPostCreationComponentUi']){
      //console.log('DynamicFieldDirective.fnPostCreationComponentUi');
      self.config['fnPostCreationComponentUi']();//ejecutando post creation
    }
    
    //this.padre.addComponent(this.component.instance,this.index);
  }

  postCreation(form:FormGroup){
    //this.component.instance.postCreation(this.group);
  }
}
