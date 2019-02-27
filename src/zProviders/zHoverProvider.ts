import * as vscode from 'vscode';
import { zScriptCmds, zMathFns } from "../zscriptCommands";
import { zConvertHTMLtoMarkdown, ZArgType } from "../zCommandUtil";
import * as zparse from '../zParser';

export class ZHoverProvider implements vscode.HoverProvider {
    public provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): 
                        vscode.ProviderResult<vscode.Hover> {
        let wordRange = document.getWordRangeAtPosition(position);
        let word = document.getText(wordRange);

        let zscriptObj = undefined;
        let title = "";

        if ( zScriptCmds.hasOwnProperty(word) ) {
            zscriptObj = zScriptCmds;
            title = "Command: ";
        }

        if ( zMathFns.hasOwnProperty(word) ) {
            zscriptObj = zMathFns;
            title = "Math Function: ";
        }

        if (zscriptObj) {
            let nameString = new vscode.MarkdownString();
            nameString.appendCodeblock(title + word, "zscript");
            let content = [
                nameString, 
                zConvertHTMLtoMarkdown(zscriptObj[word].description)
            ];
            if (zscriptObj[word].example) {
                content.push(zConvertHTMLtoMarkdown(zscriptObj[word].example));
            }

            return {
                contents: content
            };
        }

        if (word.startsWith('#')){
            word = word.slice(1);
        }

        let parse = new zparse.ZFileParser(document);
        parse.parseDocument();
        parse.updateVariable();

        let parsed = parse.getZParsedForPosition(position);
        if (parsed){
            let scope = parsed.parsedObj.scope;
            let command = parse.getArgsByName(word, scope);
            if (command){
                let arg = command.args[word];
                return {
                    contents: ["(arg) " + word + ": " + ZArgType[arg.type]]
                };
            }

            let zvar = parse.getVariableByName(word, scope);
            if (zvar){
                let declartionstring = new vscode.MarkdownString();
                declartionstring.appendCodeblock(zvar.getDeclarationText(), "zscript");

                return {
                    contents: [declartionstring,
                               zvar.getDocumentationText(),
                               "type: " + ZArgType[zvar.type]]
                };
            }
        }
        return null;
    }
}