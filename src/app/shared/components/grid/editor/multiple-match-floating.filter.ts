import {AfterViewInit, Component} from "@angular/core";

import {IFloatingFilter, IFloatingFilterParams, SerializedTextFilter, GridApi} from "ag-grid-community";
import {AgFrameworkComponent} from "ag-grid-angular";
import { SetFloatingFilterComp } from "ag-grid-community/dist/lib/filter/floatingFilter";
import { CombinedFilter } from "ag-grid-community/dist/lib/filter/baseFilter";

export interface MultipleMatchFloatingFilterChange {
    model: SerializedTextFilter
}
export interface MultipleMatchFloatingFilterParams extends IFloatingFilterParams<SerializedTextFilter, MultipleMatchFloatingFilterChange> {
    value: number
}
@Component({
    template: `
`,
    styleUrls: ['./multiple-match-floating.filter.css']
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
        (open)="onOpen($event)"
        (close)="onClose($event)"
        (focus)="onFocus($event)"
        >
            <ng-template ng-header-tmp>
                <input style="width: 100%; line-height: 24px" type="text" (input)="api.filter($event.target.value)" />

                <div class="form-row text-center btn-toolbar m-1">
                    <div class="col-12" >
                        <button (click)="selectAll()"   class="btn btn-outline-dark btn-sm">[Todo]</button>
                        <button (click)="unselectAll()" class="btn btn-outline-dark btn-sm">[Nada]</button>
                    </div>
                </div>
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
export class MultipleMatchFloatingFilter implements IFloatingFilter<SerializedTextFilter, MultipleMatchFloatingFilterChange, MultipleMatchFloatingFilterParams>, AgFrameworkComponent<MultipleMatchFloatingFilterParams>{
    private params: MultipleMatchFloatingFilterParams;
    private colName: string;
    public currentValue: string[];
    public arrayValor:any[]=[];
    public arrayNodeId:any[]=[];
    agInit(params: MultipleMatchFloatingFilterParams): void {
        this.params = params;
        this.currentValue = [];
        this.colName = params.column.getColDef()['field'];
        //console.log(params.column);
    }

    valueChanged() { 
        this.params.onFloatingFilterChanged({model: this.buildModel()});
    }
    
    onParentModelChanged(parentModel: SerializedTextFilter, combinedFilter?: CombinedFilter<SerializedTextFilter>): void {
        if (!parentModel || !parentModel.filter) {
            this.currentValue = [];
        } else {
            this.currentValue = parentModel.filter.split(',');
        }
    }

    buildModel(): SerializedTextFilter {
        if (this.currentValue === null || this.currentValue.length==0) {
            return null;
        }
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

    onOpen(event){
        //console.log('onOpen');
        let self = this;
        //console.log(self.params.api.getModel());
        //console.log(self.params.api.getFilterModel());
        let map = new Map();
        self.params.api.forEachNodeAfterFilter(rowNode=>{
            //console.log(rowNode);
            self.arrayNodeId.push(rowNode.id);
            let val = rowNode.data[self.colName];
            if (!map.has(val)){
                map.set(val,{name:val,id:val});    
            }
        });
        this.arrayValor = Array.from(map.values()).sort();
    }

    onFocus(event){
        
    }
    onClose(event){
        console.log('onClose');
    }
}