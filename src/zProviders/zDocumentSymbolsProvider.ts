import * as vscode from 'vscode';
import { ZArgType } from '../zCommandUtil';
import { ZParser } from '../zParser';


export class ZDocumentSymbolProvider implements vscode.DocumentSymbolProvider {

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
                    if (v.type === ZArgType.routine){
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
}