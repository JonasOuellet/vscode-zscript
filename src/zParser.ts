/**
 *  ZScope = any block of execution ( file, functions args.)
 *    - This mean that the function as (insideScope.scopes.length) - 1 args.
 *      minus one because the first is the command name.
 *  ZScope.flow = array of ZParsed ( The flow of the current scope.)
 */

import * as vscode from 'vscode';
import { ZArgType, ZScriptLevel, ZCommandObject, ZCommand, ZArg, getCommandDocString, getZCommandFromDocString } from './zCommandUtil';
import { zScriptCmds ,zMathFns, ZVarTable } from './zscriptCommands';


export enum ZParsedType {
    null,
    comment,
    command,
    mathFn,
    string,
    variable,
    lNumber, // literal number
    lText, // literal text
    htagGet, // Getting a variable value with #
    parentheses,
}

export enum ZCommentType {
    singleLine,
    multiLine
}

/**
 * Range class (use offset position not vscode position)
 */
export class ZRange {
    start = 0;
    end = 0;

    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }

    /**
     * Convert a range base on offset to a vscode.Range.
     * @param document the document
     */
    convertToVsCodeRange(document: vscode.TextDocument) : vscode.Range {
         return new vscode.Range(document.positionAt(this.start), document.positionAt(this.end + 1));
    }

    isContainingPosition(pos:number, inclusive=true): boolean {
        if (inclusive){
            return pos >= this.start && pos <= this.end;
        }else{
            return pos > this.start && pos <= this.end;
        }
    }
}

interface ZDeclarationRange {
    fullRange: vscode.Range;
    declaration: vscode.Range;
}

interface ZParsedTextOutput {
    zText: ZParsedText;
    endChar: string;
}

export class ZParsed {
    type: ZParsedType;
    range: ZRange;

    // Current index in the flow.
    index = -5;

    // scope that the parsed obj is in.
    scope: ZScope;

    parser: ZFileParser;

    constructor(type: ZParsedType, scope: ZScope, parser: ZFileParser, range?: ZRange){
        this.type = type;
        if (range) {
            this.range = range;
        }else{
            this.range = new ZRange(-1, -1);
        }

        this.scope = scope;
        this.parser = parser;
    }

    getNeighbourElement(elem=-1): ZParsed | undefined {
        if (this.scope) {
            return this.scope.flow[this.index + elem];
        }
        return undefined;
    }

    getText(): string{
        return this.parser.text.slice(this.range.start, this.range.end + 1);
    }
}

export class ZParsedText extends ZParsed {
    constructor(scope: ZScope, parser: ZFileParser, range?: ZRange){
        super(ZParsedType.lText, scope, parser, range);
    }
}


export class ZParsedComment extends ZParsed {
    commentType = ZCommentType.singleLine;
    constructor(scope: ZScope, parser: ZFileParser, type?: ZCommentType, range?: ZRange){
        super(ZParsedType.comment, scope, parser, range);
        if (type) {
            this.commentType = type;
        }
    }
}

export class ZParsedParentheses extends ZParsed {
    insideScope: ZScope;

    constructor(scope: ZScope, insideScope: ZScope, parser: ZFileParser, range?: ZRange){
        super(ZParsedType.parentheses, scope, parser, range);
        this.insideScope = insideScope;
    }
}

export class ZParsedCommand extends ZParsed {
    commandName = "";
    
    // Args for input output in Routine Def or for loops.
    args: ZCommandArgList;
    argsCount = 0;

    insideScope: ZScope;

    isZscriptInsert = false;

    constructor(scope: ZScope, insideScope: ZScope, parser: ZFileParser, range?: ZRange, name="", type=ZParsedType.command){
        super(type, scope, parser, range);
        this.insideScope = insideScope;
        insideScope.owner = this;

        this.args = {};

        if (name){
            this.commandName = name;
        }else{
            this.initName();
        }

        this.initArgs();
    }

