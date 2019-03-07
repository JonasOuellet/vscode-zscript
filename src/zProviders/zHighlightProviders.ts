import * as vscode from 'vscode';
import { ZParser } from '../zParser';
import { ZParsedText } from '../zFileParser';


export class ZHighLightProvider implements vscode.DocumentHighlightProvider {
    parser: ZParser;

    constructor (parser: ZParser){
        this.parser = parser;
    }

    createDocHighligts(parsedText: ZParsedText[]): vscode.DocumentHighlight[] {
        let out: vscode.DocumentHighlight[] = [];
        for (let text of parsedText){
            out.push(new vscode.DocumentHighlight(text.range.convertToVsCodeRange(text.parser.document), vscode.DocumentHighlightKind.Read));  
        }
        return out;
    }

    provideDocumentHighlights(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): 
    vscode.ProviderResult<vscode.DocumentHighlight[]>{
        let word = document.getText(document.getWordRangeAtPosition(position));

        return new Promise((resolve, reject) => {
            this.parser.getZFileParser(document).then(parse => {
                let parsedObj = parse.getZParsedForPosition(position);
                if (parsedObj){
                    let curScope = parsedObj.parsedObj.scope;
                    let args = parse.getArgsByName(word, curScope);

                    if (args) {
                        let texts = parse.getVariableOccurences(word, args.insideScope);
                        resolve(this.createDocHighligts(texts));
                    }

                    resolve(parse.getVariableByName(word, curScope).then((Zvar)=>{
                        if (Zvar){
                            let texts = parse.getVariableOccurences(word);
                            return this.createDocHighligts(texts);
                        }
                        return [];
                    }, (reason) => {
                        return [];
                    }));
                }
                resolve([]);
                }).catch(reason => {
                    reject(reason);
                });
            });
    }

}