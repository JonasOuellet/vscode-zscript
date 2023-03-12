import * as vscode from 'vscode';
import * as path from 'path';
import { readdirSync, statSync, existsSync } from 'fs';

import { zScriptCmds, zMathFns } from "../zscriptCommands";
import { ZCommand, ZArgType, ZType, zConvertHTMLtoMarkdown } from "../zCommandUtil";
import * as zparse from '../zFileParser';
import { ZParser } from '../zParser';
import { zWindowIDs } from "../zWindowIDs";


interface CmdWithFilename {
    id: number;
    ext: string[];
}

interface CmdWithFilenameList {
    [keys: string]: CmdWithFilename;
}

/* to be able to autocomplete relative path */
let cmdArgFilename: CmdWithFilenameList = {
    zscriptinsert: {
        id: 1,
        ext: ['.txt']
    },
    MemCreateFromFile: {
        id: 2,
        ext: []
    },
    StrokeLoad: {
        id: 1,
        ext: ['.txt']
    },
    StrokeLoads: {
        id: 1,
        ext: ['.txt']
    },
    Image: {
        id: 1,
        ext: ['.psd', '.bmp']
    },
    VarLoad: {
        id: 2,
        ext: ['.zvr']
    },
    VarSave: {
        id: 2,
        ext: ['.zvr']
    },
    FileExecute: {
        id: 1,
        ext: ['.dll']
    },
    FileExists: {
        id: 1,
        ext: []
    },
    FileGetInfo: {
        id: 1,
        ext: []
    },
    FileNameAdvance: {
        id: 1,
        ext: []
    },
    FileNameMake: {
        id: 1,
        ext: []
    },
    FileNameResolvePath: {
        id: 1,
        ext: []
    },
    FileNameSetNext: {
        id: 1,
        ext: []
    }
};

let cmdToExecAfter = {
    title: 'Signature Provider',
    command: "editor.action.triggerParameterHints"
};


function addZFunctionToCompletionItem(compItem: vscode.CompletionItem[], startChar='[', currentArgsIndex: number, 
    inserComma:Boolean=false, specificCommand: {} | null = null, returnType:ZArgType = ZArgType.any, position: vscode.Position|null=null){

    if (specificCommand === null){
        specificCommand = zScriptCmds;
    }

    for ( var property in specificCommand ) {
        let currentCommand: ZCommand = zScriptCmds[property];
        if (currentCommand.syntax[0] !== startChar){
            continue;
        }

        if (returnType !== ZArgType.any && returnType !== ZArgType.commandGroup){
            if (currentCommand.return !== ZArgType.any && returnType !== currentCommand.return){
                continue;
            }
        }

        let cur = new vscode.CompletionItem(property, vscode.CompletionItemKind.Method);
        cur.documentation = new vscode.MarkdownString(zConvertHTMLtoMarkdown(currentCommand.description));
        if (inserComma){
            if (currentArgsIndex < currentCommand.args.length) {
                cur.insertText = property + ', ';
                cur.command = cmdToExecAfter;
            }
        }else{
            if (currentArgsIndex < currentCommand.args.length) {
                cur.commitCharacters = [','];
            }
        }

        cur.detail = "(Command)";
        compItem.push(cur);
    }
}

function addMathFn(compItem: vscode.CompletionItem[]){
    for ( var property in zMathFns ) {
        let currentCommand: ZCommand = zMathFns[property];

        let cur = new vscode.CompletionItem(property, vscode.CompletionItemKind.Method);
        cur.documentation = new vscode.MarkdownString(zConvertHTMLtoMarkdown(currentCommand.description));
        cur.insertText = new vscode.SnippetString(property + '(${1:})');
        cur.command = cmdToExecAfter;
        cur.detail = "(Math Function)";
        cur.sortText = '1' + property;

        compItem.push(cur);
    }
}

