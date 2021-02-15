import {AfterViewInit, Component, ViewContainerRef, ViewChild} from "@angular/core";

import {SerializedTextFilter, GridApi, IFilterParams, RowNode, IDoesFilterPassParams, IAfterGuiAttachedParams} from "ag-grid-community";
import {IFilterAngularComp} from "ag-grid-angular";
import { MultipleMatchFloatingFilterChange } from "./multiple-match-floating.filter";


@Component({
    selector: 'filter-cell',
    template: `
    <div class="container">
        Partial Match Filter: <input #input (ngModelChange)="onChange($event)" [ngModel]="text" class="form-control">
    </div>
    `, styles: [
        `
            .container {
                border: 2px solid #22ff22;
                border-radius: 5px;
                background-color: #bbffbb;
                width: 200px;
                height: 50px
            }
            
            input {
                height: 20px
            }
        `
    ]
}) 
export class MultipleMatchFilter implements IFilterAngularComp  {
    private params: IFilterParams;
    private valueGetter: (rowNode: RowNode) => any;
    public text: string = '';

    @ViewChild('input', {read: ViewContainerRef, static:false}) public input;

    agInit(params: IFilterParams): void {
        this.params = params;
        this.valueGetter = params.valueGetter;
    }

    isFilterActive(): boolean {
        return this.text !== null && this.text !== undefined && this.text !== '';
    }

    doesFilterPass(params: IDoesFilterPassParams): boolean {
        return this.valueGetter(params.node) && this.text.toLowerCase()
        .split(",")
        .some((filterWord) => {
            return this.valueGetter(params.node).toString().toLowerCase()==filterWord;
        });
    }

    getModel(): SerializedTextFilter {
        return {
            filterType: 'text',
            type: 'equals',
            filter: this.text
        };
    }

    setModel(model: SerializedTextFilter): void {
        this.text = model &&  model.filter ? model.filter : '';
    }

    ngAfterViewInit(params: IAfterGuiAttachedParams): void {
        window.setTimeout(() => {
            this.input.element.nativeElement.focus();
        })
    }

    // noinspection JSMethodCanBeStatic
    componentMethod(message: string): void {
        alert(`Alert from PartialMatchFilterComponent ${message}`);
    }

    onChange(newValue): void {
        if (this.text !== newValue) {
            this.text = newValue;
            this.params.filterChangedCallback();
        }
    }

    getModelAsString(model: SerializedTextFilter):string{
        //console.log('MultipleMatchFilter.model',model);
        return this.text;
    }

    onFloatingFilterChanged(change: MultipleMatchFloatingFilterChange): void{
        if (change.model && change.model.filter){
            this.text = change.model.filter;
        }
        else{
            this.text = '';
        }
        this.params.filterChangedCallback();
    }

}