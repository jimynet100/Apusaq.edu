import { Component, OnInit, Input } from '@angular/core';
import { ButtonConfig } from '../../model/model';

export interface HeaderPageConfig{
  title?:string;
  iconClass?:string;
  arrayButtonConfig?:ButtonConfig[];
}

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  styleUrls: ['./header-page.component.sass']
})
export class HeaderPageComponent implements OnInit {
  _config: HeaderPageConfig;
  arrayButtonConfig: ButtonConfig[];
  constructor() { }

  ngOnInit() {
  }

  get config(){
    return this._config;
  }

  @Input() set config(headerPageConfig:HeaderPageConfig){
    let self = this;
    if (headerPageConfig){
      /*
      let arrayButtonConfig=[];
      if (arrayButtonConfig.length>0){
        arrayButtonConfig.sort((a: ButtonConfig, b: ButtonConfig) => {
          if (a.orden && b.orden)
            return a.orden - b.orden;
          else{
            return -1;
          }
        });
        
      }*/
      self.arrayButtonConfig = headerPageConfig.arrayButtonConfig;
    }
    this._config = headerPageConfig;
  }

  click(buttonConfig:ButtonConfig, $event){
    if (buttonConfig.fnClick)
      buttonConfig.fnClick();
  }

}
