import * as vscode from 'vscode';
import { zScriptCmds/*, zMathFns */} from "../zscriptCommands";
import { ZCommand, ZCommandObject, ZArgType } from '../zCommandUtil';
import { zConvertHTMLtoMarkdown } from "../zCommandUtil";

import * as zparse from '../zParser';


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
        compItem.push(cur);
    }

}

function addVariableByType(parser: zparse.ZFileParser, compItem: vscode.CompletionItem[], parsed: zparse.ZParsedPosition, argType: ZArgType,
    zfunObj?: ZCommandObject, currentArgsIndex?: number)
    {
    let args = parser.getArgsListForZParsed(parsed.parsedObj.scope);
    for (let arg in args){
        let command = args[arg]; 
        let curArg = command.args[arg];
        if (argType === ZArgType.any || curArg.type === argType){
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
    }

    let zvar = parser.getVariableByType(argType, parsed.parsedObj.scope);
    zvar.forEach(v => {
        let cur = new vscode.CompletionItem(v.name, vscode.CompletionItemKind.Variable);
        cur.detail = "(" + ZArgType[v.type] + ") " + v.name;
        if (v.type === ZArgType.routine){
            cur.kind = vscode.CompletionItemKind.Function;
        }
        cur.documentation = new vscode.MarkdownString();
        cur.documentation.appendCodeblock(v.getDeclarationText(), "zscript");
        cur.documentation.appendText(v.getDocumentationText());

        cur.sortText = '0' + v.name;
        compItem.push(cur);
    });
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


export class ZCompletionProver implements vscode.CompletionItemProvider {
    public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, 
                                  context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>
    {
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

        let parser = new zparse.ZFileParser(document);
        parser.parseDocument();
        parser.updateVariable();

        let parsed = parser.getZParsedForPosition(position);

        let out: vscode.CompletionItem[] = [];

        if (parsed){
            if (parsed.parsedObj.type === zparse.ZParsedType.command){
                let command = parsed.parsedObj as zparse.ZParsedCommand;

                if (command.commandName === "RoutineDef"){
                    if (parsed.index >= 3){
                        addSnippetType(out);
                        return out;
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
                    if (argType !== undefined){
                        addVariableByType(parser, out, parsed, ZArgType.any);
                    }
                }
            }
        }
        
        return out;
    }
}