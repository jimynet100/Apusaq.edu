import { WindowUtil } from "./windowutil";
import { environment } from 'src/environments/environment';


export class UrlUtil {
    static jsonToParamsUrl(obj:any) : string{
        let params: URLSearchParams = new URLSearchParams();
        for (let key in obj) {
            if (obj[key]){
                params.set(key, obj[key]);
            }
        }
        return params.toString();
    }

    static urlWithParams(url:string, params:any) : string{
        return url + '?' + this.jsonToParamsUrl(params);
    }

    static getHostName() : string{
        return WindowUtil.getWindow().location.hostname;
    }

    static getApiUrl() : string{
        let temp:string = environment.apiUrl;
        if (temp.indexOf('http')==-1){
            temp = 'http://' + UrlUtil.getHostName() + temp;
        }
        return temp;
    }

    static getApiSeguridadUrl() : string{
        let temp:string = environment.apiSeguridadUrl;
        if (temp.indexOf('http')==-1){
            temp = 'http://' + UrlUtil.getHostName() + temp;
        }
        return temp;
    }

    static getApiReporteUrl() : string{
        let temp:string = environment.apiReporteUrl;
        if (temp.indexOf('http')==-1){
            temp = 'http://' + UrlUtil.getHostName() + temp;
        }
        return temp;
    }

    static getUrl() : string{
        let temp:string = environment.url;
        if (temp){
            return temp;//si es distinto de nulo se retorna el url
        }
        if (temp.indexOf('http')==-1){
            temp = 'http://' + UrlUtil.getHostName() + temp;
        }
        return temp;
    }

    static getActualQueryParams():any{
        return UrlUtil.getQueryParamsFromUrl(document.location.search);
    }

    static getQueryParamsFromUrl(url):any{
        if (url.indexOf('?') == -1) return null; 
        url = url.substr(url.indexOf('?'));
        let array = url.split('+').join(' ');
        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;
        while (tokens = re.exec(array)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
        return params;
    }
}



