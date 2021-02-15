import { saveAs } from 'file-saver';
import { AppInjector } from '../services/base/app-injector.service';
import { HttpClient } from '@angular/common/http';


export class FileUtil {
    static donwloadTxt(txt: string, fileName:string) {
        var blob = new Blob([txt], {type: "text/plain;charset=utf-8"});
        saveAs(blob, fileName + ".txt");
    }
    /*
    static downLoadFile(data: any, type: string) {
        let blob = new Blob([data], { type: type});
        let url = window.URL.createObjectURL(blob);
        let pwa = window.open(url);
        if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
            alert( 'Please disable your Pop-up blocker and try again.');
        }
    }
   
    static donwloadFileFromUrl(url: string) {
        let http: HttpClient = AppInjector.getInjector().get(HttpClient);
        http.get(`${url}`,{
            responseType: 'arraybuffer',headers:headers} 
           ).subscribe(response => this.downLoadFile(response, "application/ms-excel"));
    }*/

    static donwloadFileFromUrl(url: string, filename: string) {
        var a = document.createElement("a");
        a.href = url;
        a.setAttribute("download", filename);
        a.click();
    }

    
}


