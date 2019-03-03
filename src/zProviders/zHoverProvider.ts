import * as vscode from 'vscode';
import { zScriptCmds, zMathFns } from "../zscriptCommands";
import { zConvertHTMLtoMarkdown, ZArgType } from "../zCommandUtil";
import { ZParser } from '../zParser';
import { ZFileParser, ZScope, ZParsedType } from '../zFileParser';


async function getVariableByName(parse: ZFileParser, name: string, scope: ZScope): Promise<vscode.Hover | null> {
    let zvar = await parse.getVariableByName(name, scope);
    if (zvar){
        let declartionstring = new vscode.MarkdownString();
        declartionstring.appendCodeblock(zvar.getDeclarationText(), "zscript");

        return {
            contents: [declartionstring,
                       zvar.getDocumentationText(),
                       "type: " + ZArgType[zvar.type]]
        };
    }
    return null;
}


export class ZHoverProvider implements vscode.HoverProvider {
    
    parser: ZParser;

    constructor (parser: ZParser){
        this.parser = parser;
    }

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

        return new Promise((resolve, reject)=>{
            this.parser.getZFileParser(document).then(parse => {
                let parsed = parse.getZParsedForPosition(position);
                if (parsed){
                    if (parsed.parsedObj.type === ZParsedType.lText){
                        let scope = parsed.parsedObj.scope;
                        let command = parse.getArgsByName(word, scope);
                        if (command){
                            let arg = command.args[word];
                            resolve({
                                contents: ["(arg) " + word + ": " + ZArgType[arg.type]]
                            });
                        }
                        resolve(getVariableByName(parse, word, scope));
                    }
                }
                resolve(null);
            }).catch(reason => {
                console.log(reason);
                reject(reason);
            });
        });
    }
}