    private initName() {
        if (this.type !== ZParsedType.mathFn && this.type !== ZParsedType.htagGet){
            if (this.insideScope.scopes.length)
            {
                let curScope = this.insideScope.scopes[0];
                if (curScope.flow.length){
                    let curparsed = curScope.flow[0];
                    if (curparsed.type === ZParsedType.lText){
                        // + 1 to end to be inclusive
                        this.commandName = this.parser.text.slice(curparsed.range.start, curparsed.range.end + 1);
                        //@TODO Check if the command name is valid here ???
                    }
                }
            }
        }
    }

    private initArgs() {
        // Check for routine Def args 
        // they start at scope 3 -> [RoutineDef, routineName, commandgroups, input x 10]
        if (this.commandName === "RoutineDef"){
            let inScopes = this.insideScope.scopes;
            if (inScopes.length >= 4){
                let argsCount = inScopes.length - 3;
                let x = 0;
                while (x < argsCount){
                    let curFlow = inScopes[3 + x].flow;
                    if (curFlow.length >= 1){
                        let elem = curFlow[0];
                        if (elem.type === ZParsedType.lText){
                            let type = ZArgType.any;
                            let name = elem.getText();

                            // Check for comment type
                            // format should be /* {type} */ 
                            // type can be any of ZArgType
                            if (curFlow.length >= 2) {
                                let elem2 = curFlow[1];
                                if (elem2.type === ZParsedType.comment){
                                    let comment = elem2 as ZParsedComment;
                                    if (comment.commentType === ZCommentType.multiLine){
                                        let com = comment.getText();
                                        let result = /\/\*.*?(\w+).*\*\//g.exec(com);
                                        if (result){
                                            let typeName = result[1];
                                            if (ZArgType.hasOwnProperty(typeName)){
                                                type = (<any>ZArgType)[typeName];
                                            }
                                        }
                                    }
                                }
                            }
                            this.args[name] = {
                                type: type,
                                parsed: elem
                            };
                            this.argsCount += 1;
                        }
                    }
                    x ++;
                }
            }
        }else if (this.commandName === "Loop"){
            // Check for Loop counter var 
            // it is located at scope 3
            let inScopes = this.insideScope.scopes;
            if (inScopes.length === 4) {
                let curFlow = inScopes[3].flow;
                let x = 0;
                while (x < curFlow.length){
                    let elem = curFlow[x];
                    if (elem.type === ZParsedType.lText){
                        let type = ZArgType.number;
                        let name = elem.getText();

                        this.args[name] = {
                            type: type,
                            parsed: elem
                        };
                        this.argsCount += 1;

                        break;
                    }
                    x += 1;
                }
            }
        }
    }

    getDocStringElement(): ZParsedComment | null {
        let prevElem = this.getNeighbourElement();
        if (prevElem) {
            if (prevElem.type === ZParsedType.comment){
                return prevElem as ZParsedComment;
            }
        }
        return null;
    }

    getDeclarationRange(): ZDeclarationRange {
        let document = this.parser.document;
        let zrange = this.insideScope.range;
        let codeDecRange = zrange.convertToVsCodeRange(document);
        let codeFullRange = codeDecRange;

        let comment = this.getDocStringElement();
        if (comment){
            zrange.start = comment.range.start; 
            codeFullRange = zrange.convertToVsCodeRange(document);
        }

        return {
            fullRange: codeFullRange,
            declaration: codeDecRange
        };
    }

    /**
     *  Function if the command is an variable initializer/setter ex:(RoutineDef, VarSet)
     */
    getVariableName(): string {
        let scope = this.insideScope;
        if (scope.scopes.length >= 1) {
            let nameScope = scope.scopes[1];
            if (nameScope.flow.length){
                let parsed = nameScope.flow[0];
                if (parsed && parsed.type === ZParsedType.lText){
                    let parser = this.parser;
                    return parser.text.slice(parsed.range.start, parsed.range.end + 1);
                }
            }
        }  
        return "";
    }

    getCommandArgsType(index: number) : ZArgType | undefined{
        let zobj: ZCommandObject = zScriptCmds;
        if (this.type === ZParsedType.mathFn){
            zobj = zMathFns;
        }else{
            // since the first element of a command is always the command name.
            index -= 1;
        }

        let com = zobj[this.commandName]; 
        if (com && index < com.args.length){
            return com.args[index].type;
        }

        return undefined;
    }

