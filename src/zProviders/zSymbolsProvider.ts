import * as vscode from 'vscode';
import { ZType } from '../zCommandUtil';
import { ZParser } from '../zParser';
import { ZParsedText } from '../zFileParser';


export class ZSymbolProvider implements vscode.DocumentSymbolProvider, vscode.WorkspaceSymbolProvider,
vscode.ReferenceProvider, vscode.RenameProvider {

    parser: ZParser;

    constructor (parser: ZParser){
        this.parser = parser;
    }

    public provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): 
    vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]>
    {
    return new Promise((resolve, reject) => {
        this.parser.getZFileParser(document).then(parse => {
                let symbols: vscode.DocumentSymbol[] = [];

                for (let v of parse.variables){
                    if (v.type === ZType.routine){
                        let functionSymbol = new vscode.DocumentSymbol(v.name, v.getDetail(), vscode.SymbolKind.Function, 
                        v.range.fullRange, v.range.declaration);
        
                        for (let v2 of v.childs){
                            let symbol = new vscode.DocumentSymbol(v2.name, v2.getDetail(), vscode.SymbolKind.Variable, 
                            v2.range.fullRange, v2.range.declaration);
        
                            functionSymbol.children.push(symbol);
                        }
        
                        symbols.push(functionSymbol);
                        
                    }else{
                        let symbol = new vscode.DocumentSymbol(v.name, v.getDetail(), vscode.SymbolKind.Variable,
                        v.range.fullRange, v.range.declaration);
        
                        symbols.push(symbol);
                    }
                }
                resolve(symbols);
            }).catch(reason => {
                reject(reason);
            });
        });
    }

    provideWorkspaceSymbols(query: string, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[]>{
        let promises = this.parser.getWorkspaceZFileParsersCB<vscode.SymbolInformation[]>((fileParser) => {
            let symbols: vscode.SymbolInformation[] = [];

            for (let v of fileParser.variables){
                if (v.name.toLowerCase().startsWith(query)){
                    let type = v.type === ZType.routine ? vscode.SymbolKind.Function : vscode.SymbolKind.Variable;

                    let symbol = new vscode.SymbolInformation(v.name, type, v.name,
                        new vscode.Location(fileParser.document.uri, v.range.declaration));
    
                    symbols.push(symbol);
                }
            }
            return symbols;
        }, (reason) => {
            return [];
        });

        return Promise.all(promises).then((results) => {
            let symbols: vscode.SymbolInformation[] = [];
            return symbols.concat(...results);
        });
    }

    async getZParsedTextForVariable(document: vscode.TextDocument, position: vscode.Position, concat=true): Promise<ZParsedText[][]>{
        let word = document.getText(document.getWordRangeAtPosition(position));

        if (word.startsWith('#')){
            word = word.slice(1);
        }

        let fileParser = await this.parser.getZFileParser(document);
        let parsedPos = fileParser.getZParsedForPosition(position);

        if (parsedPos) {
            let arg = fileParser.getArgsByName(word, parsedPos.parsedObj.scope);
            if (arg){
                return [fileParser.getVariableOccurences(word, arg.insideScope)];
            }

            let zvar = await fileParser.getVariableByName(word);
            if (zvar){
                let doc = zvar.parser.document;
                let proms = this.parser.getWorkspaceZFileParsersCB<ZParsedText[]>((parser) => {
                    // check if this document is the document where zvar is declared
                    if (parser.document.fileName === doc.fileName ){
                        return parser.getVariableOccurences(word);
                    }else{
                        // check if it has the file inserted
                        for (let insert of parser.insert){
                            if (insert.filepath === doc.fileName){
                                return parser.getVariableOccurences(word);
                            }
                        }
                    }
                    return [];
                }, (reason) => {
                    return [];
                });

                return Promise.all(proms);
            }
        }

        return [];
    }

    provideReferences(document: vscode.TextDocument, position: vscode.Position, context: vscode.ReferenceContext, token: vscode.CancellationToken): 
    vscode.ProviderResult<vscode.Location[]> {

        return this.getZParsedTextForVariable(document, position).then((parsedText) => {
            let out: vscode.Location[] = [];
            for (let curDoc of parsedText){
                if (curDoc.length){
                    let doc = curDoc[0].parser.document;
                    let uri = vscode.Uri.file(doc.fileName);
                    for (let t of curDoc){
                        out.push(new vscode.Location(uri, t.range.convertToVsCodeRange(doc)));
                    }
                }
            }

            return out;
        }, (reason) => {
            return [];
        });

    }

    provideRenameEdits(document: vscode.TextDocument, position: vscode.Position, newName: string, token: vscode.CancellationToken): 
    vscode.ProviderResult<vscode.WorkspaceEdit>{
        
        return this.getZParsedTextForVariable(document, position).then((parsedText) => {
            let out = new vscode.WorkspaceEdit();
            for (let curDoc of parsedText){
                let x = curDoc.length - 1;
                if (x >= 0){
                    let doc = curDoc[0].parser.document;
                    let uri = vscode.Uri.file(doc.fileName);
                     
                    // go in reverse to do the right transform
                    while (x >= 0){
                        let p = curDoc[x];
                        out.replace(uri, p.range.convertToVsCodeRange(doc), newName);
                        x--;
                    }
                }
            }
            return out;
        }, (reason) => {
            return null;
        });

    }
}