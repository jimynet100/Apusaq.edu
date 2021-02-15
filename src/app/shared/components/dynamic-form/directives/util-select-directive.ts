import { Directive, ElementRef, Renderer, Input, ViewChild, OnInit, HostListener } from '@angular/core';
import { UtilService } from 'src/app/shared/services/util/util.service';
import { SelectComponent } from '../components/select/select.component';

@Directive({ selector: '[utilSelect]' })
export class UtilSelectDirective implements OnInit {
    @Input() preConfig;
    constructor(private el: ElementRef, private renderer: Renderer, private select: SelectComponent, private utilService : UtilService) {

    }
    ngOnInit() {
        /*
        let configBase = SelectNegocioUtil.getConfigPorTipoCombo(this.preConfig.tipoCombo);
        configBase['propertyLabel'] = this.preConfig['propertyLabel'] ? this.preConfig['propertyLabel'] : configBase['propertyLabel'];   
        configBase['propertyValue'] = this.preConfig['propertyValue'] ? this.preConfig['propertyValue'] : configBase['propertyValue'];   
        this.select.config = <SelectConfig>ObjectUtil.unirObj(configBase,this.preConfig);*/
        //debugger;
        this.select.config = this.preConfig;
        this.select.iniciar();
    }
}
