import { DateUtil } from "../../../util/dateutil";

export class GridUtil {

    static createCellRendererDateDDMMYYYY(){
        return function(param){
            if (param && param.value){
                return DateUtil.toStringDDMMYYYY(param.value);
            }
            else
            {
                return ''; 
            }
        };
    }

    static createCellRendererDateDDMMYYYYHHmmss(){
        return function(param){
            if (param && param.value){
                let val = param.value;
                console.log(val, DateUtil.toStringDDMMYYYYHHmmss(val));
                return DateUtil.toStringDDMMYYYYHHmmss(val);
            }
            else
            {
                return '';
            }
        };
    }

    
    static createCellRendererNumber(){
        return function(param){
            
            let bgClass:string;
            
            if (param && param.value > 0)
            {
                bgClass = (param.value > 0) ? 'badge-light' : 'badge-warning';
                return `<span class="badge ${ bgClass }">${ param.value }</span>`;
            } 
            else if (param && param.value == 0) 
            {
                bgClass = (param.value > 0) ? 'badge-light' : 'badge-warning';
                return `<span class="badge ${ bgClass }">${ param.value }</span>`;
            }
            else
            {
                return '';
            }

            /*if (param)
            {
                let bgClass = (param.value > 0) ? 'badge-light' : 'badge-warning';  
                return `<span class="badge ${ bgClass }">${ param.value }</span>`;
            } 
            else
            {
                return '';
            }*/
        };
    }

    static createCellRendererSepareNumbersByCome(){
        return function(param){
            if (param && param.value){
                
                let result:string = '';
                let bgClass = 'badge-primary';
                let numbersArray:any = param.value.split(',');
                
                numbersArray.forEach(element => {
                    result += `<span class="badge ${ bgClass }">${ element }</span>&nbsp;`;
                });

                return result;
            }
            else
            {
                return ''; 
            }
        };
    }
    

    static createCellClassColorByValue(colorByValue) {
        return (param) => {
            if (param && param.value){
                return 'badge';
            }
            else {
                return '';
            }
        };
    }

    static createCellStyleColorByValue(colorByValue) {
        return (param) => {
            if (param && param.value && colorByValue[param.value]){
                return {
                    'color': 'white',
                    'background-color': colorByValue[param.value]
                };
            }
            else {
                return '';
            }
        };
    }

    static createValueFormatterSecondToLiteral() {
        return (param) => {
            if (param && param.value){
                let second: number = Number(param.value);
                if (second<120)
                    return '1 minuto'
                else if (second < 3600)
                    return Math.floor(second/60) + ' minutos'; 
                else if (second < 86400)
                    return Math.floor(second/3600) + ' hora(s)';   
                else if (second >= 86400)
                    return Math.floor(second/86400) + ' día(s)'; 
                return '';
            }
            else {
                return '';
            }
        };
    }


    static createCellRendererBadge(colorByValue){
        return (param) => {
            if (param && param.value){
                return `<span class="badge" style="color: white; font-size: small; text-transform: uppercase; background-color: ${ colorByValue[param.value] };" >${ param.value }</span>`;
            }
            else
            {
                return '';
            }
        };
    }

    /*
    static createCellRendererBadge(fieldId, fieldDes, config:Map<any,any>) {
        return (param) => {
            if (param && param.data){
                let estado:string = param.data?param.data[fieldId]:null;
                let estadoDes:string = param.data?param.data[fieldDes]:null;
                let bgClass = config.get(estado) || 'badge-danger';
                return `<span class="badge ${ bgClass }">${ estadoDes }</span>`;
            }
            else
            {
                return '';
            }
        };
    }*/

}