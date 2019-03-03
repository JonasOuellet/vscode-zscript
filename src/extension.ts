// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ZHoverProvider, ZCompletionProver, ZDefinitionProvider, ZSignatureProvider, 
    ZDocumentSymbolProvider } from "./zProviders";
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

    let hoverProvider = new ZHoverProvider(parser);
    context.subscriptions.push(vscode.languages.registerHoverProvider(ZScriptDocSelector, hoverProvider));

    let completionProvider = new ZCompletionProver(parser);
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(ZScriptDocSelector, completionProvider, '[', '<', "*"));

    let definitionProvider = new ZDefinitionProvider(parser);
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(ZScriptDocSelector, definitionProvider));

    let signatureProvider = new ZSignatureProvider(parser);
    context.subscriptions.push(vscode.languages.registerSignatureHelpProvider(ZScriptDocSelector, signatureProvider, ',', '('));

    let documentSymbolsProvider = new ZDocumentSymbolProvider(parser);
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(ZScriptDocSelector, documentSymbolsProvider));

    context.subscriptions.push(parser);
}

// this method is called when your extension is deactivated
export function deactivate() {
    
}