async function addVariableByType(compItem: vscode.CompletionItem[], parser: zparse.ZFileParser, parsed: zparse.ZParsedPosition,
    argType: ZArgType): Promise<vscode.CompletionItem[]>{
    
    let args = parser.getArgsListForZParsed(parsed.parsedObj.scope, argType);
    for (let arg in args){
        let command = args[arg]; 
        let curArg = command.args[arg];
        let cur = new vscode.CompletionItem(arg, vscode.CompletionItemKind.Property);
        cur.documentation = "(parameter) " + arg + ": " + ZArgType[curArg.type];
        cur.detail = cur.documentation;
        if (command.commandName === "RoutineDef"){
            cur.documentation += " of Routine \"" + command.getVariableName() + "\"";
        }
        // make sur that this item is at the top i.e before other auto complete
        cur.sortText = '0' + arg;
        compItem.push(cur);
    }

    let zvar = await parser.getVariableByType(argType, parsed.parsedObj.scope);
    for (let v in zvar){
        let curV = zvar[v];
        let cur = new vscode.CompletionItem(v, vscode.CompletionItemKind.Variable);
        cur.detail = "(" + ZArgType[curV.type] + ") " + v;
        
        // if the variable parser is not the same as the current parser the var is in another document
        if (curV.parser !== parser){
            cur.detail = '"' + path.basename(curV.parser.document.fileName) + '"  ' + cur.detail;
        }

        if (curV.type === ZType.routine){
            cur.kind = vscode.CompletionItemKind.Function;
        }
        cur.documentation = new vscode.MarkdownString();
        cur.documentation.appendCodeblock(curV.getDeclarationText(), "zscript");
        cur.documentation.appendText(curV.getDocumentationText());

        cur.sortText = '0' + v;
        compItem.push(cur);
    }
    
    return compItem;
}

function autoCompleteComment(document: vscode.TextDocument, position: vscode.Position) : vscode.CompletionList{
    let out = new vscode.CompletionList([], true);
    
    let offset = document.offsetAt(position);

    // need to start the parsing after the position
    // parse the document and return when the first element after the position has been parsed
    let parser = new zparse.ZFileParser(document);
    parser.parseDocument(offset, (p: zparse.ZFileParser)=>{
        return p.scope.flow.length >= 1;
    });
    if (parser.scope.flow.length >= 1){
        let parsed = parser.scope.flow[0];
        if (parsed.type === zparse.ZParsedType.command){
            let command = parsed as zparse.ZParsedCommand;
            if (command.commandName === "RoutineDef"){
                let cur = new vscode.CompletionItem("/** */", vscode.CompletionItemKind.Snippet);
                
                cur.detail = "Documentation for \"" + command.getVariableName() + "\"";
                
                let snippet = "\n* ";
                snippet += command.getDocString().replace(/\n/g, "\n* ");
                snippet += "\n*/";
                
                cur.insertText = new vscode.SnippetString(snippet);
                
                out.items.push(cur);
            }
        }
    }

    return out;
}

function addSnippetType(compItem: vscode.CompletionItem[]){
    for (let arg in ZType){
        if (isNaN(Number(arg))){
            let txt = "/*" + arg + "*/";
            let cur = new vscode.CompletionItem(txt, vscode.CompletionItemKind.Snippet);
            cur.detail = txt;
            
            cur.sortText = '0' + arg;
            compItem.push(cur);
        }
    }
}

async function addVariableForRoutineCall(parser: zparse.ZFileParser, routineName: string, parsed: zparse.ZParsedPosition): Promise<vscode.CompletionItem[]>{
    let out: vscode.CompletionItem[] = [];

    let routinedef = await parser.getVariableByName(routineName);
    if (routinedef && routinedef.type === ZType.routine){
        let routineCommand = routinedef.parsedObj;
        // -2 because args start at 2 [RoutineCall, routineName, firstArt]
        let curArgs = Object.keys(routineCommand.args)[parsed.index - 2];
        if (curArgs){
            return addVariableByType(out, parser, parsed, <number>routineCommand.args[curArgs].type);
        }
    }
    return out;
}


async function addFunctionTypeForVarSet(parser: zparse.ZFileParser, parsed: zparse.ZParsedPosition, command: zparse.ZParsedCommand,
    insertComma: Boolean=false): Promise<vscode.CompletionItem[]>{
    let out: vscode.CompletionItem[] = [];
    
    let type = ZArgType.any;

    let varName = command.getVariableName();

    let arg = await parser.getArgsByName(varName, parsed.parsedObj.scope);
    if (arg){
        type = <number>arg.args[varName].type;

    }else{
        // check for variable type
        let zvar = await parser.getVariableByName(varName, parsed.parsedObj.scope);
        if (zvar){
            type = <number>zvar.type;
        }
    }
    addZFunctionToCompletionItem(out, '[', 0, insertComma, null, type);
    return out;
}

async function addVariableTypeForVarSet(parser: zparse.ZFileParser, parsed: zparse.ZParsedPosition, command: zparse.ZParsedCommand): Promise<vscode.CompletionItem[]> {
        let out: vscode.CompletionItem[] = [];
        
        let type = ZArgType.any;
    
        let varName = command.getVariableName();
    
        let arg = parser.getArgsByName(varName, parsed.parsedObj.scope);
        if (arg){
            type = <number>arg.args[varName].type;
    
        }else{
            // check for variable type
            let zvar = await parser.getVariableByName(varName, parsed.parsedObj.scope);
            if (zvar){
                type = <number>zvar.type;

                if (type === ZArgType.numberList){
                    type = ZArgType.number;
                }else if (type === ZArgType.stringList){
                    type = ZArgType.string;
                }
            }
        }

        addVariableByType(out, parser, parsed, type);

        if (type === ZArgType.any || type === ZArgType.number){
            addMathFn(out);
        }
        return out;
}

