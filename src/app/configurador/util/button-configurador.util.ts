import { Button, IContenerPageComponent } from '../model/model';
import { BarButtonConfig } from 'src/app/shared/components/bar-button/bar-button.component';
import { ProcessConfiguradorUtil } from './process-configurador.util';
import { ButtonConfig, ButtonType } from 'src/app/shared/model/model';


export class ButtonConfiguradorUtil {



      static  createHeaderArrayButtonConfig(arrayButton: Button[]): ButtonConfig[]{
        const self = this;
        let buttons: ButtonConfig[] = [];
        if (arrayButton != null && arrayButton.length > 0){
          arrayButton.forEach(btn=>{
            let buttonConfig = ButtonConfiguradorUtil.createButtonBase(btn);
            buttons.push(buttonConfig); 
          });
        }
        return buttons;
      }


      static createBarButtonConfigBase(arrayButton: Button[]): BarButtonConfig{
        let arrayButtonConfig = !arrayButton ? null : arrayButton.map(function(btn) {
          return ButtonConfiguradorUtil.createButtonBase(btn);
        });
        return {
          arrayButtonConfig: arrayButtonConfig
        };
      }

      static createButtonBase(btn: Button):ButtonConfig{
        let buttonConfig:ButtonConfig = {
          name : btn.name,
          mostrar: true,
        };
        if (btn.label) buttonConfig.titulo = btn.label;
        if (btn.iconClass) buttonConfig.iconClass = btn.iconClass;
        if (btn.tooltip) buttonConfig.tooltip = btn.tooltip;
        if (btn.url){
          buttonConfig.type = ButtonType.Donwload;
          buttonConfig.urlDownload = btn.url;
        }
        return buttonConfig;
      }
}

