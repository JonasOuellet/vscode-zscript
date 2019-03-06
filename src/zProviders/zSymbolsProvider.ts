import * as vscode from 'vscode';
import { ZType } from '../zCommandUtil';
import { ZParser } from '../zParser';
import { join, extname } from 'path';
import { readdirSync, statSync } from 'fs';

export class ZSymbolProvider implements vscode.DocumentSymbolProvider, vscode.WorkspaceSymbolProvider {

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

    recursiveGetZbrushFile(folder: string): string[] {
        let out: string[] = [];

        let paths = readdirSync(folder);
        for (let filename of paths) {
            let fpath = join(folder, filename);
            if(extname(filename).toLowerCase() === '.txt'){
                out.push(fpath);
            }else if (statSync(fpath).isDirectory()){
                out.push(...this.recursiveGetZbrushFile(fpath));
            }
        }

        return out;
    }

    provideWorkspaceSymbols(query: string, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[]>{
        let workspacePath = vscode.workspace.rootPath;
        if (workspacePath){
            let files = this.recursiveGetZbrushFile(workspacePath);

            let promises: Promise<vscode.SymbolInformation[]>[] = [];
            for (let f of files){
                let prom = this.parser.getZFileParserByPath(f).then((fileParser) => {
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
                }).catch((reason)=> {
                    return [];
                });

                promises.push(prom);
            }

            return Promise.all(promises).then((results) => {
                let symbols: vscode.SymbolInformation[] = [];
                return symbols.concat(...results);
            });
        }
        
        return null;
    }
}