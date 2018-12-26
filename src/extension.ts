// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import opn = require('opn');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "zscript" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

    let wordCounter = new WordCounter();
    let controller = new WordCounterController(wordCounter);

    let disposable = vscode.commands.registerCommand('extension.openZScriptDoc', () => {

        opn("http://docs.pixologic.com/user-guide/customizing-zbrush/zscripting/");
    });
    
    let disposable2 = vscode.commands.registerCommand('extension.openZScriptCommandRef', () => {

        opn("http://docs.pixologic.com/user-guide/customizing-zbrush/zscripting/command-reference/");
    });

    context.subscriptions.push(controller);
    context.subscriptions.push(wordCounter);
    context.subscriptions.push(disposable);
    context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() {
}


class WordCounter {
    
    private _statusBarItem: vscode.StatusBarItem;

    constructor () {
        this._statusBarItem =  vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

        this._statusBarItem.command = 'extension.openZScriptDoc';

        this._statusBarItem.color = "#6f6";
        this._statusBarItem.tooltip = "Ceci est un beau tool tips";
    }

    public updateWordCount() {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;

        // Only update status is a Markdown file
        if (doc.languageId === "zsc") {
            let wordCount = this._getWordCount(doc);
            
            this._statusBarItem.text = wordCount !== 1 ? `${wordCount} Words` : '1 Word';
            this._statusBarItem.show();

        } else {
            this._statusBarItem.hide();
        }
    }

    public _getWordCount(doc: vscode.TextDocument): number {
        let docContent = doc.getText();

        // Parse out unwanted whitespace so the split is accurate
        docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
        docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        let wordCount = 0;
        if (docContent !== "") {
            wordCount = docContent.split(" ").length;
        }

        return wordCount;
    }

    dispose () {
        this._statusBarItem.dispose();
    }
}


class WordCounterController {
    private _wordCounter: WordCounter;
    private _disposable: vscode.Disposable;

    constructor(wordCounter: WordCounter) {
        this._wordCounter = wordCounter;

        // subscribe to selection change and editor activation event
        let subscriptions: vscode.Disposable[] = [];

        vscode.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        this._disposable = vscode.Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this._wordCounter.updateWordCount();
    }
}