function getRelativePath(startPath: string, curFilePath: string, cmdFile: CmdWithFilename): vscode.CompletionItem[] {
    let out: vscode.CompletionItem[] = [];

    console.log("test");

    let folderpart = "";
    let fileparth = "";
    if (startPath.endsWith('\\') || startPath.endsWith('/')) {
        folderpart = startPath;
    } else {
        let splitted = startPath.replace('\\', '/').split('/');
        folderpart = splitted.slice(0, -1).join(path.sep);
        fileparth = splitted[splitted.length - 1]
    }

    let currentDir = path.resolve(path.dirname(curFilePath), folderpart);
    if (!existsSync(currentDir)) {
        return [];
    }

    let paths = readdirSync(currentDir);
    for (let filename of paths) {
        if (!filename.startsWith(fileparth)){
            continue;
        }

        var fpath = path.join(currentDir, filename);

        let stat = statSync(fpath);
        if (stat.isDirectory()){
            let comp = new vscode.CompletionItem(filename + path.sep, vscode.CompletionItemKind.Folder);
            comp.command = {
                title: 'Folder autocomplete',
                command: "editor.action.triggerSuggest"
            };
            out.push(comp);
        }
        else{
            if (fpath !== curFilePath){
                let add = true;

                if (cmdFile.ext.length > 0){
                    let ext = path.extname(filename);
                    if (cmdFile.ext.indexOf(ext) < 0){
                        add = false;
                    }
                }
                if (add){
                    out.push(new vscode.CompletionItem(filename, vscode.CompletionItemKind.File));
                }
            }
        }
    }
    return out;
}

function getWindowPathID(zparser: zparse.ZFileParser, parsedString: zparse.ZParsedString, position: vscode.Position): vscode.CompletionItem[] {
    let out: vscode.CompletionItem[] = [];

    let strValue = parsedString.getStringValue();
    
    let wasBefore = false;
    let stringRange = parsedString.getStringValueRange(zparser.document);
    if (position.isBefore(stringRange.end)){
        wasBefore = true;
        let start = parsedString.range.start + 1;
        let end = zparser.document.offsetAt(position);
        strValue = strValue.slice(0, end - start);
    }

    let path = strValue.split(':');
    let start = stringRange.start;

    let x = 1;
    let obj = zWindowIDs;
    for (let p of path){
        let curPathObj = obj[p];
        if (curPathObj === undefined && x === path.length){
            for (let pp in obj){
                if (pp.startsWith(p)) {
                    let comp = new vscode.CompletionItem(pp);
                    
                    if (obj[pp] === null){
                        // this is the root path
                        comp.kind = vscode.CompletionItemKind.File;
                    } else {
                        comp.kind = vscode.CompletionItemKind.Folder;
                        comp.insertText = pp + ':';
                        comp.command = {
                            title: 'Folder autocomplete',
                            command: "editor.action.triggerSuggest"
                        };
                    }
                    
                    if (wasBefore){
                        comp.range = new vscode.Range(start, stringRange.end);
                    }

                    out.push(comp);
                }
            }

        } else if (curPathObj === null){
            return [];
        }
        if (curPathObj){
            obj = curPathObj;
        }
        x += 1;
        start = new vscode.Position(start.line, start.character + 1 + p.length);
    }


    return out;
}

export class ZCompletionProver implements vscode.CompletionItemProvider {

    parser: ZParser;

    constructor (parser: ZParser){
        this.parser = parser;
    }

    private provideString(
        parsed: zparse.ZParsedPosition,
        parser: zparse.ZFileParser,
        position: vscode.Position
    ): vscode.CompletionItem[] | vscode.CompletionList {
        let parentParsed = parsed.parsedObj.scope.parent;
        if (parentParsed && parentParsed.owner){
            // this is a command inside scope.
            let parentCmd = parentParsed.owner; 
            let cmdFile = cmdArgFilename[parentCmd.commandName];
            if (cmdFile){
                let index = parentCmd.insideScope.scopes.indexOf(parsed.parsedObj.scope);
                if (index === cmdFile.id){
                    let stringVal = (<zparse.ZParsedString>parsed.parsedObj).getStringValue();
                    return getRelativePath(stringVal, parser.document.fileName, cmdFile);
                }
            } else {
                return getWindowPathID(parser, <zparse.ZParsedString>parsed.parsedObj, position);
            }
        }
        return [];
    }