    getZCommand(): ZCommand {
        let args: ZArg[] = [];
        
        let x = 2;
        for(let arg in this.args){
            args.push({
                description: "${" + x + ":Arg Descriptrion}",
                name: arg,
                type: this.args[arg].type
            });
            x ++;
        }

        return {
            args: args,
            syntax: '[%s%s]',
            level: ZScriptLevel.all,
            description: "${1:Description}",
            return: ZArgType.null,
            example: ""
        };
    }

    getDocString() : string {
        return getCommandDocString(this.getZCommand());
    }

    parseDocString(): ZCommand | null {
        let comment = this.getDocStringElement();
        if (comment){
            let textComment = this.parser.text.slice(comment.range.start, comment.range.end + 1);
            return getZCommandFromDocString(textComment);
        }

        return null;
    }
}


class ZParsedString extends ZParsed {
    constructor(scope: ZScope, parser: ZFileParser, range?: ZRange){
        super(ZParsedType.string, scope, parser, range);
    }
}


export class ZParsedNumber extends ZParsed {
    isDecimal = false;
    isValid = false;
    isHexaDecimal = false;

    value: number = NaN;

    constructor(scope: ZScope, parser: ZFileParser, range?: ZRange){
        super(ZParsedType.lNumber, scope, parser, range);
    }
}
export interface ZParsedPosition {
    // index if the Zparsed is a command
    index: number;
    parsedObj: ZParsed;
}

export interface ZVariableObject {
    [key: string]: ZVariable;
}

export interface ZCommandArg {
    type: ZArgType;
    parsed: ZParsedText;
}

export interface ZCommandArgList {
    [key: string]: ZCommandArg;
}

export interface ZCommandListObject {
    [key: string]: ZParsedCommand;
}

class ZInsert {
    parsedObj: ZParsedCommand;

    // the parser that this file point to
    parser: ZFileParser | null;

    constructor(obj: ZParsedCommand){
        this.parsedObj = obj;
        this.parser = null;
    }
}


export class ZVariable {
    type: ZArgType;
    childs: ZVariable[];
    childsObj: ZVariableObject;
    parent: ZVariable | null;
    
    parsedObj: ZParsedCommand;

    range: ZDeclarationRange;

    //if variable is an array.
    size = 1;
    isArray = false;

    name: string;

    // when the same variable appear multiple time
    occurences: ZVariable[] = [];

    parser: ZFileParser;

    constructor(obj: ZParsedCommand, parser: ZFileParser, type = ZArgType.any, parent: ZVariable | null = null) {
        this.childs = [];
        this.childsObj = {};
        this.parent = null;

        this.parsedObj = obj;
        this.parser = parser;
        this.type = type;
        
        this.setParent(parent);
        this.name = obj.getVariableName();
        this._initializeSizeAndType();
        this.range = this.parsedObj.getDeclarationRange();
    }

    getDeclarationText(): string {
        if (this.type === ZArgType.routine){
            // remove the commandGroup from the text
            // get the start and end of the 3rd scope ( comamnd group )
            let scopes = this.parsedObj.insideScope.scopes;
            if (scopes.length >= 3){
                let commandGroupRange = scopes[2].range.convertToVsCodeRange(this.parser.document);
                let rangeStart = new vscode.Range(this.range.declaration.start, commandGroupRange.start);
                let rangeEnd = new vscode.Range(commandGroupRange.end, this.range.declaration.end);

                let text = this.parser.document.getText(rangeStart) + ',';
                text += this.parser.document.getText(rangeEnd).replace(/(\r\n|\n|\r)/gm,"");
                //hack because somethime the text wont end with ]
                if (!text.endsWith(']')){
                    text += ']';
                }
                return text;
            }
            return "";
            
        }else{
            return this.parser.document.getText(this.range.declaration);
        }
    }

    getDocumentationText(): string {
        let range = new vscode.Range(this.range.fullRange.start, this.range.declaration.start);
        return this.parser.document.getText(range).replace(/(\/|\*)/g,"");
    }

