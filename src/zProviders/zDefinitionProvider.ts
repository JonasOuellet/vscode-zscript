import * as vscode from 'vscode';
import * as zparse from '../zParser';


function getLocation(document: vscode.TextDocument, position: vscode.Position): vscode.Location | null {
    let parse = new zparse.ZFileParser(document);
    parse.parseDocument();
    parse.updateVariable();
    
    let wordRange = document.getWordRangeAtPosition(position);
    let word = document.getText(wordRange);

    if (word.startsWith('#')){
        word = word.slice(1);
    }

    let parsed = parse.getZParsedForPosition(position);
    if (parsed){
        return parse.getVariableLocationByName(word, parsed.parsedObj.scope);
    }

    return null;
}


export class ZDefinitionProvider implements vscode.DefinitionProvider, vscode.DeclarationProvider, vscode.ImplementationProvider {
    public provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): 
    vscode.ProviderResult<vscode.Definition | vscode.DefinitionLink[]> {
        return getLocation(document, position);
    }

    public provideDeclaration(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): 
    vscode.ProviderResult<vscode.Declaration> {
        return getLocation(document, position);
    }

    public provideImplementation(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): 
    vscode.ProviderResult<vscode.Definition | vscode.DefinitionLink[]>{
        return getLocation(document, position);
    }
}