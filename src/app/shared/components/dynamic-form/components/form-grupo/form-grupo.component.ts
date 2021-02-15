import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseInputComponent } from '../../models/base-input.component';
import { Field } from '../../models/field.interface';
import { DynamicFormComponent } from '../../containers/dynamic-form/dynamic-form.component';
import { FieldConfig } from '../../models/field-config.interface';
import { DynamicContainerComponent, ConfigDynamicContainer } from '../../../dynamic-container/dynamic-container.component';

@Component({
  selector: 'form-grupo',
  template: `
  <ng-container [formGroup]="group">
    
  <table class="table table-sm">
    <thead>
      <tr>
        <th scope="col">Grupo</th>
        <th scope="col" style='width:40px'>
          <button (click)="agregar()" type="button" class="btn btn-outline-primary btn-sm">
              <i title="Agregar" class="fa fa-plus" ></i> 
            </button>
        </th>
      </tr>
    </thead>
  </table>


  <table class="table table-sm table-borderless">
  <thead>
    <tr>
      <th *ngFor="let item of tituloArray; let i =index;" scope="col">
        {{item}}
      </th>
    </tr>
  </thead>
  </table>


    <table style="width:100%; border-collapse: collapse; border-spacing: 0px; border: none; padding: 0;">
      <tbody>
        <tr style="padding: 0;">
          <td style=" padding: 0;">
          </td>
          <td>
            <dynamic-form [config]="formConfig" #form="dynamicForm"></dynamic-form>
                  
          </td>
        </tr>
      </tbody>
    </table>
  </ng-container>
  `,
  styleUrls: ['./form-grupo.component.scss']
})
//<app-dynamic-container #contenedor [config]="configConceptoSinCaracteristica"  [metadata]="metadataConceptoSinCaracteristica" [value]="valueConceptoSinCaracteristica" (metadataExisteChange)="metadataChangeConceptoSinCaracteristica($event)" ></app-dynamic-container>
export class FormGrupoComponent  extends BaseInputComponent implements Field {
  /*
  contenedor: DynamicContainerComponent;
   configContenedor:ConfigDynamicContainer = {
    clase: DynamicFormComponent,
    fnGenerateIdComponentFromMetaData:function(metaDataItem: any) {
      return metaDataItem.atiCarValId + '_' + metaDataItem.atiConId;
    },
    fnGenerateIdComponentFromValue:function(value: any){
      return value.atiCarValId + '_' + value.atiConId;
    }
  };*/

  @ViewChild('form',{static: true}) form: DynamicFormComponent;
  formConfig: FieldConfig[]=[];
  maxId:number=1;
  tituloArray:string[];
  ngOnInit() {
    
  }

  agregar(){
    let self = this;
    if (self.config && self.config.formConfig && self.config.formConfig.length>0){
      self.config.formConfig.forEach((item:FieldConfig)=>{
        self.iniciarTitulo();
        item.name = item.name + '_' + self.maxId;
        item.label = '';
        //self.form.addControl(item);
        //console.log(item);
      });
      self.maxId = self.maxId + 1;
    } 
  }

  iniciarTitulo(){
    let self = this;
    if (!self.tituloArray){
      self.tituloArray = [];
      self.config.formConfig.forEach((item:FieldConfig)=>{
        self.tituloArray.push(item.label);
      });
    }
  }

}


/*

<th scope="col">#</th>
<input
            type="text"
            class="form-control"
            [ngClass]="{'is-invalid': invalid, 'is-valid': valid}"
            [placeholder]="config.placeholder"
            [formControlName]="config.name"
            upperCase
            >

*/