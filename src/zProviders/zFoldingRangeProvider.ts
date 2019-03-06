import * as vscode from 'vscode';
import { ZParser } from '../zParser';
import { ZParsedType, ZScope, ZFileParser, ZParsedCommand } from '../zFileParser';


export class ZFoldingRangeProvider implements vscode.FoldingRangeProvider {

    parser: ZParser;

    constructor (parser: ZParser){
        this.parser = parser;
    }

    recursiveFoldingRange(scope: ZScope, fileParser: ZFileParser):  vscode.FoldingRange[]{
        let out: vscode.FoldingRange[] = [];

        for (let parsed of scope.flow) {
            let codeRange = parsed.range.convertToVsCodeRange(fileParser.document);
            let start = codeRange.start.line;
            let end = codeRange.end.line;

            if (end - start >= 2){
                let type = vscode.FoldingRangeKind.Region;
                if (parsed.type === ZParsedType.comment){
                    type = vscode.FoldingRangeKind.Comment;
                }
                else{
                    end -= 1;
                }

                if (parsed.type === ZParsedType.command){
                    for (let s of (<ZParsedCommand>parsed).insideScope.scopes){
                        out.push(...this.recursiveFoldingRange(s, fileParser));
                    }
                }
                out.push(new vscode.FoldingRange(start, end, type));
            }
        }

        return out;
    }

    provideFoldingRanges(document: vscode.TextDocument, context: vscode.FoldingContext, token: vscode.CancellationToken): 
    vscode.ProviderResult<vscode.FoldingRange[]>
    {
        let prom = this.parser.getZFileParser(document).then(fileParser => {
            return this.recursiveFoldingRange(fileParser.scope, fileParser);

        }).catch(reason => {
            return null;
        });

        return prom;
    }

}