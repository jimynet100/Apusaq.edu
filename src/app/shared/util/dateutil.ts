import * as moment from 'moment';

export enum DateFormat{
    DDMMYYY = 'DD/MM/YYYY',
    YYYMMDD = 'YYYY/MM/DD',
    DDMMYYY_HHmm = 'DD/MM/YYYY HH:mm',
    YYYMMDD_HHmm = 'YYYY/MM/DD HH:mm'
  }

export class DateUtil {
    static toStringDDMMYYYY(fecha:string):string {
        if (fecha){
            let val = new Date(fecha);
            return ('0'+val.getDate()).substr(-2,2) + '-' + ('0'+(val.getMonth()+1)).substr(-2,2) + '-' + val.getFullYear();
        }
        return '';
    }

    static NowToYYYYMMDDHHmmss():string {
        let val = new Date();
        return val.getFullYear() + ('0'+(val.getMonth()+1)).substr(-2,2) + ('0'+val.getDate()).substr(-2,2) + '_' + ('0'+val.getHours()).substr(-2,2) + ('0'+val.getMinutes()).substr(-2,2) + ('0'+val.getSeconds()).substr(-2,2);
    }

    static NowToYYYYMMDD():string {
        let val = new Date();
        return val.getFullYear() + ('0'+(val.getMonth()+1)).substr(-2,2) + ('0'+val.getDate()).substr(-2,2);
    }

    static toStringDDMMYYYYHHmmss(fecha:string):string {
        if (fecha){
            let val = new Date(fecha);
            return ('0'+val.getDate()).substr(-2,2) + '-' + ('0'+(val.getMonth()+1)).substr(-2,2) + '-' + val.getFullYear() + ' ' + ('0'+val.getHours()).substr(-2,2)+ ':' + ('0'+val.getMinutes()).substr(-2,2) + ':' + ('0'+val.getSeconds()).substr(-2,2);
        }
        return '';
    }
    
    static stringDDMMYYYToDate(value:string):Date{
        if (!value) return null;
        return moment(value, DateFormat.DDMMYYY, true).toDate();//.format()
    }

    static stringDDMMYYY_HHmmToDate(value:string):Date{
        if (!value) return null;
        return moment(value, DateFormat.DDMMYYY_HHmm, true).toDate();//.format()
    }

    static stringYYYMMDDToDate(value:string):Date{
        if (!value) return null;
        return moment(value, DateFormat.YYYMMDD, true).toDate();//.format()
    }

    static stringYYYMMDD_HHmmToDate(value:string):Date{
        if (!value) return null;
        return moment(value, DateFormat.YYYMMDD_HHmm, true).toDate();//.format()
    }
    static stringToDate(value:string, format:string):Date{
        if (!value) return null;
        return moment(value, format, true).toDate();
    }
    static dateToString(value:Date, format:string):string{
        if (!value) return null;
        return moment(value).format(format);
    }
}

