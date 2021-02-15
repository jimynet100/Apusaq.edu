import { Component, OnInit, Input } from '@angular/core';
import { ObjectUtil } from '../../util/objectutil';
import { UploadService } from '../../services/util/upload.service';
import { NotificacionService } from 'src/app/shared/services/util/notificacion.service';
import { HttpEventType } from '@angular/common/http';
import { ButtonConfig, ButtonDefault, ButtonType } from '../../model/model';




const ARRAY_PROP_BUTTON_CONFIG_BASE:string[]=["mostrar","fnIsDisabled","fnIsVisible","fn"];

const ARRAY_BUTTON_CONFIG_BASE:{[key: string]: ButtonConfig;} ={
  "buscar":{name:ButtonDefault.buscar, titulo:"Buscar", iconClass:"fa fa-search", orden:1, type:ButtonType.Standard},
  "nuevo":{name:ButtonDefault.nuevo, titulo:"Nuevo", iconClass:"fa fa-file", tooltip:"Nuevo", orden:2, type:ButtonType.Standard},
  "crear":{name:ButtonDefault.crear, titulo:"Guardar", iconClass:"fa fa-save", tooltip:"Guardar", orden:3, type:ButtonType.Standard},
  "modificar":{name:ButtonDefault.modificar, titulo:"Guardar", iconClass:"fa fa-save", tooltip:"Guardar", orden:4, type:ButtonType.Standard},
  "agregar":{name:ButtonDefault.agregar, titulo:"Agregar", iconClass:"fa fa-plus", tooltip:"Agregar", orden:5, type:ButtonType.Standard},
  "vigente":{name:ButtonDefault.vigente, titulo:"Vigente", iconClass:"fa fa-thumbs-up", tooltip:"Vigente", orden:6, type:ButtonType.Standard},
  "exportarExcel":{name:ButtonDefault.exportarExcel, titulo:"Xlsx", iconClass:"far fa-file-excel", tooltip:"Exportar", orden:7, type:ButtonType.Standard},
  "exportarPdf":{name:ButtonDefault.exportarPdf, titulo:"PDF", iconClass:"fa fa-file", tooltip:"Exportar", orden:8, type:ButtonType.Standard},
  "cargarCliente":{name:ButtonDefault.cargarCliente, titulo:"Cargar", iconClass:"fa fa-upload", tooltip:"Cargar", orden:9, type:ButtonType.UploadCliente},
  "caida":{name:ButtonDefault.caida, titulo:"Caida", iconClass:"fa fa-save", tooltip:"Caida", orden:10, type:ButtonType.Standard},
  "cargarServidor":{name:ButtonDefault.cargarServidor, titulo:"Upload", iconClass:"fa fa-upload", tooltip:"Cargar", orden:9, type:ButtonType.UploadServidor},
  "limpiar":{name:ButtonDefault.buscar, titulo:"Limpiar", iconClass:"fas fa-eraser", tooltip:"Limpiar", orden:998, type:ButtonType.Standard},
  "cancelar":{name:ButtonDefault.buscar, titulo:"Cancelar", iconClass:"fas fa-ban", tooltip:"Cancelar", orden:999, type:ButtonType.Standard},
  "regresar":{name:ButtonDefault.regresar, titulo:"Regresar", iconClass:"fa fa-caret-left", tooltip:"Regresar", orden:1000, type:ButtonType.Standard}
};

export interface BarButtonConfig {
  arrayButtonConfig?:ButtonConfig[];

  mostrarCrear?:boolean;
  mostrarModificar?:boolean;
  mostrarCancelar?:boolean;
  mostrarLimpiar?:boolean;
  mostrarBuscar?:boolean;
  mostrarRegresar?:boolean;
  mostrarNuevo?:boolean;
  mostrarAgregar?:boolean;
  mostrarVigente?:boolean;
  mostrarExportarExcel?:boolean;
  mostrarExportarPdf?:boolean;
  mostrarCargarCliente?:boolean;
  mostrarCaida?:boolean;
  mostrarCargarServidor?:boolean;

