import { Component, OnInit, Input } from '@angular/core';
import { GeneralService } from '../../services/base/general.service';
import { Style, Column } from '../../model/model';

 export class TableConfig{
    title: string;
    url: string;
    columns: Column[];
    headerStyle?:Style[];
    
 } 

export class ClientPage{
  list:any[];
  visible:boolean;
  pageNumber: number;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  rowData=[];
  niveles=1;
  widthTable="2000px";
  cab1:Column[];
  cab2;
  cab3;
  cab1Style;
  cab2Style;
  cab3Style;
  showCab:boolean=true;
  @Input() config: TableConfig;
  _filtro: any={};
  @Input() set filtro(value){
    this._filtro = value;
  }
  get filtro(){
    return this._filtro;
  }

  listClientPage:ClientPage[];

  //public idx:any;

  constructor(private generalService: GeneralService) {}

  ngOnInit() {  

    //this.idx = 0;
    
    const self = this;
    self.niveles = self.getNiveles();

    self.cab1Style = self.config.headerStyle && self.config.headerStyle.length>0?self.config.headerStyle[0]:null;
    self.cab2Style = self.config.headerStyle && self.config.headerStyle.length>1?self.config.headerStyle[1]:null;
    self.cab3Style = self.config.headerStyle && self.config.headerStyle.length>2?self.config.headerStyle[2]:null;

    if (self.niveles == 1){
      self.cab1 = self.config.columns;
      //console.log(self.cab1);
    }
    else if (self.niveles == 2){
      self.cab1 = [];
      self.cab2 = self.config.columns;
      self.cab2.forEach(col => {
        if (col.columns){
          self.cab1.push(...col.columns);
        }      
      });
    }
    else if (self.niveles == 3){
      self.cab1 = [];
      self.cab2 = [];
      self.cab3 = self.config.columns;
      self.cab3.forEach(col => {
        if (col.columns){
          self.cab2.push(...col.columns);
          col.columns.forEach(subCol => {
            if (subCol.columns){
              self.cab1.push(...subCol.columns);
            }      
          });
        }      
      });
    }

    self.widthTable = self.getTableWidth(self.cab1);

    self.showCab = self.existeCab(); 
    if (self.config.url){
      this.search();
    }
    
  }

  private getTableWidth(columns: Column[]): string{
    let width = 0;
    columns.forEach(cab => {
      if (cab.width)
        width =  width + cab.width;
      else 
      width =  width + 100;
    });
    return  width + "px";
  }

  private existeCab():boolean{
    const self = this;
    for(let i=0; i<self.cab1.length; i++){
      if (self.cab1[i]['label']){
        return true;
      }
    }
    return false;
  }

  private getNiveles():number{
    const self = this;
    let niveles=1;
    /* validamos cuantos niveles tiene la tabla */
    self.config.columns.forEach(col => {
      if (col.columns){
        if (niveles< 2) niveles = 2;
        col.columns.forEach(subCol => {
          if (subCol.columns){
            if (niveles< 3) niveles = 3;
          }      
        });
      }      
    });
    return niveles;
  }

  // public paginar(index:any){
  //   console.log(index);
  // }

  // make(dato:any){
  //   console.log(dato);
  // }

  clickPage(pageNumber:any){
    // console.log("function called "+dato);
    //this.idx = dato-1;

    //console.log("function called "+this.idx);
    //this.search();
    this.listClientPage.forEach((page, index)=>{
      page.visible  = (pageNumber-1 == index) ? true : false;
    });
  }

  search(filtroCustom?:any) {
    //console.log("filtroCustom: "+filtroCustom);
    let self = this;
    let config = self.config;
    //console.log("config: "+config.title);
    if (config){
      self.generalService.createPost(config.url,self.createFiltro(filtroCustom)).subscribe({
        next: (data: any) => {
          for(let i=1; i<data.length; i++){
            data[i]['orden'] = i+1;
          }
          self.rowData = data;
        
          self.listClientPage = self.createListPage(data);
          //console.log(self.listClientPage);

        }, 
        error: (error: any) => {

        }, 
        complete: () => {

        }
      });
    }
  }

  createFiltro(filtroCustom?:any):any{
    const self = this;
    if (self.filtro || filtroCustom){
      self._filtro = Object.assign(self.filtro,filtroCustom);
      //console.log(self.filtro);
      return self.filtro;
    } 
    return {};
  }

  hasLevel3():boolean{
    return this.niveles > 2;
  }

  hasLevel2():boolean{
    return this.niveles > 1;
  }

  getColSpan(col):number{
    //console.log(col);
    if(col.colspan!=undefined||col.colspan!=null)
    {
      return col.colspan;
    }
    return col.columns && col.columns.length > 0 ? col.columns.length : 1;
  }

  getCab1Style(col:Column):Style{
    return col.headerStyle || this.cab1Style;
  }

  getCellStyle(col:Column, data: any):Style{
    if (col.styleType == 1 && data[col.name])//data[col.name]
    {
      return {
        color: 'white',
        backgroundColor: col.styleValue[data[col.name]]
      };
    }
    return null;
  }

  getData(){
    return this.rowData;
  }

  getWidth(col:Column): string{
    return col.width? (col.width + 'px') : '100px';
  }

  createListPage(data): ClientPage[]{
    let cantRegistros = data.length;
    let sizePage = 5;

    var paginas = Math.floor(cantRegistros/sizePage);
    var residuo = cantRegistros%sizePage;

    if(residuo != 0){
      paginas = paginas + 1;
    }

    //console.log(paginas+" - "+residuo);
    let listClientPage = [];
    for(let i = 0; i < paginas; i++){
      listClientPage.push({
        visible:(i==0)?true:false,
        list: data.slice(i*sizePage, i*sizePage + sizePage),
        pageNumber: i+1
      });
    }
    return listClientPage;
  }

}
