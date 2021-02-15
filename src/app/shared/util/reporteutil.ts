import { WindowUtil } from "./windowutil";
import { UrlUtil } from "./urlutil";

export class ReporteUtil {
    static openWindowHtml(reporte:string, filtro:any): void {
        WindowUtil.openWindow(UrlUtil.urlWithParams(this.getUrl(reporte,'html'), filtro));
    }
    static donwloadPdf(reporte:string, filtro:any): void {
        
        WindowUtil.openWindow(UrlUtil.urlWithParams(this.getUrl(reporte,'pdf'), filtro));
    }
    static downloadXls(reporte:string, filtro:any): void {
        WindowUtil.openWindow(UrlUtil.urlWithParams(this.getUrl(reporte,'xls'), filtro));
    }
    static getUrl(reporte:string,extension:String):string{
        return UrlUtil.getApiReporteUrl() + reporte + '.' + extension;
    }
}