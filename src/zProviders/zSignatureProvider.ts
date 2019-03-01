import * as vscode from 'vscode';
import * as zparse from '../zParser';
import { zScriptCmds, zMathFns } from "../zscriptCommands";
import { zConvertHTMLtoMarkdown, ZCommandObject, ZArgType } from '../zCommandUtil';


function getSignature(zobject: ZCommandObject, commandName: string, currentIndex: number ): vscode.SignatureHelp | null {
    if ( zobject.hasOwnProperty(commandName)){
        let out = new vscode.SignatureHelp();
        let cmd = zobject[commandName];
        
        let argsText = "";
        let firstReplace = cmd.syntax.search("%s");
        let secondReplace = cmd.syntax.indexOf("%s", firstReplace+2);
        let cl = firstReplace + commandName.length + (secondReplace - firstReplace - 2);
        let params: vscode.ParameterInformation[] = [];
        cmd.args.forEach((arg, index) => {
            if (index !== 0){
                argsText  += ', ';
            } 
            let startIndex = cl + argsText.length ;
            argsText += arg.name;
            params.push(new vscode.ParameterInformation([startIndex, cl + argsText.length], arg.description));
        });

        let textInfo = cmd.syntax.replace("%s", commandName);
        if (params){
            textInfo = textInfo.replace("%s", argsText);
        }

        let lSignatureHelp = new vscode.SignatureInformation(textInfo, new vscode.MarkdownString(zConvertHTMLtoMarkdown(cmd.description)));
        lSignatureHelp.parameters = params;

        out.activeSignature = 0;
        out.activeParameter = currentIndex;
        out.signatures.push(lSignatureHelp);

        return out;
    }
    return null;
}


function getSignatureForRoutineCall(parser: zparse.ZFileParser, command: zparse.ZParsedCommand, index: number): vscode.SignatureHelp | null{
    let varName = command.getVariableName();
    let zvar = parser.getVariableByName(varName);

    if (zvar){
        let zcommand = zvar.parsedObj.parseDocString();
        if (zcommand){
            let zobject: ZCommandObject = {};
            zobject[varName] = zcommand;
            return getSignature(zobject, varName, index);
        }
    }

    return null;
}

export class ZSignatureProvider implements vscode.SignatureHelpProvider {
    public provideSignatureHelp(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, 
    context: vscode.SignatureHelpContext): vscode.ProviderResult<vscode.SignatureHelp>{
        let parse = new zparse.ZFileParser(document);
        parse.parseDocument();
        parse.updateVariable();

        let zParsed = parse.getZParsedForPosition(position);

        if (zParsed){
            let type = zParsed.parsedObj.type;
            if (type === zparse.ZParsedType.command){
                let command = zParsed.parsedObj as zparse.ZParsedCommand;
                let commandName = command.commandName;

                if (commandName === 'RoutineCall' && zParsed.index >= 2){
                    // Do something special for routine call when index is >= 2 so we know the name of the var
                    return getSignatureForRoutineCall(parse, command, zParsed.index - 2);
                }
                else{
                    return getSignature(zScriptCmds, commandName, zParsed.index - 1);
                }
            }else if (type === zparse.ZParsedType.mathFn){
                let command = zParsed.parsedObj as zparse.ZParsedCommand;
                let commandName = command.commandName;
                return getSignature(zMathFns, commandName, zParsed.index);
            }
        }

        return null;
    }
}