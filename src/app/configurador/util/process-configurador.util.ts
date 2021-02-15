import { IContenerPageComponent, Process, ExecuteQueryParam } from '../model/model';
import { ObjectConfiguradorUtil } from './object-configurador.util';
export interface ExecuteParam{
  params?;
  data?;
}
export class ProcessConfiguradorUtil {
  
      static createFunctionFromProcess(contenedorPage: IContenerPageComponent, process: Process, getData?:(paramData?:any)=>any/* funcion que retorna la data */, isValid?:(paramData?:any)=>boolean){
        if (process==null){
            return null;
        }
        const pageId = process.pageId;
        const queryId = process.queryId;
        const notificationId = process.notificationId;
        if (queryId){
          return function(paramData?:any){/* puede tener un parametro  */
            if (process.validate && isValid && !isValid(paramData)) return; /* salimos porque no es valido, por ejemplo un formulario que le faltan campos */  
            const data = getData? getData(paramData): null;
            const param = ObjectConfiguradorUtil.getParamFromData(data, process.param);
            let par:ExecuteQueryParam = {
              queryId: queryId,
              pageId: pageId,
              params: param,
              data: data, 
              process: process,
              notificationId: notificationId
            };
            contenedorPage.executeQuery(par);
          };
        } else if (pageId != null){
          return function(paramData?:any){
            if (process.validate && isValid && !isValid(paramData)) return; /* salimos porque no es valido, por ejemplo un formulario que le faltan campos */  
            const data = getData? getData(paramData): null;
            const param = ObjectConfiguradorUtil.getParamFromData(data, process.param);
            contenedorPage.navigateByPageId(pageId, param, data);
          }
        }
        return null;
      }
}