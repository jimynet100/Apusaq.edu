import { DateUtil } from './dateutil';
import { Workbook, Worksheet, Row } from 'exceljs';
import * as fs from 'file-saver';
import { Style, Column } from '../model/model';

export interface ExcelSectionConfig{
    title?:string;
    columns:Column[];
    data:any[];
    imageUrl?:string;   //alex06012020
}
export interface ExcelSheetConfig{
    title?:string;
    tabTitle?:string;
    sections:ExcelSectionConfig[];
}
export interface ExcelConfig{
    preName?:string;
    sheets?:ExcelSheetConfig[];
}
export interface ColmsRows{
    colms?:Column[];
    row?:Row;
}


export class ExcelUtil {
    ARRAY_COLUMN = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    static exportExcel(nameFile:string, columns: Column[], arrayData: any[]){
        let matriz = [];
        let arrayField:string[]=[];
        let headers:string[]=[];
        let arrayColDef=[];
        columns.forEach(col => {
            arrayField.push(col.name);
            if (col.label){
                headers.push(col.label);
            }
            else{
                headers.push(col.label);
            } 
            if (col.width){
                arrayColDef.push({width: col.width});
            }
            else{
                arrayColDef.push({});
            }
        });

        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Data');
        worksheet.columns = arrayColDef;
        let headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell, number) => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });
        headerRow.font = { size: 12, bold: true };
        arrayData.forEach(row=>{
            let array = [];            
            arrayField.forEach(fieldName=>{
                    //console.log("fieldName: "+fieldName+"row[fieldName]: "+row[fieldName]);
                    array.push(row[fieldName]);   
            });
            matriz.push(array);
        });

        worksheet.addRows(matriz);
        
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, nameFile + DateUtil.NowToYYYYMMDDHHmmss() + '.xlsx');
        });
    
    }

}

export class ExcelSectionUtil{

    
    static border:any = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    static fontHeader:any = {bold: true,name: 'Calibri', color: { argb: 'FFfcfdff' }, size: 10};
    static alignmentHeader:any = { vertical: 'middle', horizontal: 'center' };
    static fillHeader:any = {type: 'pattern',pattern: 'solid',fgColor:{argb: 'FF0099cc'}};
    
    static fontRow:any = {name: 'Calibri', color: { argb: 'FF343a40' }, size: 9};
    static alignmentRowleft:any = { vertical: 'middle', horizontal: 'left' };
    
