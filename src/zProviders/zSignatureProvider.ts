import * as vscode from 'vscode';
import * as zparse from '../zFileParser';
import { zScriptCmds, zMathFns } from "../zscriptCommands";
import { zConvertHTMLtoMarkdown, ZCommandObject } from '../zCommandUtil';
import { ZParser } from '../zParser';


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


async function getSignatureForRoutineCall(parser: zparse.ZFileParser, command: zparse.ZParsedCommand, index: number): Promise<vscode.SignatureHelp | null> {
    let varName = command.getVariableName();
    let zvar = await parser.getVariableByName(varName);

    if (zvar){
        let zcommand = zvar.parsedObj.parseDocString();
        if (!zcommand){
            zcommand = zvar.parsedObj.getZCommand();
        }

        if (zcommand){
            let zobject: ZCommandObject = {};
            let routName = 'RoutineCall, ' + varName;
            zobject[routName] = zcommand;
            return getSignature(zobject, routName, index);
        }
    }

    return null;
}

export class ZSignatureProvider implements vscode.SignatureHelpProvider {

    parser: ZParser;

    constructor (parser: ZParser){
        this.parser = parser;
    }

    public provideSignatureHelp(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, 
    context: vscode.SignatureHelpContext): vscode.ProviderResult<vscode.SignatureHelp>{
        return this.parser.getZFileParser(document).then(parsedFile => {
            let zParsed = parsedFile.getZParsedForPosition(position);

            if (!zParsed) {
                return null;
            }
            let type = zParsed.parsedObj.type;
            if (type === zparse.ZParsedType.command){
                let command = zParsed.parsedObj as zparse.ZParsedCommand;
                let commandName = command.commandName;

                if (commandName === 'RoutineCall' && zParsed.index >= 2){
                    // Do something special for routine call when index is >= 2 so we know the name of the var
                    return getSignatureForRoutineCall(parsedFile, command, zParsed.index - 2);
                }
                else{
                    return getSignature(zScriptCmds, commandName, zParsed.index - 1);
                }
            }else if (type === zparse.ZParsedType.mathFn){
                let command = zParsed.parsedObj as zparse.ZParsedCommand;
                let commandName = command.commandName;
                return getSignature(zMathFns, commandName, zParsed.index);
            }
        }).catch((reason) => {
            return null;
        })
    }
}