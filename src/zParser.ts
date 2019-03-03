import * as vscode from 'vscode';
import * as path from "path";
import { ZIndexParser } from './zIndexParser';
import { ZFileParser, IZParser } from './zFileParser';


interface ZParsedDocument {
    [key: string]: {
        prom: Promise<ZFileParser>;
        isDirty: boolean
    };
}


export class ZParser implements IZParser {
    private _parsedIndex: Promise<ZIndexParser> | null;
    private _parsedDocument: ZParsedDocument = {};
    private _disposable: vscode.Disposable;

    constructor(){
        this._parsedIndex = null;

        // subscribe to selection change and editor activation event
        let subscriptions: vscode.Disposable[] = [];

        vscode.workspace.onDidChangeTextDocument(this._onDidChangeTextDocument, this, subscriptions);

        this._disposable = vscode.Disposable.from(...subscriptions);
    }

    _onDidChangeTextDocument(textDocumentEvent: vscode.TextDocumentChangeEvent){
        let parsedDoc = this._parsedDocument[textDocumentEvent.document.fileName];
        if ( parsedDoc ){
            parsedDoc.isDirty = true;
        }
    }


    dispose(){
        this._disposable.dispose();
    }

    _getIndexFilePath(): string {
        return path.normalize(path.join(__dirname, '..', 'zsc_lang', "index.txt"));
    }

    async getZIndexParser(): Promise<ZIndexParser> {
        if (this._parsedIndex === null){
            let doc = await vscode.workspace.openTextDocument(this._getIndexFilePath());
            this._parsedIndex = new Promise((resolve, reject) => {
                let parser = new ZIndexParser(doc);
                parser.parseDocument();
                parser.upateCommandObject();
                resolve(parser);
            });
        }
        return this._parsedIndex;
    }

    getZFileParser(textDocument: vscode.TextDocument, forceReParsing=false): Promise<ZFileParser> {
        let parsed = this._parsedDocument[textDocument.fileName];
        if (forceReParsing || parsed === undefined || parsed.isDirty){
            let prom = new Promise<ZFileParser>((resolve, reject) => {
                let parser = new ZFileParser(textDocument, this);
                parser.parseDocument();
                resolve(parser.updateVariable());
            });
            prom.catch( reason => {
                this._parsedDocument[textDocument.fileName].isDirty = true;
            });
            
            this._parsedDocument[textDocument.fileName] = {
                prom: prom,
                isDirty: false
            };
            
            return prom;
        }
        return parsed.prom;
    }

    async getZFileParserByPath(path: string, forceReParsing=false): Promise<ZFileParser> {
        let parsed = this._parsedDocument[path];

        if (forceReParsing || parsed === undefined || parsed.isDirty){
            let doc = await vscode.workspace.openTextDocument(path);

            let prom = new Promise<ZFileParser>((resolve, reject) => {
                let parser = new ZFileParser(doc, this);
                parser.parseDocument();
                resolve(parser.updateVariable());
            });

            prom.catch(reason => {
                this._parsedDocument[path].isDirty = true;
            });

            this._parsedDocument[path] = {
                prom: prom,
                isDirty: false
            };

            return prom;
        }

        return parsed.prom;
    }
}