import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { NgxUpperCaseDirectiveModule } from 'ngx-upper-case-directive';

import { DynamicFieldDirective } from './components/dynamic-field/dynamic-field.directive';
import { DynamicFormComponent } from './containers/dynamic-form/dynamic-form.component';
import { FormButtonComponent } from 'src/app/shared/components/dynamic-form/components/form-button/form-button.component';
import { FormInputComponent } from 'src/app/shared/components/dynamic-form/components/form-input/form-input.component';
import { FormRadioComponent } from './components/form-radio/form-radio.component';
import { FormCheckboxComponent } from './components/form-checkbox/form-checkbox.component';
import { FormSeccionComponent } from './components/form-seccion/form-seccion.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormGrupoComponent } from './components/form-grupo/form-grupo.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormTextareaComponent } from './components/form-textarea/form-textarea.component';
import { FormHiddenComponent } from './components/form-hidden/form-hidden.component';
import { FormTextoComponent } from './components/form-texto/form-texto.component';
import { TextoComponent } from './components/texto/texto.component';
import { FormDateComponent } from './components/form-date/form-date.component';
import { DateComponent } from './components/date/date.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SearchComponent } from './components/search/search.component';
import { SelectComponent } from './components/select/select.component';
import { UtilSelectDirective } from './directives/util-select-directive';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { FormSelectComponent } from './components/form-select/form-select.component';
import { FormSearchComponent } from './components/form-search/form-search.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxUpperCaseDirectiveModule,
    TextMaskModule,
    ButtonsModule,
    TooltipModule,
    BsDatepickerModule.forRoot()
  ],
  declarations: [
    DynamicFieldDirective,
    DynamicFormComponent,
    FormButtonComponent,
    FormInputComponent,
    FormRadioComponent,
    FormCheckboxComponent,
    FormSeccionComponent,
    FormGrupoComponent,
    FormTextareaComponent,
    FormHiddenComponent,
    FormTextoComponent,
    TextoComponent,
    DateComponent,
    FormDateComponent,
    SearchComponent,
    SelectComponent,
    FormSelectComponent,
    FormSearchComponent,
    UtilSelectDirective,
    CheckboxGroupComponent,
    RadioGroupComponent
  ],
  exports: [
    DynamicFormComponent
  ],
  entryComponents: [
    FormButtonComponent,
    FormInputComponent,
    FormRadioComponent,
    FormCheckboxComponent,
    FormSeccionComponent,
    FormGrupoComponent,
    FormTextareaComponent,
    FormHiddenComponent,
    FormTextoComponent,
    FormDateComponent,
    FormSelectComponent,
    FormSearchComponent,
    CheckboxGroupComponent,
    RadioGroupComponent
  ]
})
export class DynamicFormModule {}