    setParent(parent: ZVariable | null){
        this.parent = parent;
        if (parent){
            parent.childs.push(this);
            parent.childsObj[this.name] = this;
        }
    }
 
    _initializeSizeAndType(){
        // try to get the type from the parsing value.
        let commandScope = this.parsedObj.insideScope;
        if (this.type === ZArgType.any){
            // first check if this is an array
            if (commandScope.scopes.length >= 1) {
                let flow = commandScope.scopes[1].flow;
                // Check if there is parenthese in flow
                let lastParsedType = ZParsedType.null;
                for (let f of flow){
                    if (f.type === ZParsedType.parentheses){
                        if (lastParsedType === ZParsedType.lText){
                            let par = f as ZParsedParentheses;
                            this.isArray = true;
                            if (par.insideScope.flow.length === 1){
                                let parsed = par.insideScope.flow[0];
                                if (parsed.type === ZParsedType.lNumber){
                                    let num = parsed as ZParsedNumber;
                                    if (num.isValid && !num.isDecimal){
                                        this.size = num.value;
                                        break;
                                    }
                                }
                            }
                        }
                        break;
                    }
                    lastParsedType = f.type;
                }
            }
            if (commandScope.scopes.length >= 2) {
                let flow = commandScope.scopes[2].flow;
                if (flow.length >= 1) {
                    for (let f of flow){
                        if (f.type === ZParsedType.lNumber){
                            if (this.isArray) {
                                this.type = ZArgType.numberList;
                            }else{
                                this.type = ZArgType.number;
                            }
                            break;
                        } else if (f.type === ZParsedType.string) {
                            if (this.isArray) {
                                this.type = ZArgType.stringList;
                            }else{
                                this.type = ZArgType.string;
                            }
                            break;
                        } else if (f.type === ZParsedType.command) {
                            // get the return type of the command
                            let fCom = f as ZParsedCommand;
                            this.type = zScriptCmds[fCom.commandName].return;
                            break;
                        }
                    }
                }
            }
            
        } else if ( this.type === ZArgType.varMemoryBlock || this.type === ZArgType.memoryBlock){
            // try to get the count
            if (commandScope.scopes.length >= 3) {
                let s = commandScope.scopes[2];
                for (let f of s.flow){
                    if (f.type === ZParsedType.lNumber) {
                        let num = f as ZParsedNumber;
                        if (num.isValid && !num.isDecimal){
                            this.size = num.value;
                            break;
                        }
                    }
                }
            }
        }
    }

    getDetail(): string {
        if (this.type === ZArgType.routine) {
            return "routine";
        }
        if (this.type === ZArgType.memoryBlock) {
            return "memory Block";
        }

        let str = ZArgType[this.type];
        if (this.isArray){
            str += '(';
            if (this.size > 1){
                str += this.size.toString();
            }else{
                str += "N/A";
            }
            str += ')';
        }
        return str;
    }
}

export class ZScope {
    range: ZRange;
    scopes: ZScope[];
    parent: ZScope | null;
    level: ZScriptLevel;

    owner: ZParsedCommand | null;

    flow: ZParsed[] = [];

    constructor(parent: ZScope | null, start?: number, end?:number) {
        this.owner = null;
        this.parent = parent;
        if (parent) {
            parent.scopes.push(this);
            this.level = ZScriptLevel.subLevel;
        }
        else {
            this.level = ZScriptLevel.topLevel;
        }
        this.scopes = [];

        this.range = new ZRange(0, 0);
        if ( start !== undefined) {
            this.range.start = start;
        }
        if ( end !== undefined) {
            this.range.end = end;
        }
    }

    add(value: ZParsed) {
        value.index = this.flow.length;
        this.flow.push(value);
        // switch (value.type) {
        //     case ZParsedType.comment:
                
        //         break;
        
        //     default:
        //         break;
        // }
    }

}

export class ZFileParser {

    public scope: ZScope;

    public document: vscode.TextDocument;
    public textLength = 0;
    public text = "";

    variables: ZVariable[];
    variablesObj: ZVariableObject;

    insert: ZInsert[];

