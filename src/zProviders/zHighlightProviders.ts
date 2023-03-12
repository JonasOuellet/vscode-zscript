import * as vscode from 'vscode';
import { ZParser } from '../zParser';
import { ZParsedText } from '../zFileParser';


export class ZHighLightProvider implements vscode.DocumentHighlightProvider {
    parser: ZParser;

    constructor (parser: ZParser){
        this.parser = parser;
    }

    private createDocHighligts(parsedText: ZParsedText[]): vscode.DocumentHighlight[] {
        let out: vscode.DocumentHighlight[] = [];
        for (let text of parsedText){
            out.push(new vscode.DocumentHighlight(text.range.convertToVsCodeRange(text.parser.document), vscode.DocumentHighlightKind.Read));  
        }
        return out;
    }

    private async provide(
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<vscode.DocumentHighlight[]> {
        let word = document.getText(document.getWordRangeAtPosition(position));
        let parse = await this.parser.getZFileParser(document);
        let parsedObj = parse.getZParsedForPosition(position);
        if (!parsedObj){
            return [];
        }

        let curScope = parsedObj.parsedObj.scope;
        let args = parse.getArgsByName(word, curScope);
        if (args) {
            let texts = parse.getVariableOccurences(word, args.insideScope);
            return this.createDocHighligts(texts);
        }
    
        let zvar = await parse.getVariableByName(word, curScope);
        if (zvar){
            let texts = parse.getVariableOccurences(word);
            return this.createDocHighligts(texts);
        }
        return [];
    }

    provideDocumentHighlights(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.DocumentHighlight[]>{
        return this.provide(document, position);
    }
}