  fnIsVisibleCrear?:() =>boolean;
  fnIsVisibleModificar?:() =>boolean;
  fnIsVisibleCancelar?:() =>boolean;
  fnIsVisibleLimpiar?:() =>boolean;
  fnIsVisibleBuscar?:() =>boolean;
  fnIsVisibleRegresar?:() =>boolean;
  fnIsVisibleNuevo?:() =>boolean;
  fnIsVisibleAgregar?:() =>boolean;
  fnIsVisibleVigente?:() =>boolean;
  fnIsVisibleExportarExcel?:() =>boolean;
  fnIsVisibleExportarPdf?:() =>boolean;
  fnIsVisibleCargarCliente?:() =>boolean;
  fnIsVisibleCaida?:() =>boolean;
  fnIsVisibleCargarServidor?:() =>boolean;

  fnCrear?:() => any;
  fnModificar?:() => any;
  fnCancelar?:() => any;
  fnLimpiar?:() => any;
  fnBuscar?:() => any;
  fnRegresar?:() => any;
  fnNuevo?:() => any;
  fnAgregar?:() => any;
  fnVigente?:() => any;
  fnExportarExcel?:() => any;
  fnExportarPdf?:() => any;
  fnCargarCliente?:(txt) => any;
  fnCaida?:() => any;

  fnCargarServidor?:(txt) => any;
  //fnUploadClienteCargarLocal?:(txt) => any;

  
  fnIsDisabledCrear?:() => boolean;
  fnIsDisabledModificar?:() => boolean;
  fnIsDisabledCancelar?:() => any;
  fnIsDisabledLimpiar?:() => any;
  fnIsDisabledBuscar?:() => boolean;
  fnIsDisabledRegresar?:() => boolean;
  fnIsDisabledNuevo?:() => boolean;
  fnIsDisabledAgregar?:() => boolean;
  fnIsDisabledVigente?:() => boolean;
  fnIsDisabledExportarExcel?:() => boolean;
  fnIsDisabledExportarPdf?:() => boolean;
  fnIsDisabledCargarCliente?:() => boolean;
  fnIsDisabledCaida?:() => boolean;
  fnIsDisabledCargarServidor?:() => boolean;

  fnUrlCargarServidor?:() => string;
}

@Component({
  selector: 'app-bar-button',
  templateUrl: './bar-button.component.html',
  styleUrls: ['./bar-button.component.css']
})
export class BarButtonComponent implements OnInit {
  //mapButtonConfig = new Map<string,ButtonConfig>();
  _config:BarButtonConfig;
  arrayButtonConfig:ButtonConfig[];
  constructor(private uploadService:UploadService,
    private notificacionService:NotificacionService) { }

  ngOnInit() {
  }

  get config(){
    return this._config;
  }

  private createBaseButtonConfig(name: string, barButtonConfigarConfig:BarButtonConfig): ButtonConfig{
    const self = this;
    if (ARRAY_BUTTON_CONFIG_BASE[name]){
      let nameFirstUpperCase = name.charAt(0).toUpperCase() + name.substr(1);
      let config:ButtonConfig = ObjectUtil.copiarObjPrimerNivel(ARRAY_BUTTON_CONFIG_BASE[name]);
      config.fnClick = barButtonConfigarConfig["fn" + nameFirstUpperCase];
      config.fnIsDisabled = barButtonConfigarConfig["fnIsDisabled" + nameFirstUpperCase];
      config.fnIsVisible = function(){
        let fn = barButtonConfigarConfig["fnIsVisible" + nameFirstUpperCase];
        return fn?fn():barButtonConfigarConfig["mostrar" + nameFirstUpperCase];//para que funcione dinamicamente con instrucciones como : buttonConfig.mostrarModificar = true
      };   
      return config;
    }
    return null;
  }

