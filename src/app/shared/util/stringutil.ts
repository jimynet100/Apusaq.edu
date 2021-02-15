export class StringUtil {
    static firstLetterToUpperCase(str){
        let temp = str?str.charAt(0).toUpperCase():null;
        return (str&&str.length>1)?(temp+str.slice(1)):temp;
    }
    static firstLetterToLowerCase(str){
        let temp = str?str.charAt(0).toLowerCase():null;
        return (str&&str.length>1)?(temp+str.slice(1)):temp;
    }
}

   
