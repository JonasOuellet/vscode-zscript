import * as vscode from 'vscode';
import { zScriptCmds/*, zMathFns */} from "../zscriptCommands";
import { ZCommand } from '../zCommandUtil';
import { zConvertHTMLtoMarkdown } from "../zCommandUtil";


export class ZCompletionProver implements vscode.CompletionItemProvider {
    public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, 
                                  context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>
    {
        let cmdToExecAfter = {
            title: 'Signature Provider',
            command: "editor.action.triggerParameterHints"
        };

        let zscriptConfig = vscode.workspace.getConfiguration('zscript');
        let inserComma = zscriptConfig.get<Boolean>("autoComplete.insertComma");


        let out: vscode.CompletionItem[] = [];
        for ( var property in zScriptCmds ) {
            let currentCommand: ZCommand = zScriptCmds[property];
            let cur = new vscode.CompletionItem(property, vscode.CompletionItemKind.Method);
            cur.documentation = zConvertHTMLtoMarkdown(currentCommand.description);
            if (currentCommand.args.length > 0){
                if (inserComma) {
                    cur.insertText = property + ', ';
                    cur.command = cmdToExecAfter;
                }else{
                    cur.commitCharacters = [',', '\s'];
                }
            }
            out.push(cur);
        }
        return out;
    }
}