    private async provideCommand(
        parsed: zparse.ZParsedPosition,
        parser: zparse.ZFileParser,
        position: vscode.Position,
        insertComma: Boolean
    ): Promise<vscode.CompletionItem[]> {
        let command = parsed.parsedObj as zparse.ZParsedCommand;
                        
        let parentParsed = parsed.parsedObj.scope.parent;
        let returnType = ZArgType.any;
        if (parentParsed && parentParsed.owner){
            // this is a command inside scope.
            let commandName = parentParsed.owner.commandName;
            let comObj = zScriptCmds[commandName];
            if (comObj){
                let index = parentParsed.owner.insideScope.scopes.indexOf(parsed.parsedObj.scope);
                if (commandName === 'VarSet' || commandName === 'VarDef'){
                    // htag var or var command,
                    if (command.commandName === 'Var'){
                        return await addVariableTypeForVarSet(parser, parsed, parentParsed.owner);
                    }else{
                        if (index === 2 && parsed.index === 0){
                            return await addFunctionTypeForVarSet(parser, parsed, parentParsed.owner, insertComma);
                        }
                    }
                }else{
                    index -= 1;
                    if ( index > 0 && index < comObj.args.length){
                        returnType = comObj.args[index].type;
                    }
                }
            } 
        }

        if (parsed.index >= 3 && command.commandName === "RoutineDef") {
            let out: vscode.CompletionItem[] = [];
            addSnippetType(out);
            return out;
        }

        if (parsed.index >= 2 && command.commandName === "RoutineCall"){
            let routineName = command.getVariableName();
            return await addVariableForRoutineCall(parser, routineName, parsed);
        }

        // first argument of the command
        // usually the command name list all command
        let out: vscode.CompletionItem[] = [];
        if (parsed.index <= 0){
            if (command.insideScope.scopes.length > 1){
                insertComma = false;
            }
            if (command.isZscriptInsert){
                addZFunctionToCompletionItem(out, '<', parsed.index, insertComma, {'zscriptinsert': 0}, ZArgType.any, position);
            }else{
                addZFunctionToCompletionItem(out, '[', parsed.index, insertComma, null, returnType);
            }
        }else{
            if (parsed.index === 2 && (command.commandName === 'VarSet' || command.commandName === 'VarDef')){
                return await addVariableTypeForVarSet(parser, parsed, command);
            }

            let argType = command.getCommandArgsType(parsed.index);
            if (argType === undefined){
                argType = ZArgType.any;
            }
            if (argType === ZArgType.any || argType === ZArgType.number){
                addMathFn(out);
            }

            addVariableByType(out, parser, parsed, argType);
        }
        return out;
    }

    private async provide(
        document: vscode.TextDocument,
        position: vscode.Position,
        insertComma: Boolean
    ): Promise<vscode.CompletionItem[] | vscode.CompletionList> {
        let parser = await this.parser.getZFileParser(document);
        let out: vscode.CompletionItem[] = [];
        let parsed = parser.getZParsedForPosition(position);
        if (!parsed) {
            return out;
        }

        if (parsed.parsedObj.type === zparse.ZParsedType.string) {
            return this.provideString(parsed, parser, position);
        }

        if (parsed.parsedObj.type === zparse.ZParsedType.command || parsed.parsedObj.type === zparse.ZParsedType.htagGet) {
            return await this.provideCommand(parsed, parser, position, insertComma);
        }
                    
        if (parsed.parsedObj.type === zparse.ZParsedType.mathFn){
            return addVariableByType(out, parser, parsed, ZArgType.number)
        };

        return out;
    }

    public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, 
                                  context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>
    {
        /*
         This cannot be in the promise with the parsed because since the char is /** the rest of the document will be 
         parsed as a multiline comment.
        */
        if (context.triggerCharacter === "*"){
            // check if its "/**"
            let start = new vscode.Position(position.line, Math.max(position.character - 3, 0));
            let text = document.getText(new vscode.Range(start, position));
            if (text === '/**'){
                // documentation stuff
                return autoCompleteComment(document, position);
            }
            return null;
        }

        let zscriptConfig = vscode.workspace.getConfiguration('zscript');
        let inserComma = zscriptConfig.get<Boolean>("autoComplete.insertComma");
        if (inserComma === undefined) {
            inserComma = false;
        }

        return this.provide(document, position, inserComma);
    }
}