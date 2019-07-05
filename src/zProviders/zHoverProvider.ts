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

        let cmd = undefined;
        let title = "";

        if ( zScriptCmds.hasOwnProperty(word) ) {
            cmd = zScriptCmds[word];
            title = "Command: ";
        }else if( zMathFns.hasOwnProperty(word) ) {
            cmd = zMathFns[word];
            title = "Math Function: ";
        }

        if (cmd) {
            let nameString = new vscode.MarkdownString();
            nameString.appendCodeblock(title + word, "zscript");
            let content = [
                nameString, 
                zConvertHTMLtoMarkdown(cmd.description)
            ];
            if (cmd.example) {
                content.push(zConvertHTMLtoMarkdown(cmd.example));
            }

            if (cmd.args.length) {
                let zscriptConfig = vscode.workspace.getConfiguration('zscript');
                let showArgs = zscriptConfig.get<Boolean>("hover.showDetailedCommandInfo");
                if (showArgs !== undefined && showArgs) {
                    let x = 1;
                    let argsText = "**Args:**";
                    for (let arg of cmd.args){
                        argsText += `\n${x}. **${arg.name}** *${ZArgType[arg.type]}*: ${arg.description}`;
                        x += 1;
                    }
                    content.push(argsText);
                }
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