    constructor (document: vscode.TextDocument) {
        this.document = document;

        this.scope = new ZScope(null);

        this.variables = [];
        this.variablesObj = {};
        this.insert = [];
    }

    /**
     * Parsing function:
     */

    public reset() {
        this.text = this.document.getText();
        this.textLength = this.text.length;
        this.scope = new ZScope(null, 0, this.textLength);
    }

    public parseDocument(startPositon: number = 0, stopFunction: Function | undefined = undefined){
        this.reset();
        this._parse(startPositon, this.scope, [], stopFunction);
    }

    parseSingleLineComment(scope: ZScope, startPos: number) : ZParsedComment {
        let text = this.text;
        let endPos = startPos;
        while ( endPos < text.length ) {
            if (text[endPos] === '\n'){
                break;
            }
            endPos += 1;
        }
        return new ZParsedComment(scope, this, ZCommentType.singleLine, new ZRange(startPos, endPos-1));
    }
    
    parseMultiLineComment(scope: ZScope, startPos: number) : ZParsedComment {
        var reg = /\*\//g;
        let found = reg.exec(this.text.slice(startPos));
        let endPos = this.textLength - 1;
        if (found) {
            endPos = found.index + 1;
        }
        return new ZParsedComment(scope, this, ZCommentType.multiLine, new ZRange(startPos, startPos + endPos));
    }
    
    parseString(scope: ZScope, startPos: number) : ZParsedString {
        let text = this.text;
        let endPos = startPos + 1;
        while ( endPos < text.length) {
            let c = text[endPos];
            if (c === '"' && text[endPos - 1] !== "\\"){
                endPos += 1; // so that when removing one we get the good index
                break;
            }
            endPos += 1;
        }
        return new ZParsedString(scope, this, new ZRange(startPos, endPos - 1));
    }

    _parse(pos: number, scope: ZScope, endChars?: string[], stopFunction: Function | undefined = undefined): number {
        let len = this.textLength;
        while (pos < len) {
            if (stopFunction !== undefined && stopFunction(this)){
                return pos;
            }

            let c = this.text[pos];

            if (endChars) {
                if (endChars.indexOf(c) >= 0){
                    scope.range.end = pos;
                    return pos;
                }
            }

            if (c === ' ' || c === '\n' || c === '\t' || c === '\r') {
                pos += 1;
                continue;
            }

            if (c === '/'){
                if (pos + 1 < len){
                    let nextChar = this.text[pos + 1];
                
                    if (nextChar === '/'){
                        let comment = this.parseSingleLineComment(scope, pos);
                        // + 2 to skip linebreak
                        if (comment) {
                            scope.add(comment);
                            pos = comment.range.end + 2;
                            continue;
                        } else {
                            // error when parsing comment
                            return pos;
                        }
                    }

                    if (nextChar === '*'){
                        let comment = this.parseMultiLineComment(scope, pos);
                        if (comment) {
                            pos = comment.range.end + 1;
                            scope.add(comment);
                            continue;
                        } else {
                            // error when parsing comment
                            return pos;
                        }
                    }
                }
            }

            if (c === '"') {
                let string = this.parseString(scope, pos);
                pos = string.range.end + 1;
                scope.add(string);
                continue;
            }

            if (c === '[') {
                let command = this._parseCommand(pos, scope, ']');
                scope.add(command);
                pos = command.range.end + 1;
                continue;
            }

            if (c === '<') {
                let command = this._parseCommand(pos, scope, '>');
                command.isZscriptInsert = true;
                scope.add(command);
                pos = command.range.end + 1;
                continue;
            }

            if (c === '#') {
                let command = this._parseCommand(pos, scope, ' ', "", ZParsedType.htagGet);
                scope.add(command);
                pos = command.range.end + 1;
                continue;
            }
            
            if (c.match(/[a-z]/i)) {
                // parse text
                let text = this._parseText(scope, pos);
                let curPos = text.zText.range.end + 1; // + 1 to cur pos because cur pos is the last number or char not the terminating char

                if (text.endChar === '('){
                    let commandName = this.text.slice(text.zText.range.start, curPos);
                    if (zMathFns.hasOwnProperty(commandName)) {
                        // Math Command
                        let command = this._parseCommand(curPos, scope, ')', commandName, ZParsedType.mathFn);
                        command.range.start = text.zText.range.start;
                        scope.add(command);
                        pos = command.range.end + 1;
                        continue;
                    }else{
                        scope.add(text.zText);
                        let parentheses = this._parseParentheses(curPos, scope);
                        scope.add(parentheses);
                        pos = parentheses.range.end + 1;
                        continue;
                    }
                    // else{
                    //     // Continue parsing
                    //     let startPos = text.zText.range.start;
                    //     text = this._parseText(scope, curPos+1);
                    //     text.zText.range.start = startPos;
                    //     curPos = text.zText.range.end;
                    // }
                }

                scope.add(text.zText);

                pos = curPos;
                continue;
            }

            if (c.match(/[0-9]/)) {
                let number = this._parseNumber(scope, pos);
                scope.add(number);
                pos = number.range.end + 1;
                continue;
            }

            pos += 1;
        }

        return pos;
    }