    static addSectionTitle(sheet: Worksheet, section: ExcelSectionConfig):void{
        let row = sheet.addRow([section.title]);
        row.font = { size: 14, bold: true,color: { argb: 'FF0099cc' } };
        
        
        row.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFfcfdff' }//,
               // bgColor: { argb: 'FF0000FF' }
            }
         });

        let cant = 0;
        section.columns.forEach((col:Column)=>{
            cant = cant + Column.getTotalChild(col);
        });
        sheet.mergeCells(row.number, 1, row.number, cant);   
    }

    static addImage(sheet: Worksheet){

        var myBase64Image = "data:image/png;base64,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";
        var imageId2 = sheet.workbook.addImage({
        base64: myBase64Image,
        extension: 'png',
        });

        sheet.addImage(imageId2, {
            tl: { col: 0, row: 0 },
            br: { col: 1.45, row: 2 }
          });
    }
    static addHeadInforme(columns: Column[],sheet: Worksheet):Row{
        let rowtitle = [];   
        //Una Columna Mas                
        for(let a=0;a<3;a++){
            rowtitle.push(columns[a].label);
            rowtitle.push("");  
            if(a==0)
            {rowtitle.push("");}                     
        }
        let rowtitle0= sheet.addRow(rowtitle);  
        return rowtitle0;
    }
    static addHeadInformeStyle(rowtitle0: Row):void{
        let colcont=0;
        rowtitle0.eachCell((cell, number) => {
                cell.border = this.border;
                cell.fill = this.fillHeader;
                cell.font = this.fontHeader;
                cell.alignment = this.alignmentHeader;   
            colcont++;                     
        }); 
        
    }
    static addRowTableInforme(columns: Column[],sheet: Worksheet,data:any[]):Row{
        let rowData0 = [];  
        for(let a=0;a<2;a++){
            rowData0.push(columns[a].columns[0].label);
            if(a==0){rowData0.push("");}
            let temporal = data[0][columns[a].columns[0].name];
            rowData0.push(temporal==null||temporal==undefined?"":temporal);                       
        }
        let temporal = data[0][columns[2].columns[0].name];
        rowData0.push(temporal==null||temporal==undefined?"":temporal);        
        return sheet.addRow(rowData0);
    }
    static addRowTableInformeStyle(data:any[],row0: Row,columns:Column[]):void{
        let indexrow0=1; 
        let maxColNormal=6;
        row0.eachCell((cell, number) => {
                cell.border = this.border;
                let colorTemporal=columns[2].columns[0].styleValue[data[0][columns[2].columns[0].name]];
                cell.fill = {type: 'pattern',
                    pattern: 'solid',
                    fgColor:{
                        argb: ((indexrow0==1||indexrow0==4)&&indexrow0<maxColNormal?'FFd6d8db':'FFfcfdff')//indexrow0<maxColNormal?'FFfcfdff':colorTemporal.replace("#","FF")
                }};
                cell.font = {name: 'Calibri', color: { argb: 'FF343a40' }, size: 9, bold: (indexrow0<maxColNormal?false:true)};
                cell.alignment = { vertical: 'middle', horizontal: (indexrow0<maxColNormal?'left':'center') }; 
            indexrow0++;
        });   
    }

    static addSection(sheet: Worksheet, section: ExcelSectionConfig,tipoReport:string):void{
        let columns = section.columns;
        let data = section.data;
        ExcelSectionUtil.addImage(sheet);
        if (section.title){ExcelSectionUtil.addSectionTitle(sheet, section);}
        let level3 = ExcelSectionUtil.getLevel(columns, 3);
        let level2 = ExcelSectionUtil.getLevel(columns, 2);
        let level1 = ExcelSectionUtil.getLevel(columns, 1);
        switch(section.title)
        {
            case 'INFORMACION GENERAL':   
             
                    let rowtitle0=ExcelSectionUtil.addHeadInforme(columns,sheet);
                    ExcelSectionUtil.addHeadInformeStyle(rowtitle0); 
                    ///////////////////////////////////                    
                    let row0= ExcelSectionUtil.addRowTableInforme(columns,sheet,data);
                    ExcelSectionUtil.addRowTableInformeStyle(data,row0,columns);                    
                    ///////////////////////////////////
                    let rowData1 = [];
                      
                    for(let a=0;a<2;a++){
                        rowData1.push(columns[a].columns[1].label);
                        if(a==0){rowData1.push(""); }
                        let temporal = data[0][columns[a].columns[1].name];
                        rowData1.push(temporal==null||temporal==undefined?"":temporal);      
                     }
                    let row1=sheet.addRow(rowData1);

                    let indexrow1=1; 
                    row1.eachCell((cell, number) => {
                            cell.border = this.border;
                            cell.fill = {type: 'pattern',pattern: 'solid',fgColor:{argb: (indexrow1==1||indexrow1==4?'FFd6d8db':'FFfcfdff')}};
                            cell.font = this.fontRow;
                            cell.alignment = this.alignmentRowleft;                           
                        indexrow1++;
                    });
                    ///////////////////////////////////
                    let rowData2 = [];
                    for(let a=0;a<2;a++){
                        rowData2.push(columns[a].columns[2].label); 
                        if(a==0){rowData2.push("");}
                        let temporal = data[0][columns[a].columns[2].name];
                        rowData2.push(temporal==null||temporal==undefined?"":temporal); 
                    }  

                    let row2=sheet.addRow(rowData2);
                    let indexrow2=1; 
                    row2.eachCell((cell, number) => {
                            cell.border = this.border;
                            cell.fill = {type: 'pattern',pattern: 'solid',fgColor:{argb: (indexrow2==1||indexrow2==4?'FFd6d8db':'FFfcfdff')}};
                            cell.font = this.fontRow;
                            cell.alignment = this.alignmentRowleft;
                        indexrow2++;
                    });
                    ///////////////////////////////////
                    sheet.mergeCells(rowtitle0.number, 1, rowtitle0.number, 3);

                    for(let a=4;a<7;a=a+2){
                        sheet.mergeCells(rowtitle0.number, a, rowtitle0.number, a+1);
                    }

                    for(let a=5;a<8;a=a+1){
                        sheet.mergeCells(a, 1, a, 2);
                    }

                    sheet.mergeCells(5,6,7,7);
            break;
            case 'CONSIDERACIONES':
                if (level3){
                    let temporalColumns=ExcelSectionUtil.addCab2(level3, sheet);
                    sheet.mergeCells(temporalColumns.number, 2, temporalColumns.number, 8);
                }
                if (level2){
                    let temporalColumns=ExcelSectionUtil.addCab2(level2, sheet);
                    sheet.mergeCells(temporalColumns.number, 2, temporalColumns.number, 8);
                }
                let temporalColumns0=ExcelSectionUtil.addCab2(level1, sheet);  
                sheet.mergeCells(temporalColumns0.number, 2, temporalColumns0.number, 8);             
                data.forEach(itemData=>{
                    let rowtemporal=ExcelSectionUtil.addRow2(level1, sheet, itemData);  
                    let iterator=1;   
                    let indexrow5=1; 
                    rowtemporal.eachCell((cell, number) => {
                        if(indexrow5<2)
                        {
                            cell.alignment = { vertical: 'middle', horizontal: 'center' };
                        }                        
                        indexrow5++;
                    });   
                    sheet.mergeCells(rowtemporal.number, 2, rowtemporal.number, 8);            
                 });
            break;
            case 'AVANCE POR CASOS DE PRUEBAS':
                if (level3){ExcelSectionUtil.addCab(level3, sheet);}
                if (level2){ExcelSectionUtil.addCab(level2, sheet);}
                ExcelSectionUtil.addCab(level1, sheet);
                let iteratori=1;
                data.forEach(itemData=>{                    
                    let rowtemporal=ExcelSectionUtil.addRow(level1, sheet, itemData);
                    
                    let iteratorj=1; 

                    rowtemporal.eachCell((cell, number) => {
                        if(iteratorj>1)
                            {cell.alignment = { vertical: 'middle', horizontal: 'center' };}
                        iteratorj++;
                    });
                    sheet.mergeCells(rowtemporal.number, 1, rowtemporal.number, 2);
                    iteratori++;
                });
                
                break;
            case 'AVANCE POR ESCENARIOS':
                if (level3){ExcelSectionUtil.addCab(level3, sheet);}
                if (level2){ExcelSectionUtil.addCab(level2, sheet);}
                ExcelSectionUtil.addCab(level1, sheet);
                let iteratori1=1;
                data.forEach(itemData=>{                    
                    let rowtemporal=ExcelSectionUtil.addRow(level1, sheet, itemData);
                    let iteratorj1=1; 
                    rowtemporal.eachCell((cell, number) => {
                        if(iteratorj1>1)
                        {cell.alignment = { vertical: 'middle', horizontal: 'center' };}
                        if(iteratori1==(data.length))
                        {
                            cell.alignment = { vertical: 'middle', horizontal: 'center' }; 
                            if(iteratorj1>1)
                            {
                            cell.fill = {type: 'pattern',pattern: 'solid',fgColor:{argb: 'FFd6d8db'}};
                            cell.font = {bold: true,name: 'Calibri', color: { argb: 'FF343a40' }, size: 9};
                            } 
                            else{
                                cell.font = {bold: true,name: 'Calibri', color: { argb: 'FFfcfdff' }, size: 9};
                                cell.fill = {type: 'pattern',pattern: 'solid',fgColor:{argb: 'FF0099cc'}}; 
                            }
                        }
                        iteratorj1++;
                    });
                    sheet.mergeCells(rowtemporal.number, 1,rowtemporal.number, 2);
                    iteratori1++;
                });
            break;
            case 'HALLAZGOS':
                if (level3){ExcelSectionUtil.addCab(level3, sheet);}
                if (level2){ExcelSectionUtil.addCab(level2, sheet);}
                ExcelSectionUtil.addCab(level1, sheet);
                let iteratori2=1;
                data.forEach(itemData=>{                    
                    let rowtemporal=ExcelSectionUtil.addRow(level1, sheet, itemData);
                    let iteratorj2=1; 
                    rowtemporal.eachCell((cell, number) => {
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                        iteratorj2++;
                    });
                    sheet.mergeCells(rowtemporal.number, 1, rowtemporal.number, 2);
                    iteratori2++;
                });
            break;
            case 'RESUMEN':
                if (level3)
                {
                    
                    let rowtemporal0=ExcelSectionUtil.addCab(level3, sheet);
                    rowtemporal0.eachCell((cell, number) => {
                        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                        cell.fill = {type: 'pattern',pattern: 'solid',fgColor:{argb: 'FF0099cc'}};
                        cell.font = {bold: true,name: 'Calibri', color: { argb: 'FFfcfdff' }, size: 10};
                        cell.alignment = { vertical: 'middle', horizontal: 'center' }; 
                    });

                }
                if (level2)
                {
                    let rowtemporal0=ExcelSectionUtil.addCab(level2, sheet);
                    rowtemporal0.eachCell((cell, number) => {
                        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                        cell.fill = {type: 'pattern',pattern: 'solid',fgColor:{argb: 'FF0099cc'}};
                        cell.font = {bold: true,name: 'Calibri', color: { argb: 'FFfcfdff' }, size: 10};
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };  
                    });
                }
                let rowtemporalcab0=ExcelSectionUtil.addCab(level1, sheet);
                rowtemporalcab0.eachCell((cell, number) => {
                    cell.font = {bold: true,name: 'Calibri', color: { argb: 'FFfcfdff' }, size: 10};
                });
                let iteratori3=1;
                data.forEach(itemData=>{                    
                    let rowtemporal=ExcelSectionUtil.addRow(level1, sheet, itemData);
                   if(itemData['hallazgoLow']>0)
                    {
                        //{backgroundColor: "#4dbd74", color: "#23282c"}
                        sheet.getRow(5).getCell(6).fill = {type: 'pattern',pattern: 'solid',fgColor:{argb: 'FF4dbd74'}};
                        sheet.getRow(5).getCell(6).font = {bold: true,name: 'Calibri', color: { argb: 'FF23282c' }, size: 9};
                    }
                    if(itemData['hallazgoMedium']>0)
                    {
                        //{backgroundColor: "#d6d8db", color: "#23282c"}
                        sheet.getRow(5).getCell(6).fill = {type: 'pattern',pattern: 'solid',fgColor:{argb: 'FFd6d8db'}};
                        sheet.getRow(5).getCell(6).font = {bold: true,name: 'Calibri', color: { argb: 'FF23282c' }, size: 9};

                    }
                    if(itemData['hallazgoHigh']>0)
                    {
                        //{backgroundColor: "#f8cb00", color: "#23282c"}
                        sheet.getRow(5).getCell(6).fill = {type: 'pattern',pattern: 'solid',fgColor:{argb: 'FFf8cb00'}};   
                        sheet.getRow(5).getCell(6).font = {bold: true,name: 'Calibri', color: { argb: 'FF23282c' }, size: 9};                    

                    }
                    if(itemData['hallazgoCritical']>0)
                    {
                        //{backgroundColor: "#f86c6b", color: "#23282c"}
                        sheet.getRow(5).getCell(6).fill = {type: 'pattern',pattern: 'solid',fgColor:{argb: 'FFf86c6b'}};
                        sheet.getRow(5).getCell(6).font = {bold: true,name: 'Calibri', color: { argb: 'FF23282c' }, size: 9};
                    }

                    let iteratorj3=1; 
                    rowtemporal.eachCell((cell, number) => {
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                        iteratorj3++;
                    });
                    sheet.mergeCells(rowtemporal.number, 1, rowtemporal.number, 2);
                    iteratori3++;
                });
                break;
            
            default:
                if (level3){ExcelSectionUtil.addCab(level3, sheet);}
                if (level2){ExcelSectionUtil.addCab(level2, sheet);}
                ExcelSectionUtil.addCab(level1, sheet);
                data.forEach(itemData=>{ExcelSectionUtil.addRow(level1, sheet, itemData);});                
                //ExcelSectionUtil.addNormalSection(sheet,section);
        }
    }
    /*  */
    static getLevel(columns:Column[], level: number){
        let level1 = [];
        let level2 = [];
        let level3 = [];
        let r1;
        let r2;
        let r3;
        columns.forEach(col=>{
            level1.push(col);
            let subCols = col.columns;
            if(subCols && subCols.length>0){
                subCols.forEach(subCol=>{
                    level2.push(subCol);
                    let subSubCols = subCol.columns;
                    if(subSubCols && subSubCols.length>0){
                        subSubCols.forEach(subSubCol=>{
                            level3.push(subSubCol);
                        });
                    }
                });
            }
        });
        if (level3.length>0){
            r1 = level3;
            r2 = level2;
            r3 = level1;
        }
        else if (level2.length>0){
            r1 = level2;
            r2 = level1;
        }
        else if (level1.length>0){
            r1 = level1;
        }
        if (level==1) return r1;
        if (level==2) return r2;
        if (level==3) return r3;
        return null;
    }

    static addCab(columns:Column[], sheet: Worksheet): Row{
        let rowData = [];
        let cont=0;
        columns.forEach((col:Column)=>{
            rowData.push(col.label || col.name);
            if(cont==0){rowData.push("");}
            let cantChild = Column.getTotalChild(col)-1;/*restamos la columna */
            for(let i=0;i<cantChild;i++){
                rowData.push("");
            }
            cont++;
        });
        let row = sheet.addRow(rowData);
        let colInicio = 1;
        let cont2=0;
        console.log(columns);
        columns.forEach((col:Column, index:number)=>{
            let cantChild = Column.getTotalChild(col);            
            if(cont2!=0)
            {
                if (cantChild>1){
                    let fila = row.number;
                    sheet.mergeCells(fila, colInicio, fila, colInicio + cantChild -1); 
                }

            }
            if(cont2==0){
                let fila = row.number;
                console.log(fila+' , ' +colInicio+' , '+ fila+' , '+ colInicio + cantChild);
                sheet.mergeCells(fila, colInicio, fila, colInicio +cantChild);
                colInicio++;
            }
            cont2++;
            colInicio = colInicio + cantChild;
        });
        
        ExcelSectionUtil.addStyle(columns, row, true);
        
        return row;
    }
    static addCab2(columns:Column[], sheet: Worksheet): Row{
        let rowData = [];
        let cont=0;
        columns.forEach((col:Column)=>{
            rowData.push(col.label || col.name);
            let cantChild = Column.getTotalChild(col)-1;/*restamos la columna */
            for(let i=0;i<cantChild;i++){
                rowData.push("");
            }
            cont++;
        });
        let row = sheet.addRow(rowData);
        let colInicio = 1;
        let cont2=0;
        columns.forEach((col:Column, index:number)=>{
            let cantChild = Column.getTotalChild(col);

                if (cantChild>1){
                    let fila = row.number;
                    sheet.mergeCells(fila, colInicio, fila, colInicio + cantChild -1); 
                }
            
            cont2++;
            colInicio = colInicio + cantChild;
            });
        
        ExcelSectionUtil.addStyle(columns, row, true);
        
        return row;
    }

    static addRow(columns:Column[], sheet: Worksheet, itemData:any): Row{
        let rowData = [];
        //console.log(itemData);
        let cont=0;
        columns.forEach(col=>{
            rowData.push(itemData[col.name]==null||itemData[col.name]==undefined?'':itemData[col.name]);
            if(cont==0)
            {
                rowData.push("");
            }
            
            cont++;
            //console.log(itemData);
        });
        let row = sheet.addRow(rowData);
        ExcelSectionUtil.addStyle(columns, row);
        return row;
    }

    static addRow2(columns:Column[], sheet: Worksheet, itemData:any): Row{
        let rowData = [];
        //console.log(itemData);
        let cont=0;
        columns.forEach(col=>{
            rowData.push(itemData[col.name]==null||itemData[col.name]==undefined?'':itemData[col.name]);
            cont++;
            //console.log(itemData);
        });
        let row = sheet.addRow(rowData);
        ExcelSectionUtil.addStyle(columns, row);
        return row;
    }

    static addStyle(columns:Column[], row: Row, isCab: boolean=false){
        let index = 0;
        let cont = 1;
        row.eachCell((cell, number) => {
            if (columns.length > index)
            {
                let style = isCab ? columns[index].headerStyle: columns[index].style;
                let colorc:any;
                let borderc:any;
                if (isCab)
                { 

                        cell.font = {size: 10, bold: true};
                        cell.font.color = colorc;
                        if(borderc)
                        {
                            cell.border = borderc;
                        }else
                        {
                            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            cell.fill = {type: 'pattern',pattern: 'solid',fgColor:{argb: 'FF0099cc'}};
                            cell.font = {bold: true,name: 'Calibri', color: { argb: 'FFfcfdff' }, size: 10};
                            cell.alignment = { vertical: 'middle', horizontal: 'center' };  
                        }
                        
                    
                }
                else
                {
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                }
                if (style)
                { //header or rows style
                    if (style.backgroundColor)
                    {
                        //debugger;
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor:{argb: 'FF' + style.backgroundColor.replace("#","")}
                        };
                    }
                    if (style.color)
                    {
                        cell.font = {
                            color: { argb: 'FF' + style.color.replace("#","") }
                        };
                        colorc = cell.font.color;
                    }
                    if(style.border)
                    {
                        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                        borderc = cell.border;
                    }
                }

            }
            if(cont!=2)
            {index++;}
            cont++;
        });       
        
    }



}

