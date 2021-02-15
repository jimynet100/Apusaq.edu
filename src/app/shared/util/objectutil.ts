export class ObjectUtil {

    static copiarObjPrimerNivel(origen){
        if (origen){
            let r={};
            for (let key in origen) {
                r[key] = origen[key];
            }
            return r;
        }
        return null;
    }

    /*
    Properties: Yes
    Methods: No
    Deep Copy: No
    */
    static copiarObjPrimerNivel2(origen){
        if (origen){
            return Object.assign({}, origen);
        }
        return null;
    }

    /*
    Properties: Yes
    Methods: Yes
    Deep Copy: No
    */
   static copiarObjPrimerNivelConMetodos(origen){
        if (origen){
            return Object.create(origen);
        }
        return null;
    }

    /*
    Properties: Yes
    Methods: No
    Deep Copy: Yes
    */
    static copiarObjTodoNivel(obj){
        let copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;
    
        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
    
        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = ObjectUtil.copiarObjTodoNivel(obj[i]);
            }
            return copy;
        }
    
        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = ObjectUtil.copiarObjTodoNivel(obj[attr]);
            }
            return copy;
        }
    
        throw new Error("No se puede copiar objeto, no es soportado");
    }
    /*
    static createCopy(objectToCopy: YourClassName): YourClassName{
        return (JSON.parse(JSON.stringify(objectToCopy)));
    }*/

    static unirObj(desde,hacia){
        desde = desde?desde:{};
        hacia = hacia?hacia:{};
        let r=this.copiarObjPrimerNivel(hacia);
        for (let key in desde) {
            r[key] = desde[key];
        }
        return r;
    }

    static atributosDistintoNulo(obj):boolean{
        if (!obj){
            return false;
        }
        for (let key in obj) {
            if (!obj[key]){
                return false;    
            }
        }
        return true;
    }

    static clonarFunction(funcion){
        //return JSON.parse(JSON.stringify(funcion));
        return new funcion();
    }
}