    _parseCommand(pos: number, scope: ZScope, endChar=']', name="", type=ZParsedType.command) : ZParsedCommand {
        let endChars = [endChar, ','];
        let commandScope = new ZScope(scope, pos);
        let endPos = pos + 1;
        while (endPos < this.textLength && this.text[endPos - 1] !== endChar){
            let curScope = new ZScope(commandScope, endPos);
            endPos = this._parse(endPos, curScope, endChars);
            // endPos - 1 if we dont when to include the end char but i think we should include it for empty args
            // [IButton,] if we want the 2nd scope we need to include the bracket in the scope range.
            curScope.range.end = endPos;
            endPos += 1;
        }
        // to go back to the bracket position
        endPos -= 1;
        // remove the closure bracket
        // @TODO: WHY - 2 ????
        commandScope.range.end = endPos;
        let outCommand = new ZParsedCommand(scope, commandScope, this, new ZRange(pos, endPos), name, type);
    
        return outCommand;
    }

    _parseParentheses(pos: number, scope: ZScope) : ZParsedParentheses {
        let inScope = new ZScope(scope, pos);
        let endPos = this._parse(pos + 1, inScope, [')', ',']);
        inScope.range.end = endPos;
        return new ZParsedParentheses(scope, inScope, this, new ZRange(pos, endPos));
    }

    _parseText(scope: ZScope, pos: number, endChars=[' ', ']', ',', '(', ')', '[', '\n', '\r']) : ZParsedTextOutput {
        let end = pos + 1;
        let endOfText = true;
        let c = '';
        while (end < this.textLength){
            c = this.text[end];

            if (endChars.indexOf(c) >= 0) {
                endOfText = false;
                break;
            }

            end += 1;
        }

        if (endOfText) {
            c = "\0";
        }

        return {
            endChar: c,
            zText: new ZParsedText(scope, this, new ZRange(pos, end - 1))
        };
    }

    _parseNumber(scope: ZScope, pos: number): ZParsedNumber {
        let isHexaDecimal = false;
        let isDecimal = false;
        let isValid = true;
        // check if number is hexadecimal
        let c = this.text[pos];
        let ep = pos + 1;
        if (c === '0' && ep < this.textLength && this.text[ep] === 'x'){
            isHexaDecimal = true;
            ep += 1;
            while (ep < this.textLength) {
                c = this.text[ep];
                // Parse evertyhing char even if its not only A-F
                // Will check when looking for error to make sure that the character are respected.
                if (!c.match(/[0-9]|[A-Z]/i)){
                    // decrement so we get to the last valid char
                    ep -= 1;
                    break;
                }
                ep += 1;
            }
            // make sure it's 8 digit for color
            isValid = ep - pos === 8;
        }
        else{
            let dotCount = 0;
            while (ep < this.textLength) {
                c = this.text[ep];
                if (!c.match(/[0-9]/i)){
                    if (c === '.'){
                        dotCount += 1;
                    }else{
                        // decrement so we get to the last valid char
                        ep -= 1;
                        break;
                    }
                }
                ep += 1;
            }
            isDecimal = dotCount > 0;
            isValid = dotCount <= 1;
        }


        let out = new ZParsedNumber(scope, this, new ZRange(pos, ep));
        out.isHexaDecimal = isHexaDecimal;
        out.isValid = isValid;
        out.isDecimal = isDecimal;
        out.value = Number(out.getText());
        return out;

    }
    
