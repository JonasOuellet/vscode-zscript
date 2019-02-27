import * as vscode from 'vscode';
// import { zScriptCmds, zMathFns } from "../zscriptCommands";
// import { zConvertHTMLtoMarkdown } from "../zCommandUtil";


export class ZDocumentHighlighProvider implements vscode.DocumentHighlightProvider {
    public provideDocumentHighlights(document: vscode.TextDocument, position: vscode.Position, 
        token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentHighlight[]>
    {

        console.log("Highlight Requested");
        let outResult: vscode.DocumentHighlight[] = [];

        outResult.push(new vscode.DocumentHighlight(new vscode.Range(new vscode.Position(0, 5), new vscode.Position(0, 10)),
        vscode.DocumentHighlightKind.Read));

        return outResult;
    }
}