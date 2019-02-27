// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import opn = require('opn');
import { ZHoverProvider, ZCompletionProver, ZDefinitionProvider, ZSignatureProvider, 
    ZDocumentSymbolProvider } from "./zProviders";
import { installIcon, uninstallIcon } from "./install_icon";
import { ZParseDocument } from './zParser';

let ZScriptDocSelector : vscode.DocumentSelector = {
    scheme: 'file', 
    language: 'zscript'
};

/*
TODO : 
- Copy icon to theme-seti
    vscode.env.appRoot + extension; edit json file to be able to see icon. reload extension

- add .zsc file to .vscode ignore file.
*/


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.commands.registerCommand('zscript.openZScriptDoc', () => {
        opn("http://docs.pixologic.com/user-guide/customizing-zbrush/zscripting/");
    }));
    
    context.subscriptions.push(vscode.commands.registerCommand('zscript.openZScriptCommandRef', () => {
        opn("http://docs.pixologic.com/user-guide/customizing-zbrush/zscripting/command-reference/");
    }));

    context.subscriptions.push(vscode.commands.registerCommand("zscript.installFileIcon", installIcon));
    context.subscriptions.push(vscode.commands.registerCommand("zscript.uninstallFileIcon", uninstallIcon));

    context.subscriptions.push(vscode.commands.registerCommand("zscript.parse", ZParseDocument));
    
    let hoverProvider = new ZHoverProvider();
    context.subscriptions.push(vscode.languages.registerHoverProvider(ZScriptDocSelector, hoverProvider));

    let completionProvider = new ZCompletionProver();
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(ZScriptDocSelector, completionProvider, '['));

    let definitionProvider = new ZDefinitionProvider();
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(ZScriptDocSelector, definitionProvider));

    let signatureProvider = new ZSignatureProvider();
    context.subscriptions.push(vscode.languages.registerSignatureHelpProvider(ZScriptDocSelector, signatureProvider, ',', '('));

    let documentSymbolsProvider = new ZDocumentSymbolProvider();
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(ZScriptDocSelector, documentSymbolsProvider));

    // let documentHighlightProvider = new ZDocumentHighlighProvider();
    // context.subscriptions.push(vscode.languages.registerDocumentHighlightProvider(ZScriptDocSelector, documentHighlightProvider));
}

// this method is called when your extension is deactivated
export function deactivate() {
    
}