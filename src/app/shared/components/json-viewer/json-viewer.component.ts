import { Component } from '@angular/core';
import { PaginaBaseComponent, IPaginaBaseComponent } from '../../base/pagina-base';

@Component({
  selector: 'app-json-viewer',
  templateUrl: './json-viewer.component.html',
  styleUrls: ['./json-viewer.component.scss']
})
export class JsonViewerComponent extends PaginaBaseComponent implements IPaginaBaseComponent {

  jsonData:any;

  constructor() {
    super();
    
   }
   
   ngOnInit() {
    
    let self = this;
    let dataParent = self.getDataFromParent();
    if (dataParent.jsonData){
      
      try {
        this.jsonData = JSON.parse(dataParent.jsonData) ;
      }
      catch(e) {
        this.jsonData = {msg:'Ocurrieron problemas cargando la data'};
      };
    }
    else{
      this.jsonData = {msg:'Ocurrieron problemas cargando la data'};
    }
  }

  ngOnInit2() {}
  
  postReloadSessionStorage(value:any) {}

  get code() {
    return JSON.stringify(this.jsonData, null, 2);
  }

  set code(v) {
    try {
      this.jsonData = JSON.parse(v);
    }
    catch(e) {
      console.log('error occored while you were typing the JSON');
    };
  }

}