    /**
     *  update variable
     */
    
     updateVariable() {
        this.variables = [];
        this.insert = [];
        this.variablesObj = {};

        this._recursiveVarUpdate(this.scope);
     }

     private _recursiveVarUpdate(scope: ZScope, parent: ZVariable | null = null) {
        scope.flow.forEach((parsed) => {
            if (parsed.type === ZParsedType.command) {
                let curCommand = parsed as ZParsedCommand;
                let commandName = curCommand.commandName;

                if (ZVarTable.hasOwnProperty(commandName)) {
                
                    let type = ZVarTable[commandName];
                    if (type === ZArgType.scriptInsert){
                        let insert = new ZInsert(curCommand);
                        this.insert.push(insert);
                    } else {

                        let zvar = new ZVariable(curCommand, this, type);

                        let add = true;
    
                        // Check if this variable is in the command Args
                        // it will only have a parent if its in a routineDef
                        if (parent && parent.parsedObj.argsCount){
                            if (parent.parsedObj.args.hasOwnProperty(zvar.name)){
                                add = false;
                            }
                        }
    
                        // if its a VarSet command we have to check if a command of this name already exist 
                        // if not add the variable
                        if (add && (commandName === "VarSet" || commandName === "VarDef")){
                            if (parent) {
                                // check for this parent
                                if (parent.childsObj.hasOwnProperty(zvar.name)){
                                    add = false;
                                    parent.childsObj[zvar.name].occurences.push(zvar);
                                }
                            }
                            if (add) {
                                // check in global scopes:
                                if (this.variablesObj.hasOwnProperty(zvar.name)){
                                    add = false;
                                    this.variablesObj[zvar.name].occurences.push(zvar);
                                }
                            }
                        }
                        
                        if (add) {
                            if (parent === null) {
                                this.variables.push(zvar);
                                this.variablesObj[zvar.name] = zvar;
                            }else{
                                zvar.setParent(parent);
                            }
        
                            if (type === ZArgType.routine){
                                // command group is the 3 elem in the routineDef command
                                if (curCommand.insideScope.scopes.length >= 3){
                                    this._recursiveVarUpdate(curCommand.insideScope.scopes[2], zvar);
                                }
                            }
                        }
                    }
                }else{
                    curCommand.insideScope.scopes.forEach((thisScope, count) => {
                        this._recursiveVarUpdate(thisScope, parent);
                    });
                }
            }
        });
     }

    public getParsedText(elem: ZParsed): string {
        return elem.getText();
    }
    /**
     * Return the ZParsed obj at the current position, Return null if the position is not on a ZParsed
     * @param position Position in the document
     */
    public getZParsedForPosition(position: vscode.Position): ZParsedPosition | null {
        let pos = this.document.offsetAt(position);
        
        return this._recursiveZParsedForPosition(pos, this.scope);
    }

    private _recursiveZParsedForPosition(pos: number, scope: ZScope, parsedObj:ZParsed | null=null, index=-1): ZParsedPosition | null {
        if (scope.range.isContainingPosition(pos, true)){
            let x = 0;
            while (x < scope.flow.length) {
                let flow = scope.flow[x];
                if (flow.range.isContainingPosition(pos, true)){
                    // parsed parenthese
                    if (flow.type === ZParsedType.command || flow.type === ZParsedType.mathFn){
                        let command = flow as ZParsedCommand;
                        let i = 0;
                        while (i < command.insideScope.scopes.length){
                            let parsed = this._recursiveZParsedForPosition(pos, command.insideScope.scopes[i], command, i);
                            if (parsed) {
                                return parsed;
                            }
                            i++;
                        }
                    }
                    return {
                        parsedObj: flow,
                        index: index
                    };
                }
                x++;
            }
            // if the parsedObj is defined, we are in a command,
            // ending up there in the loop, there is no flow in the scope but the scope still containt the position
            if (parsedObj){
                return {
                    parsedObj: parsedObj,
                    index: index
                };
            }
        }
        return null;
    }

