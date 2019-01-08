// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import opn = require('opn');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.commands.registerCommand('zscript.openZScriptDoc', () => {
        opn("http://docs.pixologic.com/user-guide/customizing-zbrush/zscripting/");
    }));
    
    context.subscriptions.push(vscode.commands.registerCommand('zscript.openZScriptCommandRef', () => {
        opn("http://docs.pixologic.com/user-guide/customizing-zbrush/zscripting/command-reference/");
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
}