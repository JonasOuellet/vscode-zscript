import { inspect } from "util";
import * as path from "path";
import { writeFile } from "fs";
//import { MarkdownString } from "vscode";


export const CommandFilePath = path.normalize(path.join(__dirname, '..', 'src', "zscriptCommands.ts"));

export enum ZScriptLevel {
    all,
    subLevel,
    topLevel
}

export enum ZArgType {
    any,
    anyVar, // number var string var, numberListVar stringListVar
    anyList, // numberList or stringList
    commandGroup,
    null, // void 
    number,
    numberVar,
    numberList,
    numbers, // number or number List
    memoryBlock,
    routine,
    string,
    stringVar,
    stringList,
    strokeData,
    varMemoryBlock,
    scriptInsert
}

export interface ZArg {
    name: string;
    description: string;
    type: ZArgType;
}

export interface ZCommand {
    args: ZArg[];
    description: string;
    example: string;
    syntax: string;
    level: ZScriptLevel;
    return: ZArgType;
}

export interface ZCommandObject {
    [key: string]: ZCommand;
}

export function zWriteCommandToFile(zscriptCommand: ZCommandObject, mathFunction: ZCommandObject, filePath?: undefined | string){
    let outPath = CommandFilePath;
    if (filePath) {
        outPath = filePath;
    }
    let relPath = "./" + path.relative(__dirname, __filename);

    let fileContent = "import { ZCommandObject } from \"" + relPath + "\";\n\n\n";
    fileContent += "export let zScriptCmds: ZCommandObject = " + inspect(zscriptCommand, undefined, 5);
    fileContent += ";\n\n\nexport let zMathFns: ZCommandObject = " + inspect(mathFunction, undefined, 5);
    fileContent += ';';

    // write to file
    writeFile(outPath, fileContent, (err) => {
        if (err){
            console.log(err);
        }else{
            console.log("Command file successfully writed here: \"" + outPath + "\"");
        }        
    });
}

export function zConvertHTMLtoMarkdown(input: string) : string {
    let out = input.replace(/(<b>|<\/b>)/g, "**");
    out = out.replace(/(<i>|<\/i>|<em>|<\/em>)/g, '*');
    out = out.replace(/<code>/g, "```zscript\n");
    out = out.replace(/<\/code>/g, "\n```");

    //let markdown = new MarkdownString(out);
    // markdown.appendCodeblock("[If, MyVariable < 10, [MessageOk, LessThanl0], [MessageOk, l0orMore]]", "zscript");
    // console.log(markdown);
    return out;
}