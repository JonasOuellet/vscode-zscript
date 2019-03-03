import { ZFileParser, ZParsedCommand, ZParsedType } from "./zFileParser";

export interface ZIndexCommand {
    [key: string]: ZParsedCommand;
}


export class ZIndexParser extends ZFileParser {
    commands: ZIndexCommand = {};

    upateCommandObject(){
        for (let flow of this.scope.flow){
            if (flow.type === ZParsedType.command){
                let command = flow as ZParsedCommand;
                this.commands[command.commandName] = command;
            }
        }
    }
}