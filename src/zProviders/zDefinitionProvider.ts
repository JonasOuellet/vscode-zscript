import * as vscode from 'vscode';
import { ZParser } from '../zParser';


async function getLocation(parser: ZParser, document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Location | null> {
    let wordRange = document.getWordRangeAtPosition(position);
    let word = document.getText(wordRange);

    let index = await parser.getZIndexParser();
    let command = index.commands[word]; 
    if (command){
        return new vscode.Location(index.document.uri, command.getDeclarationRange().declaration);
    }

    let curDoc = await parser.getZFileParser(document);

    if (word.startsWith('#')){
        word = word.slice(1);
    }

    let parsed = curDoc.getZParsedForPosition(position);
    if (parsed){
        return curDoc.getVariableLocationByName(word, parsed.parsedObj.scope);
    }

    return null;
}


export class ZDefinitionProvider implements vscode.DefinitionProvider, vscode.DeclarationProvider, vscode.ImplementationProvider {
    parser: ZParser;

    constructor(parser: ZParser){
        this.parser = parser;
    }
    
    
    public provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): 
    vscode.ProviderResult<vscode.Definition | vscode.DefinitionLink[]> {
        return getLocation(this.parser, document, position);
    }

    public provideDeclaration(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): 
    vscode.ProviderResult<vscode.Declaration> {
        return getLocation(this.parser, document, position);
    }

    public provideImplementation(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): 
    vscode.ProviderResult<vscode.Definition | vscode.DefinitionLink[]>{
        return getLocation(this.parser, document, position);
    }
}