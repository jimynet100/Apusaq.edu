import { Component, ViewContainerRef, ViewChild, Input } from '@angular/core';
//models
import { BaseInputComponent } from 'src/app/shared/components/dynamic-form/models/base-input.component';
import { Field } from 'src/app/shared/components/dynamic-form/models/field.interface';
import { FieldConfig,FieldPadre } from 'src/app/shared/components/dynamic-form/models/field-config.interface';
import { SelectComponent, SelectComponentStyleEnum } from '../../components/select/select.component';
import { SearchComponent } from '../search/search.component';


@Component({
  selector: 'form-search',
  template: `
    <ng-container [formGroup]="group">
      <app-search [config]="configInterno" [estiloValidoInvalido]="getEstiloValidoInvalido()"  [formControlName]="config.name"></app-search>
    </ng-container>
  `
})
export class FormSearchComponent extends BaseInputComponent implements Field {
  @ViewChild(SearchComponent ,{static: true}) select: SearchComponent;
  configInterno;

  ngOnInit() {
    let self = this;
    if (this.config.fieldPadre!=null && this.config.fieldPadre.length>0){
      /* Ya existen los control del formulario cuando se asocian los componentes visuales */
      let val = this.group.value
      this.config.fieldPadre.forEach((padre:FieldPadre) => {       
        this.group.get(padre.name).valueChanges.subscribe(value => {
          val[padre.name] = value;//seteamos el valor actual y actualizamos el combo 
          //this.select.actualizarPorPadre(val);
        });  
      });
    }
   }

  getEstiloValidoInvalido():any{
    if (this.config && this.config.field){
      if (this.config.field.valid){
        return SelectComponentStyleEnum.VALIDO;
      }
      else{
        return SelectComponentStyleEnum.INVALIDO;
      }
      //return !this.config.field.valid;
    }
    return SelectComponentStyleEnum.NULO;
  }



}
/*
ngOnInit() {
  let self = this;
  let config = {
    propertyLabel:'cmsOfePadUsuDesc',
    propertyValue:'cmsOfePadId',
    fnSearch:function(filtro:any):Observable<any[]>{
      return self.cmsService.searchTopOfertaPadre(filtro);
    },
    fnFiltroPorTexto:function(term:string){
      let filtro:CmsOfertaPadreFiltro = new CmsOfertaPadreFiltro();
      filtro.maxRow = 10;
      filtro.cmsOfePadDesc = term;
      return filtro;
    },
    fnFiltroValue:function(value){
      let filtro:CmsOfertaPadreFiltro = new CmsOfertaPadreFiltro();
      filtro.maxRow = 1;
      filtro.cmsOfePadId = value;
      return filtro;
    }
  };
  this.configInterno = ObjectUtil.unirObj(config,self.config);
}*/
