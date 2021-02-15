import { AfterViewInit, Component, ViewChild, ViewContainerRef, OnInit, OnDestroy, ComponentFactoryResolver } from '@angular/core';

import {ICellEditorAngularComp} from "ag-grid-angular";
import { TipoComboEnum } from 'src/app/shared/constantes/constantes';
import { ManagerComponent } from '../../../base/manager-component';
import { SelectComponent } from '../../dynamic-form/components/select/select.component';

@Component({
    selector: 'dynamic-cell',
    template: `<template #container></template>`//utilSelect [preConfig]="config"
})
export class DynamicEditor extends ManagerComponent implements ICellEditorAngularComp, AfterViewInit, OnInit, OnDestroy {
    
    private params: any;
    public value: number;
    private cancelBeforeStart: boolean = false;
    private comp;
    @ViewChild('container', {read: ViewContainerRef, static:false}) public select;

    constructor(resolver: ComponentFactoryResolver) { super(resolver); }
  

    ngOnInit() {
        //console.log('ngOnInit : DynamicEditor');
        this.comp = this.createComponentBase(SelectComponent);
    } 

    ngOnDestroy(): void {
        //console.log('ngOnDestroy : DynamicEditor');
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