    getArgsListForZParsed(parsedObj: ZScope): ZCommandListObject {
        let out: ZCommandListObject = {};

        let scope = parsedObj;
        while (true){
            if (scope.owner && scope.owner.type === ZParsedType.command){
                let command = scope.owner as ZParsedCommand;
                for (let arg in command.args){
                    if (command.args.hasOwnProperty(arg)){
                        out[arg] = command;
                    }
                }  
            }

            if (scope.parent){
                scope = scope.parent;
            }else{
                break;
            }
        }
        return out;
    }

    getTopLevelParsedCommand(parsedObj: ZScope): ZParsedCommand | null {
        let scope = parsedObj;
        while (true){
            if (scope.owner && scope.owner.type === ZParsedType.command){
                let command = scope.owner as ZParsedCommand;
                if (!command.scope.parent){
                    return command;
                }
            }
            if (scope.parent){
                scope = scope.parent;
            }else{
                break;
            }
        }
        return null;
    }

    getArgsByName(name: string, parsedObj: ZScope): ZParsedCommand | null {
        let args = this.getArgsListForZParsed(parsedObj);
        if (args.hasOwnProperty(name)){
            return args[name];
        }
        return null;
    }

    getVariableByType(type: ZArgType, parsedObj?: ZScope): ZVariable[] {
        let out: ZVariable[] = [];

        if (parsedObj){
            let command = this.getTopLevelParsedCommand(parsedObj);
            if (command){
                if (command.commandName === "RoutineDef"){
                    // check for child in the command def
                    let varName = command.getVariableName();
                    let routineVar = this.variablesObj[varName];
                    if (routineVar){
                        routineVar.childs.forEach(v => {
                            if (type === ZArgType.any || v.type === type){
                                out.push(v);   
                            }
                        });
                    } 
                }
            }
        }

        this.variables.forEach(v => {
            if (type === ZArgType.any || v.type === type){
                out.push(v);   
            }
        });

        // check in zscript insert.
        
        return out;
    }

    getVariableByName(name: string, parsedObj?: ZScope): ZVariable | null {
        // Check for variable in the routine def. just to make sure that we are looking in the good scope.
        if (parsedObj){
            let command = this.getTopLevelParsedCommand(parsedObj);
            if (command){
                if (command.commandName === "RoutineDef"){
                    // check for child in the command def
                    let varName = command.getVariableName();
                    let routineVar = this.variablesObj[varName];
                    if (routineVar){
                        let zvar = routineVar.childsObj[name];
                        if (zvar){
                            return zvar;
                        }
                    } 
                }
            }
        }

        if (this.variablesObj.hasOwnProperty(name)){
            return this.variablesObj[name];
        }

        let x = 0;
        while (x < this.variables.length){
            if (this.variables[x].childsObj.hasOwnProperty(name)){
                return this.variables[x].childsObj[name];
            }
            x++;
        }

        // check for args the zscript insert

        return null;
    }

    getVariableLocationByName(name: string, parsedObj: ZScope): vscode.Location | null {
        // check for args
        let command = this.getArgsByName(name, parsedObj);
        if (command){
            return new vscode.Location(this.document.uri, command.args[name].parsed.range.convertToVsCodeRange(this.document));
        }

        let zvar = this.getVariableByName(name, parsedObj);
        if (zvar){
            return new vscode.Location(this.document.uri, zvar.range.declaration);
        }

        return null;
    }
}

export function ZParseDocument() {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    let pos = editor.selection.start;
    let offset = editor.document.offsetAt(pos);
    console.log(offset);
    console.log(editor.document.positionAt(offset));
    console.log(editor.document.getText().length);

    // let doc = editor.document;

    // let data = new ZFileParser(doc);

    // data.parseDocument();

    // data.updateVariable();

    // console.log("Completed");
}

export class ZParser {

}
