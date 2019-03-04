import * as vscode from 'vscode';
import { zScriptCmds, zMathFns } from "../zscriptCommands";
import { ZCommand, ZCommandObject, ZArgType, ZType, zConvertHTMLtoMarkdown } from "../zCommandUtil";
import * as zparse from '../zFileParser';
import { ZParser } from '../zParser';
import * as path from 'path';
import { readdirSync, statSync } from 'fs';

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

/* Add autto ", " for automplete of variable ???
 */
// function doNeedToInsertComma(zcommand: ZCommand, command: zparse.ZParsedCommand){
//     let zscriptConfig = vscode.workspace.getConfiguration('zscript');
//     let inserComma = zscriptConfig.get<Boolean>("autoComplete.insertComma");
// }


function addZFunctionToCompletionItem(compItem: vscode.CompletionItem[], zfunObj: ZCommandObject, currentArgsIndex: number, 
    inserComma:Boolean=false, specificCommand: {} | null = null, returnType:ZArgType = ZArgType.any){

    if (specificCommand === null){
        specificCommand = zfunObj;
    }

    for ( var property in specificCommand ) {
        let currentCommand: ZCommand = zfunObj[property];
        if (returnType !== ZArgType.any && returnType !== ZArgType.commandGroup){
            if (currentCommand.return !== ZArgType.any && returnType !== currentCommand.return){
                continue;
            }
        }

        let cur = new vscode.CompletionItem(property, vscode.CompletionItemKind.Method);
        cur.documentation = new vscode.MarkdownString(zConvertHTMLtoMarkdown(currentCommand.description));
        let argLength = currentCommand.args.length; 
        if (argLength > 0){
            if (inserComma && currentArgsIndex < argLength) {
                cur.insertText = property + ', ';
                cur.command = cmdToExecAfter;
            }else{
                cur.commitCharacters = [',', '\s'];
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
    addZFunctionToCompletionItem(out, zScriptCmds, 0, insertComma, null, type);
    return out;
}

async function addVariableTypeForVarSet(parser: zparse.ZFileParser, parsed: zparse.ZParsedPosition, command: zparse.ZParsedCommand): Promise<vscode.CompletionItem[]> {
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

                if (type === ZArgType.numberList){
                    type = ZArgType.number;
                }else if (type === ZArgType.stringList){
                    type = ZArgType.string;
                }
            }
        }

        return addVariableByType(out, parser, parsed, type);
}

async function getRelativePath(startPath: string, curFilePath: string, cmdFile: CmdWithFilename): Promise<vscode.CompletionItem[]> {
    let out: vscode.CompletionItem[] = [];

    let dirName = path.dirname(curFilePath);
    
    dirName = path.resolve(dirName, startPath);

    let backDir = new vscode.CompletionItem("../", vscode.CompletionItemKind.Folder);
    out.push(backDir);

    let paths = readdirSync(dirName);
    for (let filename of paths) {
        var fpath = path.join(dirName, filename);

        let stat = statSync(fpath);
        if (stat.isDirectory()){
            let comp = new vscode.CompletionItem(filename + '/', vscode.CompletionItemKind.Folder);
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

export class ZCompletionProver implements vscode.CompletionItemProvider {

    parser: ZParser;

    constructor (parser: ZParser){
        this.parser = parser;
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

        return new Promise((resolve, reject) => {
            this.parser.getZFileParser(document).then(parser => {
                let out: vscode.CompletionItem[] = [];
                let parsed = parser.getZParsedForPosition(position);

                if (parsed){
                    if (parsed.parsedObj.type === zparse.ZParsedType.string){
                        let parentParsed = parsed.parsedObj.scope.parent;
                        if (parentParsed && parentParsed.owner){
                            // this is a command inside scope.
                            let parentCmd = parentParsed.owner; 
                            let cmdFile = cmdArgFilename[parentCmd.commandName];
                            if (cmdFile){
                                let index = parentCmd.insideScope.scopes.indexOf(parsed.parsedObj.scope);
                                if (index === cmdFile.id){
                                    let stringVal = (<zparse.ZParsedString>parsed.parsedObj).getStringValue();
                                    resolve(getRelativePath(stringVal, parser.document.fileName, cmdFile));
                                }
                            }
                        }
                        resolve(null);

                    }
                    if (parsed.parsedObj.type === zparse.ZParsedType.command || parsed.parsedObj.type === zparse.ZParsedType.htagGet){
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
                                        resolve(addVariableTypeForVarSet(parser, parsed, parentParsed.owner));
                                    }else{
                                        if (index === 2 && parsed.index === 0){
                                            resolve(addFunctionTypeForVarSet(parser, parsed, parentParsed.owner, inserComma));
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

                        if (parsed.index >= 3){
                            if (command.commandName === "RoutineDef"){
                                    addSnippetType(out);
                                    resolve(out);
                                }
                            
                        }

                        if (parsed.index >= 2){
                            if (command.commandName === "RoutineCall"){
                                let routineName = command.getVariableName();
                                resolve(addVariableForRoutineCall(parser, routineName, parsed));
                            }
                        }

                        // first argument of the command
                        // usually the command name list all command
                        if (parsed.index <= 0){
                            if (command.insideScope.scopes.length > 1){
                                inserComma = false;
                            }
                            if (command.isZscriptInsert){
                                addZFunctionToCompletionItem(out, zScriptCmds, parsed.index, inserComma, {'zscriptinsert': 0});
                            }else{
                                addZFunctionToCompletionItem(out, zScriptCmds, parsed.index, inserComma, null, returnType);
                            }
                        }else{
                            if (parsed.index === 2 && (command.commandName === 'VarSet' || command.commandName === 'VarDef')){
                                resolve(addVariableTypeForVarSet(parser, parsed, command));
                            }

                            let argType = command.getCommandArgsType(parsed.index);
                            if (argType === undefined){
                                argType = ZArgType.any;
                            }
                            if (argType === ZArgType.any || argType === ZArgType.number){
                                addMathFn(out);
                            }

                            resolve(addVariableByType(out, parser, parsed, argType));
                        }
                    }
                    
                    if (parsed.parsedObj.type === zparse.ZParsedType.mathFn){
                        resolve(addVariableByType(out, parser, parsed, ZArgType.number));
                    }
                }
                resolve(out);
            }).catch(reason => {
                console.log(reason);
                reject(reason);
            });
        });
    }
}