export class ExcelReportUtil{
    static export(config: ExcelConfig){
        //console.log(config);
        let tipoReport=config.preName=="Informe_"?"Informe":"Reporte";
        if (config && config.sheets && config.sheets.length>0){
            let workbook = new Workbook();
            config.sheets.forEach(sheet => {
                ExcelReportUtil.addSheet(workbook, sheet,tipoReport);
            });
            workbook.xlsx.writeBuffer().then((data) => {
                let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                fs.saveAs(blob, config.preName + '_' + DateUtil.NowToYYYYMMDDHHmmss() + '.xlsx');
            });
        }
    }
    
    static addSheet(workBook: Workbook,config: ExcelSheetConfig,tipoReport: string){
        if (config && config.sections && config.sections.length>0){
            let worksheet = workBook.addWorksheet(config.tabTitle,{views: [{showGridLines: false}]});
            ExcelReportUtil.addColDef(worksheet, config);

            if (config.title)
                ExcelReportUtil.addTitle(worksheet, config);
                //worksheet.mergeCells(1,1,1,10);
            let index = 0;

            worksheet.addRow([""]); //alex06012020
            worksheet.addRow([""]); //alex06012020

            config.sections.forEach(section => {
                if (section.data && section.data.length>0){
                    if (index>0){
                        worksheet.addRow([""]);
                    }
                    ExcelSectionUtil.addSection(worksheet, section,tipoReport);
                    index++;
                }
            });
        }
    }


    static addColDef(sheet: Worksheet, config: ExcelSheetConfig){
        let arrayColDef = [];
        if (config.sections.length==1){
            let cont=0;
            config.sections[0].columns.forEach(col => {
                let temporal={};
                if (col.width){
                    temporal={width: col.width};
                }
                else{
                    temporal={};
                }
                if(cont==0)
                {
                    temporal={width: 5};
                }
                arrayColDef.push(temporal);
                cont++;
            });
        }
        else{
            for(let i=0;i<50;i++){
                let temporal={width: 30};
                if(i==0)
                {
                    temporal={width: 5};
                }
                arrayColDef.push(temporal);
            }
        }
        sheet.columns = arrayColDef;
    }

    static addTitle(sheet: Worksheet, config: ExcelSheetConfig):void{
        let row = sheet.addRow([config.title, "", ""]);
        row.font = { size: 15, bold: true };
    }

}
