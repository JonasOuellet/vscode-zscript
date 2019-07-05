import { ZFileParser, ZParsedCommand, ZParsedType } from "./zFileParser";
import * as vscode from 'vscode';
import * as path from "path";


export interface ZIndexCommand {
    [key: string]: ZParsedCommand;
}


export class ZIndexParser extends ZFileParser {
    commands: ZIndexCommand = {};

    private static instance: Thenable<ZIndexParser> | null = null;

    private upateCommandObject(){
        for (let flow of this.scope.flow){
            if (flow.type === ZParsedType.command){
                let command = flow as ZParsedCommand;
                this.commands[command.commandName] = command;
            }
        }
    }

    private static getIndexFilePath(): string {
        return path.normalize(path.join(__dirname, '..', 'zsc_lang', "index.txt"));
    }

    static async TheOne(): Promise<ZIndexParser> {
        if (this.instance === null){
            this.instance = vscode.workspace.openTextDocument(this.getIndexFilePath()).then((doc) => {
                let parser = new ZIndexParser(doc);
                parser.parseDocument();
                parser.upateCommandObject();
                return parser;
            });
        }
        return this.instance;
    }
}