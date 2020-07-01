/***
 * Parse the zbrush command reference page : 
 * http://docs.pixologic.com/user-guide/customizing-zbrush/zscripting/command-reference/
 * Get the command list.
 * Write it to a file.
 */

import * as http from "http";
import { JSDOM } from "jsdom";
import { ZArg, ZCommandObject, zWriteCommandToFile, ZArgType, ZScriptLevel } from "../zCommandUtil";


var options = {
    host: "docs.pixologic.com",
    path: "/user-guide/customizing-zbrush/zscripting/command-reference/"
};

/* Remove all space in a string and make it camelCase
*/
function getCamelCaseNoSpace(text: string) {
    let outputText = "";
    let wasSpace = true;
    for (var i = 0; i < text.length; i++) {
        let curChar = text.charAt(i);
        if (curChar === ' ') {
            wasSpace = true;
            continue;
        }
        if (wasSpace) {
            outputText += curChar.toUpperCase();
            wasSpace = false;
        } else {
            outputText += curChar;
        }
      }
    return outputText;
}


function fixHTMLinnerElem(text: string) : string {
    let out = text.replace(/(<p>|<\/p>|<dd>|<\/dd>|<dl>|<\/dl>)/g, "");
    out = out.replace(/&lt;/g, "<");
    out = out.replace(/&gt;/g, ">");
    out = out.replace(/&gt;/g, ">");
    out = out.replace(/<code><b>/g, "<code>");
    out = out.replace(/<\/b><\/code>/g, "</code>");

    return out;
}


var request = http.request(options, (res) => {
    var data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        let rootDom = new JSDOM(data);
        let articleNode = rootDom.window.document.querySelector("#post-3750");
        if (!articleNode){
            console.log("Cannot find command body");
            return;
        }

        let contentDiv = articleNode.querySelector("div");
        if (!contentDiv) {
            console.error("Cannot find content div");
            return;
        }

        let commandTable = contentDiv.querySelectorAll("table");
        if (!commandTable) {
            console.error("Cannot find command table");
            return [];
        }
        let commandListObject: ZCommandObject = {};
        let mathOperatorListObject: ZCommandObject = {};
        for (let t = 1; t < commandTable.length - 1; t++) {
            let curTable = commandTable[t];
            let tableBody = curTable.querySelector('tbody');
            if (tableBody) {
                let tableContent = tableBody.querySelectorAll("tr");
                for (let x = 1; x < tableContent.length; x+=4) {
                    //let currentCommandObject : LooseObject = {};
                    const tabElem = tableContent[x];
                    const tds = tabElem.querySelectorAll("td");
                    if (tds && tds.length >= 2) {
                        let nameElem = tds[0].querySelector('b');
                        if (!nameElem) {
                            continue;
                        }
                        let commandName = nameElem.innerHTML;
                        if (commandName){
                            if (commandName === "Math Operators"){
                                // Need to decrement x because there is not 2 table for exemple and info
                                // (Only one.)
                                x -= 1;
                            }
                            else if (commandName === "Logical Operators"){
                            }
                            else if (commandName === "Math Functions"){
                                let mathTd = tableContent[x+1].querySelector("td");
                                if (mathTd){
                                    let mathdl = mathTd.querySelector("dl");
                                    if (mathdl) {
                                        let mathDds = mathdl.querySelectorAll("dd");
                                        mathDds.forEach((elem) => {
                                            let innerHTML = elem.innerHTML;

                                            let name = "";
                                            let description =  "";
                                            let args: ZArg[] = [];

                                            let regexFind = /<code>(.*?)\(/g.exec(innerHTML);
                                            if (regexFind) {
                                                name = regexFind[1];
                                            }
                                            
                                            regexFind = /(<\/code>).+?(.*$)/gm.exec(innerHTML);
                                            if (regexFind){
                                                description = regexFind[2];
                                            } 
                                            
                                            let argsSpan = elem.querySelectorAll("span");
                                            if (argsSpan){
                                                argsSpan.forEach((spanElem) => {
                                                    let tmpArg = {
                                                        name: spanElem.innerHTML,
                                                        description: "",
                                                        type: ZArgType.any
                                                    };
                                                    args.push(tmpArg);
                                                });
                                            }

                                            mathOperatorListObject[name] = {
                                                description: description,
                                                args: args,
                                                example: "",
                                                syntax: "%s(%s)",
                                                return: ZArgType.any,
                                                level: ZScriptLevel.all
                                            };
                                        });
                                    }
                                }
                            }
                            else 
                            {
                                let syntax = "[%s]";
                                let description = "";
                                let example = "";
                                let args: ZArg[] = [];
                                let level = ZScriptLevel.all;

                                let codeElem = tds[1].querySelector("code");
                                if (codeElem) {
                                    let spans = codeElem.querySelectorAll('span');
                                    spans.forEach((spanElem) => {
                                        args.push({
                                            name: getCamelCaseNoSpace(spanElem.innerHTML),
                                            description: spanElem.innerHTML,
                                            type: ZArgType.any
                                        });
                                    });
                                }
                                else{
                                    console.log("Invalid Code elem for command " + commandName);
                                    continue;
                                }

                                if (commandName === "&lt;zscriptinsert&gt;"){
                                    commandName = "zscriptinsert";
                                    syntax = "<%s, %s>";
                                }
                                else {
                                    if (args.length){
                                        syntax = "[%s, %s]";
                                    }
                                }
                                
                                // Description elem is the first table bellow the command element
                                let descElem = tableContent[x+1].querySelectorAll('td')[0];
                                // Exemple elem is the second element bellow the command element
                                let exempleElem = tableContent[x+2].querySelectorAll('td')[0];

                                description = fixHTMLinnerElem(descElem.innerHTML);
                                example = fixHTMLinnerElem(exempleElem.innerHTML);

                                if (description.indexOf("Top Level") >= 0){
                                    level = ZScriptLevel.topLevel;
                                }else if (description.indexOf("Sub-Level") >= 0){
                                    level = ZScriptLevel.subLevel;
                                }

                                commandListObject[commandName] = {
                                    syntax: syntax,
                                    description: description,
                                    example: example,
                                    args: args,
                                    level: level,
                                    return: ZArgType.any
                                };
                            }
                        }
                    }
                }
            }
        }
        zWriteCommandToFile(commandListObject, mathOperatorListObject);
    });
});

request.on('error', function (e) {
    console.log(e.message);
});

request.end();


// TODO: 
// - Replace MessageOk with MessageOK (IF)
// - replace <b> and </b> in code portion (IButton)
// - Replace ” with " in NoteBar command.