  @Input() set config(barButtonConfigarConfig:BarButtonConfig){

    let self = this;
    if (barButtonConfigarConfig){
      let arrayButtonConfig=[];
      let mapButtonConfig = new Map<string,ButtonConfig>();
      Object.keys(ARRAY_BUTTON_CONFIG_BASE).forEach(name => {
        if (self.hasBaseButton(name, barButtonConfigarConfig)){
          mapButtonConfig.set(name, self.createBaseButtonConfig(name,barButtonConfigarConfig));
        }
      });

      if (barButtonConfigarConfig.arrayButtonConfig && barButtonConfigarConfig.arrayButtonConfig.length>0){
        for (var i = 0; i < barButtonConfigarConfig.arrayButtonConfig.length; i++) {
          let button = barButtonConfigarConfig.arrayButtonConfig[i];
          if (mapButtonConfig.has(button.name)){
            button = Object.assign(mapButtonConfig.get(button.name),button);
            mapButtonConfig.delete(button.name);
          }
          button.type =  button.type || ButtonType.Standard;
          button.orden = 100 + i;
          /*
          if (button.type == ButtonType.Donwload){
            button.fnClick 
          }*/
          arrayButtonConfig.push(button);
        }
      }
      arrayButtonConfig.push(...mapButtonConfig.values());
      if (arrayButtonConfig.length>0){
        arrayButtonConfig.sort((a: ButtonConfig, b: ButtonConfig) => {
          if (a.orden && b.orden)
            return a.orden - b.orden;
          else{
            return -1;
          }
        });
        self.arrayButtonConfig = arrayButtonConfig;
      }
    }
    this._config = barButtonConfigarConfig;
  }


  hasBaseButton(name: string, barButtonConfigarConfig:BarButtonConfig){
    let nameFirstUpperCase = name.charAt(0).toUpperCase() + name.substr(1);
    let keys = Object.keys(barButtonConfigarConfig);
    //let pre = ["mostrar","fnIsDisabled","fnIsVisible","fn"];
    return ARRAY_PROP_BUTTON_CONFIG_BASE.some(item => keys.includes(item + nameFirstUpperCase));
  }

  clickUploadCliente(buttonConfig:ButtonConfig, event){
    let self = this;
    let input = event.target;
    for (var index = 0; index < input.files.length; index++) {
        let reader = new FileReader();
        reader.onload = () => {
            // this 'text' is the content of the file
            let text = reader.result;
            buttonConfig.fnClick(text);
        }
        reader.readAsText(input.files[index]);
    };
  }

  private uploadFile(buttonConfig:ButtonConfig, file: File){
    let self = this;
    try {
      self.uploadService.uploadFile(self.config.fnUrlCargarServidor(), file).subscribe({
        next: (result: any) => {
          if (result.type == HttpEventType.UploadProgress) {
            const percentDone = Math.round(100 * result.loaded / result.total);
            //console.log('File is ${percentDone}% loaded.');
          } else { // if (event instanceof HttpResponse) 
            //console.log('File is completely loaded!');
            buttonConfig.fnClick(result);
          }
        }, 
        error: (error: any) => {
          //console.log("Upload Error:", error);
        }, 
        complete: () => {
          //console.log("Upload done");
        }
      });
    }
    catch(error){
      console.log(error);
    }
  }

  clickUploadServidor(buttonConfig:ButtonConfig, event){
    let self = this;
    let fileList: FileList = event.target.files;
    if (fileList.length > 0){
      if (self.config.fnUrlCargarServidor!=null){
        for(let i=0; i<fileList.length;i++){
          self.uploadFile(buttonConfig, fileList[i]);
        }
      }
    }
  }

  click(buttonConfig:ButtonConfig, event){
    if (buttonConfig.type == ButtonType.Donwload){
      window.open(buttonConfig.urlDownload);  
    }
    else if (buttonConfig.fnClick){
      if (buttonConfig.type == ButtonType.Standard){
        buttonConfig.fnClick();
      }
      else if (buttonConfig.type == ButtonType.UploadCliente){
        this.clickUploadCliente(buttonConfig, event);
      }
      else if (buttonConfig.type == ButtonType.UploadServidor){
        this.notificacionService.warning("Cargando","El archivo se esta cargando.");
        this.clickUploadServidor(buttonConfig, event);
      }
    }
  }

  mostrar(buttonConfig:ButtonConfig){
    return buttonConfig.fnIsVisible?buttonConfig.fnIsVisible():buttonConfig.mostrar;
  }
  /*
  mostrarBoton(...name:string[]){

  }

  ocultarBoton(...name:string[]){
    name.forEach(buttonName => {
    });
  }*/

}
