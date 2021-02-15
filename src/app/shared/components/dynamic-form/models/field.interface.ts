import { FormGroup } from '@angular/forms';
import { FieldConfig } from './field-config.interface';
import { ContenedorFormControl } from '../util/contenedor-form-control';

export interface Field {
  config: FieldConfig;
  group: FormGroup;
  contenedorControl:ContenedorFormControl;
  //postCreation(form:FormGroup)
}
