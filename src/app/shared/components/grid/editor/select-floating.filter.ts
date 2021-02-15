import {AfterViewInit, Component} from "@angular/core";

import {IFloatingFilter, IFloatingFilterParams, SerializedTextFilter, GridApi} from "ag-grid-community";
import {AgFrameworkComponent} from "ag-grid-angular";
import { SetFloatingFilterComp } from "ag-grid-community/dist/lib/filter/floatingFilter";
import { CombinedFilter } from "ag-grid-community/dist/lib/filter/baseFilter";

export interface SelectFloatingFilterChange {
    model: SerializedTextFilter
}

export interface SelectFloatingFilterParams extends IFloatingFilterParams<SerializedTextFilter, SelectFloatingFilterChange> {
    value: number
    //maxValue: number
}
@Component({
    template: `
`,
    styleUrls: ['./select-floating.filter.css']
}) 
//revisar compatibilidad
/*
    <ng-select 
        #api
        class="select-floating-filter"
        [items]="arrayValor"
        bindLabel="name"
        bindValue="id"
        [multiple]="true"
        placeholder=""
        clearAllText="Limpiar"
        [(ngModel)]="currentValue"
        (ngModelChange)="valueChanged()"
        appendTo="body"
        [closeOnSelect]="false"
        [searchable]="false"
        >
            <ng-template ng-header-tmp>
                <input style="width: 100%; line-height: 24px" type="text" (input)="api.filter($event.target.value)" />
                <button (click)="selectAll()" class="btn btn-sm btn-secondary">Todos</button>
                <button (click)="unselectAll()" class="btn btn-sm btn-secondary">Ninguno</button>
            </ng-template>

            <ng-template ng-option-tmp let-item="item" let-item$="item$" let-index="index">
                <input id="item-{{index}}" type="checkbox" [ngModel]="item$.selected"/> {{item.name}}
            </ng-template>

            <ng-template ng-multi-label-tmp let-items="items">
                {{getLabel(items)}}
            </ng-template>

            <ng-template ng-footer-tmp>
                Seleccionados: {{currentValue.length}}
            </ng-template>

    </ng-select>
*/
export class SelectFloatingFilter implements IFloatingFilter<SerializedTextFilter, SelectFloatingFilterChange, SelectFloatingFilterParams>, AgFrameworkComponent<SelectFloatingFilterParams>{
    private params: SelectFloatingFilterParams;
    //public maxValue: number;
    public currentValue: string[];
    //api: GridApi;
    public arrayValor:any[]=[
        {name:'nuevo 1', id:'1'},
        {name:'nuevo 2', id:'2'}, 
        {name:'nuevo 3', id:'3'}, 
        {name:'nuevo 4', id:'4'}
    ];
    /*
    init(params): void{
        console.log('init',params);
    }*/

    agInit(params: SelectFloatingFilterParams): void {
        //console.log('agInit',params);
        this.params = params;
        //this.maxValue = this.params.maxValue;
        this.currentValue = [];
    }

    valueChanged() {
        //console.log('valueChanged');   
        //this.params.onFloatingFilterChanged({model: this.buildModel()});
        this.params.api.setFilterModel({
            proId: ["8424", "ADSL"]
        });
        this.params.api.onFilterChanged();
        //this.gridApi.setFilterModel(hardcodedFilter);
    }
    
    onParentModelChanged(parentModel: SerializedTextFilter, combinedFilter?: CombinedFilter<SerializedTextFilter>): void {
        //console.log('parentModel',parentModel);
        if (!parentModel) {
            this.currentValue = [];
        } else {
            // note that the filter could be anything here, but our purposes we're assuming a greater than filter only,
            // so just read off the value and use that
            this.currentValue = parentModel.filter.split(',');
        }
    }

    buildModel(): SerializedTextFilter {
        if (this.currentValue === null || this.currentValue.length==0) {
            return null;
        }
        //console.log(this.currentValue);
        return {
            filterType: 'text',
            type: 'equals',
            filter: this.currentValue.join(',')
        };
    }

    getLabel(items){
        if (items.length>0){
            if (items.length==1){
                return items[0].name;
            }
            else{
                 return "[ Seleccionados: " + this.currentValue.length + "]";
            }
        }
        return null;
    }

    selectAll() {
        this.currentValue = this.arrayValor.map(x => x.id);
    }

    unselectAll() {
        this.currentValue = [];
    }

}