import * as vscode from 'vscode';
import { zScriptCmds, zMathFns } from "../zscriptCommands";
import { ZCommand, ZCommandObject, ZArgType } from '../zCommandUtil';
import { zConvertHTMLtoMarkdown } from "../zCommandUtil";
import * as zparse from '../zFileParser';
import { ZParser } from '../zParser';
import { basename } from 'path';


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
        if (returnType !== ZArgType.any){
            if (returnType !== currentCommand.return){
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
            cur.detail = '"' + basename(curV.parser.document.fileName) + '"  ' + cur.detail;
        }

        if (curV.type === ZArgType.routine){
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
    for (let arg in ZArgType){
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
    if (routinedef && routinedef.type === ZArgType.routine){
        let routineCommand = routinedef.parsedObj;
        // -2 because args start at 2 [RoutineCall, routineName, firstArt]
        let curArgs = Object.keys(routineCommand.args)[parsed.index - 2];
        if (curArgs){
            return addVariableByType(out, parser, parsed, routineCommand.args[curArgs].type);
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
                    if (parsed.parsedObj.type === zparse.ZParsedType.command){
                        let command = parsed.parsedObj as zparse.ZParsedCommand;
                        
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
                                addZFunctionToCompletionItem(out, zScriptCmds, parsed.index, inserComma);
                            }
                        }else{
                            // check for what the command want has an argument
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