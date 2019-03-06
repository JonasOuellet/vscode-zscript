import * as vscode from 'vscode';
import { ZParser } from '../zParser';
import { ZParsedType, ZParsedString } from '../zFileParser';
import { dirname, resolve } from 'path';
import { statSync } from 'fs';


export class ZDocumentLinkProvider implements vscode.DocumentLinkProvider {
    
    parser: ZParser;

    constructor (parser: ZParser){
        this.parser = parser;
    }

    provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]>
    { 
        return this.parser.getZFileParser(document).then(fileparser => {
            let out: vscode.DocumentLink[] = [];

            let curFolder = dirname(fileparser.document.fileName);

            for (let insert of fileparser.insert){
                if (insert.parsedObj.insideScope.scopes.length >= 1){
                    let argScope = insert.parsedObj.insideScope.scopes[1];
                    if (argScope.flow.length === 1){
                        let arg = argScope.flow[0];
                        if (arg.type === ZParsedType.string){
                            let stringVal = (<ZParsedString>arg).getStringValue();
                            let file = resolve(curFolder, stringVal);

                            if (statSync(file).isFile()){
                                out.push(new vscode.DocumentLink((<ZParsedString>arg).getStringValueRange(fileparser.document), 
                                vscode.Uri.file(insert.filepath)));
                            }
                        }
                    }
                }
            }

            return out;
        }).catch( reason => {
            return null;
        });
    }
}