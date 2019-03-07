// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as zproviders from "./zProviders";
import { installIcon, uninstallIcon } from "./install_icon";
import { ZParser } from './zParser';


let ZScriptDocSelector : vscode.DocumentSelector = {
    scheme: 'file', 
    language: 'zscript'
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.commands.registerCommand('zscript.openZScriptDoc', () => {
        vscode.commands.executeCommand('vscode.open', 
            vscode.Uri.parse("http://docs.pixologic.com/user-guide/customizing-zbrush/zscripting/"));
    }));
    
    context.subscriptions.push(vscode.commands.registerCommand('zscript.openZScriptCommandRef', () => {
        vscode.commands.executeCommand('vscode.open', 
            vscode.Uri.parse("http://docs.pixologic.com/user-guide/customizing-zbrush/zscripting/command-reference/"));
    }));

    context.subscriptions.push(vscode.commands.registerCommand("zscript.installFileIcon", installIcon));
    context.subscriptions.push(vscode.commands.registerCommand("zscript.uninstallFileIcon", uninstallIcon));

    /*
        Providers definition
    */
    let parser = new ZParser();

    let hoverProvider = new zproviders.ZHoverProvider(parser);
    context.subscriptions.push(vscode.languages.registerHoverProvider(ZScriptDocSelector, hoverProvider));

    let completionProvider = new zproviders.ZCompletionProver(parser);
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(ZScriptDocSelector, completionProvider, '[', '<', "*", '#'));

    let definitionProvider = new zproviders.ZDefinitionProvider(parser);
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(ZScriptDocSelector, definitionProvider));

    let signatureProvider = new zproviders.ZSignatureProvider(parser);
    context.subscriptions.push(vscode.languages.registerSignatureHelpProvider(ZScriptDocSelector, signatureProvider, ',', '('));

    let documentSymbolsProvider = new zproviders.ZSymbolProvider(parser);
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(ZScriptDocSelector, documentSymbolsProvider));
    context.subscriptions.push(vscode.languages.registerWorkspaceSymbolProvider(documentSymbolsProvider));
    context.subscriptions.push(vscode.languages.registerReferenceProvider(ZScriptDocSelector, documentSymbolsProvider));
    context.subscriptions.push(vscode.languages.registerRenameProvider(ZScriptDocSelector, documentSymbolsProvider));
    
    let colorProvier = new zproviders.ZColorProvider(parser);
    context.subscriptions.push(vscode.languages.registerColorProvider(ZScriptDocSelector, colorProvier));

    let foldingProvider = new zproviders.ZFoldingRangeProvider(parser);
    context.subscriptions.push(vscode.languages.registerFoldingRangeProvider(ZScriptDocSelector, foldingProvider));

    let docLinkProvider = new zproviders.ZDocumentLinkProvider(parser);
    context.subscriptions.push(vscode.languages.registerDocumentLinkProvider(ZScriptDocSelector, docLinkProvider));

    // let highlightProvider = new zproviders.ZHighLightProvider(parser);
    // context.subscriptions.push(vscode.languages.registerDocumentHighlightProvider(ZScriptDocSelector, highlightProvider));

    context.subscriptions.push(parser);
}

// this method is called when your extension is deactivated
export function deactivate() {
    
}