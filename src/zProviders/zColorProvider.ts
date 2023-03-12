import * as vscode from 'vscode';
//mport { zScriptCmds, zMathFns } from "../zscriptCommands";
//import { ZCommand, ZCommandObject, ZArgType, ZType, zConvertHTMLtoMarkdown } from "../zCommandUtil";
import * as zparse from '../zFileParser';
import { ZParser } from '../zParser';

// from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex: string): vscode.Color {
    if (hex.length === 8){
        var result = /0x([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(hex);
        if (result){
            return new vscode.Color(parseInt('0x'+result[1]) / 255.0, parseInt('0x'+result[2]) / 255.0, parseInt('0x'+result[3]) / 255.0, 1);
        }
    }
    return new vscode.Color(0,0,0,1);
}

function componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number): string {
    return "0x" + componentToHex(Math.round(r * 255)) + componentToHex(Math.round(g * 255)) +  componentToHex(Math.round(b * 255));
}


export class ZColorProvider implements vscode.DocumentColorProvider {

    parser: ZParser;

    constructor (parser: ZParser){
        this.parser = parser;
    }

    provideDocumentColors(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.ColorInformation[]>{
        
        return this.parser.getZFileParser(document).then((parsedFile) => {
            let out: vscode.ProviderResult<vscode.ColorInformation[]> = [];
            let number = <zparse.ZParsedNumber[]>parsedFile.getAllZParsedTypes(zparse.ZParsedType.lNumber);
            for (let n of number){
                if (n.isHexaDecimal){
                    let value = n.getText();
                    let color = hexToRgb(value);
                    let colorInfo = new vscode.ColorInformation(n.range.convertToVsCodeRange(document), color);
                    out.push(colorInfo);
                }
            }
            return out;
        }).catch(err => {
            return null;
        });
    }


    provideColorPresentations(color: vscode.Color, context: { document: vscode.TextDocument, range: vscode.Range }, 
    token: vscode.CancellationToken): vscode.ProviderResult<vscode.ColorPresentation[]>{
        let text = rgbToHex(color.red, color.green, color.blue);
        return [new vscode.ColorPresentation(text)];
    }


}
