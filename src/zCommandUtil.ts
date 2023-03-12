import { inspect } from "util";
import * as path from "path";
import { writeFile } from "fs";
//import { MarkdownString } from "vscode";


export const CommandFilePath = path.normalize(path.join(__dirname, '..', 'src', "zscriptCommandsV2.ts"));

export enum ZScriptLevel {
    all,
    subLevel,
    topLevel
}

/*
 Type of variable available for zscript
*/
export enum ZType {
    any = 0,
    number = 5,
    numberList = 7,
    memoryBlock = 9,
    routine = 10,
    string = 11,
    stringList = 13,
    strokeData = 14,
    varMemoryBlock = 15
}

/*
 Possible type for comment argument
*/
export enum ZArgType {
    any,
    anyVar, // number var string var, numberListVar stringListVar also stroke data
    anyList, // numberList or stringList
    commandGroup,
    null, // void 
    number,
    numberVar, // if arg type is number var, it can't be a literal number.
    numberList,
    numbers, // number or number List
    memoryBlock,
    routine,
    string,
    stringVar,
    stringList,
    strokeData,
    varMemoryBlock,
    scriptInsert,
    varName,
}

/**
 * Return weither or not a variable type (ZType) is valid for a given command argument type.
 * @param type type of the variable to check if its type is valid
 * @param targetType comment argument type.
 */
export function isValidVariableType(type: ZType, targetType: ZArgType): boolean {
    if (targetType === ZArgType.any || type === ZType.any){
        return true;
    }

    if (targetType === ZArgType.anyVar){
        return type === ZType.number || type === ZType.numberList || type === ZType.string || type === ZType.stringList || type === ZType.strokeData;
    }

    if (type === ZType.number){
        return (<number>targetType === <number>type || targetType === ZArgType.numberVar);
    }

    if (<number>type === ZType.string){
        return (targetType === <number>type || targetType === ZArgType.stringVar);
    }
    
    return <number>type === <number>targetType;
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

    return out;
}

export function zConvertHTMLtoPlain(input: string): string {
    let out = input.replace(/(<b>|<\/b>)/g, "");
    out = out.replace(/(<i>|<\/i>|<em>|<\/em>)/g, "");
    out = out.replace(/<code>/g, "");
    out = out.replace(/<\/code>/g, "");

    return out;
}

export function getCommandDeclaration(name: string, command: ZCommand): string {
    let out = command.syntax.replace("%s", name);

    if (command.args.length){
        let args = "";

        let start = true;
        for (let arg of command.args){
            if (start){
                start = false;
            }else{
                args += ', ';
            }
            args += arg.name;
        }

        out = out.replace("%s", args);
    }
    
    return out;
}


export function getCommandDocString(command: ZCommand): string {
    let out = command.description;
    
    command.args.forEach(arg => {
        out += "\n@param " + arg.name + ": (" + ZArgType[arg.type] + ") - " + arg.description;
    });

    if (command.return !== ZArgType.null){
        out += "\nreturn ("+ ZArgType[command.return] + ')';
    }

    if (command.example){
        out += "\n\n" + command.example;
    }

    return out;
}

export function getZCommandFromDocString(docString: string): ZCommand {
    let cleanDocString = docString.replace(/(\/\*\*|\*\/|\*\s*|\n)/g, "");

    let args: ZArg[] = [];
    let description = "";

    let reg = /@param (\w+):.\((\w+)\).-.(.*)/g;
    let regexResult = reg.exec(cleanDocString);
    if (!regexResult){
        description = cleanDocString;    
    }else{
        description = cleanDocString.slice(0, regexResult.index);
        
        while(regexResult){
            let argType: ZArgType = (<any>ZArgType)[regexResult[2]];
            if (argType === undefined){
                argType = ZArgType.any;
            }
            args.push({
                description: regexResult[3],
                type: argType,
                name: regexResult[1]
            });
            regexResult = reg.exec(cleanDocString);
        }
    }

    let syntax = '[%s]';
    if (args.length){
        syntax = '[%s, %s]';
    }

    return {
        args: args,
        description: description,
        example: "",
        level: ZScriptLevel.all,
        return: ZArgType.null,
        syntax: syntax
    };
}
