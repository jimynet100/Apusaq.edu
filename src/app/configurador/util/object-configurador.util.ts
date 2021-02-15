export class ObjectConfiguradorUtil {
    static existParamInData(data:any, mapingParam: any):boolean{
        return ObjectConfiguradorUtil.existPropertiesInObject(data, (Object.values(mapingParam) || []));
      }

      static existPropertiesInObject(data:any, properties:string[]):boolean{
        if (!properties || properties.length==0) return true;
        if (!data) return false;
        for(let i = 0; i < properties.length; i++){
          if (!data[properties[i]] || data[properties[i]]==''){
            return false;    
          }
        }
        return true;
      }

      /* extrae los parametros necesarios del objeto de data, que podria ser la data de un formulario o un elemento de un grid */
      static getParamFromData(data:any, mapingParam: any){
        if (data && mapingParam){
          let keysParam = Object.keys(mapingParam);
          let param = {}
          keysParam.forEach(keyParam => {
              param[keyParam] = data[mapingParam[keyParam]];//extraemos el atributo desde la data que necesita la accion     
          });
          return param;
        }
        return null;
      }

      static getParamByListName(data:any, lstParamName: string[]){
        let result = {};
        lstParamName.forEach(name => {
          result[name] = data[name];
        });
        return result;
      }
}

