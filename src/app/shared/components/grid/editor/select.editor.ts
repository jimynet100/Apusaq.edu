import { AfterViewInit, Component, ViewChild, ViewContainerRef, OnDestroy, OnInit } from '@angular/core';

import {ICellEditorAngularComp} from "ag-grid-angular";
import { SelectComponent } from '../../dynamic-form/components/select/select.component';

@Component({
    selector: 'select-cell',
    template: ``//utilSelect [preConfig]="config"
})
//revisar compatibilidad
/*
<app-select #select  [config]="config"  style="width: 100%" [(ngModel)]="value"  ></app-select>

*/
export class SelectEditor implements ICellEditorAngularComp, AfterViewInit, OnInit, OnDestroy {
    private params: any;
    public value: number;
    private cancelBeforeStart: boolean = false;
    @ViewChild(SelectComponent,{static:false}) select: SelectComponent;

    config;

    constructor() {
        //this.config = <SelectConfig>SelectNegocioUtil.getConfigPorTipoCombo(TipoComboEnum.TIPO_FICHA);
    }

    ngOnInit() {
        //console.log('ngOnInit : SelectEditor');
        //this.select.config = <SelectConfig>SelectNegocioUtil.getConfigPorTipoCombo(TipoComboEnum.TIPO_FICHA);
        this.select.iniciar();
    } 

    ngOnDestroy(): void {
        //console.log('ngOnDestroy : SelectEditor');
    }  

    agInit(params: any): void {
        this.params = params;
        this.value = this.params.value;

        // only start edit if key pressed is a number, not a letter
       // this.cancelBeforeStart = params.charPress && ('1234567890'.indexOf(params.charPress) < 0);
    }

    getValue(): any {
        return this.value;
    }

    isCancelBeforeStart(): boolean {
        return this.cancelBeforeStart;
    }

    // will reject the number if it greater than 1,000,000
    // not very practical, but demonstrates the method.
    isCancelAfterEnd(): boolean {
        return this.value > 1000000;
    };

    onKeyDown(event): void {

    }

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        
       // debugger;
        //this.select.iniciar();
        /*
        setTimeout(() => {
            this.input.element.nativeElement.focus();
        })*/
    }
    /*
    private getCharCodeFromEvent(event): any {
        event = event || window.event;
        return (typeof event.which == "undefined") ? event.keyCode : event.which;
    }

    private isCharNumeric(charStr): boolean {
        return !!/\d/.test(charStr);
    }

    private isKeyPressedNumeric(event): boolean {
        const charCode = this.getCharCodeFromEvent(event);
        const charStr = event.key ? event.key : String.fromCharCode(charCode);
        return this.isCharNumeric(charStr);
    }*/
} 