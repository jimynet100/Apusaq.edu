import { Component, OnInit, ViewChild } from '@angular/core';
import { BarButtonConfig } from 'src/app/shared/components/bar-button/bar-button.component';
import { FormConfig, FIELD_MASK } from 'src/app/shared/components/dynamic-form/models/field-config.interface';
import { DynamicFormComponent } from 'src/app/shared/components/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { GridPaginadoComponent } from 'src/app/shared/components/grid/grid-paginado/grid-paginado.component';
import { UrlUtil } from 'src/app/shared/util/urlutil';
import { HttpUtil } from 'src/app/shared/util/httputil';
import { GridSimpleComponent } from 'src/app/shared/components/grid/grid-simple/grid-simple.component';
import { GridConfig } from 'src/app/shared/components/grid/model/model.grid';
import { TableConfig } from 'src/app/shared/components/table/table.component';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-requerimiento',
  templateUrl: './admin-requerimiento.component.html',
  styleUrls: ['./admin-requerimiento.component.sass']
})
//@Component(copiarTemplatePaginaBaseBusquedaComponent('app-admin-ficha'))   
export class AdminRequerimientoComponent implements OnInit {

  @ViewChild(DynamicFormComponent,{static: true}) form: DynamicFormComponent;
  @ViewChild(GridSimpleComponent,{static: true}) grid: GridSimpleComponent;
  buttonConfig: BarButtonConfig;
  gridConfig: GridConfig;
  filtro;

  gridConfig2: GridConfig;
  filtro2;

  filtro3;

  tableConfig: TableConfig;

  formConfig: FormConfig = { 
    arrayFieldConfig : [
      { type: 'input', readOnly:true,                 label: 'ID Cartilla',   name: 'cartillaId',       column:6, placeholder: 'Ingrese valor', mask:FIELD_MASK.NUMBER },
      //{ type: FormUtilSelectComponent, label: 'Tipo Cartilla', name: 'cartillaTipo',     column:6, placeholder: 'Ingrese valor', tipoCombo:TipoComboEnum.TIPO_CARTILLA },
      //{ type: FormUtilSelectComponent, label: 'Estado',        name: 'cartillaEstado',   column:6, placeholder: 'Ingrese valor', tipoCombo:TipoComboEnum.ESTADO_CARTILLA },
      { type: 'input',                 label: 'Descripción',   name: 'cartillaNombre',   column:6, placeholder: 'Ingrese valor' },
      { 
        type: 'input',                 
        label: 'ID Fichas',     
        name: 'cartillaFichasId', 
        column:6, 
        placeholder: 'Ingrese ID de fichas separados por coma "," - Ejemplo: 1,2',
        isVisibleCondition: { expression:"@cartillaNombre=='JAJAJA'"}
        //fnIsVisible:(form:FormGroup)=>{ return form.value['cartillaNombre']=='JAJAJA';
        //} 
      },
      { type: 'radio',label: 'Mostrar vista preliminar?',column:6,name: 'preliminar',
          propertyLabel:'nombre',
          propertyValue:'valor',
          value:'2',
          options:[{label:'Si',value:'1'},{label:'No',value:'2'}]
      }  ,
      { type: 'checkbox',label: 'Mostrar vista preliminar?',column:6,name: 'opciones',
          propertyLabel:'nombre',
          propertyValue:'valor',
          value:'2',
          options:[{label:'Si',value:'1'},{label:'No',value:'2'}]
      } 
    ]
  };
  constructor() { 
    this.filtro = {queryId: 39};
    this.gridConfig = <GridConfig>{
      titulo:'Historial de documentos',
      mostrarEliminar:true,
      mostrarConsultar:true,
      mostrarAccionesPrimero:true,
      columns: [
        {headerName:'Nombre', field:'name'},
        {headerName:'Fecha de Carga', field:'fecha',width:150}
      ],
      autoLoad:true,
      mostrarOrden:true,
      url: 'configurador/GetList' 
    };

    this.filtro2 = {queryId: 42};
    this.gridConfig2 = <GridConfig>{
      titulo:'Historial de cambios',
      columns: [
        {headerName:'Estado', field:'estado',width:150},
        {headerName:'Motivo', field:'motivo',width:150},
        {headerName:'Fecha y Hora de Cambio', field:'fecha',width:150}
      ],
      autoLoad:true,
      mostrarOrden:true,
      url: 'configurador/GetList' 
    };


    this.buttonConfig = {
      mostrarBuscar:true,
      mostrarCargarServidor: true,

      fnUrlCargarServidor:function(){
        let url:string = environment.uploadServer + "/migracion/upload";
        return url;
      },

      fnCargarServidor:function(r){
        //self.term.write(`Se cargo el archivo: ${ r['rutaNombreTemporal'] }`);

      },
      fnBuscar:() => { 

        //console.log(UrlUtil.getQueryParams());

      },
      arrayButtonConfig:[
        { 
          name:'nuevo2',
          fnClick:() => {

          },
          mostrar:true,
          titulo:'Cartilla Producto +'
        }
      ]
    };

    this.filtro3 = {queryId: 43};
    this.tableConfig = <TableConfig>{
        title : 'Listado',
        url: 'configurador/GetList' ,
        columns:[
          {
              "label": "INFORMACION GENERAL",
              "columns":[
                  {"label": "Código QA", "name": "codigoQa", "width": 120},
                  {"label": "Sistema", "name": "sistema", "width": 120},
                  {"label": "Solicitante", "name": "solicitante", "width": 120}
              ]
          },
          {
              "label": "FECHAS",
              "columns":[
                  {"label": "Inicio Pruebas", "name": "inicioPrueba", "width": 120},
                  {"label": "Fin de Pruebas", "name": "finPrueba", "width": 120},
                  {"label": "Lanzamiento", "name": "lanzamiento", "width": 120}
              ]
          },
          {
              "label": "ESTADO",
              "columns":[
                  {"name": "estado", "width": 120}
              ]
          }
      ] 
    };

  }

  ngOnInit() {
  }

}
