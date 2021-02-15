import { ARRAY_TIPO_COMBO, TipoComboEnum } from '../constantes/constantes';
export class SelectNegocioUtil {

    static getConfigPorTipoCombo(tipoCombo:number){
        //tabla de tablas
        //1 a 500 elementos propios del sistema
        //501 a 1000 elementos que vienen de atis o cms
        //1001 a 10000 padres que se creen

        let index;
        let result;
        if (tipoCombo){
          if (tipoCombo<500){
            result = ARRAY_TIPO_COMBO[1];
            result['filtroBase']={tipoCombo:tipoCombo};
          } else if (tipoCombo<10000){
            result = ARRAY_TIPO_COMBO[2];
            result['filtroBase']={tipoCombo:tipoCombo};
          } else {
            result = ARRAY_TIPO_COMBO[tipoCombo];
          }
        }
        return result;
      }
}

