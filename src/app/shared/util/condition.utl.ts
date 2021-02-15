import { Condition } from '../model/model';

export class ConditionUtil {

    static evalConditionResult(condition:Condition, val:any, valType: {[dataType: string]: number} = null): string{
        if (!condition || !val) return '';
        if (condition.conditions && condition.conditions.length>0){
            for(let sub of condition.conditions){
                if (ConditionUtil.evalConditionBoolean(sub, val, valType))
                    return sub.result;
            }
        }    
        else
            return ConditionUtil.evalConditionBoolean(condition, val, valType) ? condition.result : '';
    }

    static evalConditionBoolean(condition:Condition, val:any, valType: {[dataType: string]: number} = null): boolean{
        if (!condition || !val) return false;
        //debugger;
        let exp = condition.expression;
        let keys = Object.keys(val);
        keys.forEach(key => {
            if (val[key])
                exp = exp.replace(new RegExp(`@${key}`, 'g'), `'${val[key]}'`);
            else{
                exp = exp.replace(new RegExp(`@${key}`, 'g'), 'null');
            }
        });
        /* si la variable no existe la cambiamos por nulo */
        exp = exp.replace(/@\w+/gi, null);
        return eval(exp);
        /*
        try{
            return eval(exp);
        }
        catch(ex){
            debugger;
            console.log(ex);
        }*/
    }
}

/*
let val = self.formGroup.value;
let keys = Object.keys(val);
let exp = self.fieldConfig.isVisibleCondition.expression;
keys.forEach(key => {
  exp = exp.replace(`@${key}`,`'${val[key]}'`);//`DNI: ${this.getUser().nroDni || ''}
});
return eval(exp);*/
