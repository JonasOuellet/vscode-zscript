const http = require("http");
const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


const commandFilePath = __dirname + "\\commands.txt";
const commandTmFilePath = __dirname  + "\\commandsTm.txt";


var options = {
    host: "docs.pixologic.com",
    path: "/user-guide/customizing-zbrush/zscripting/command-reference/"
};

var request = http.request(options, (res) => {
    var data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        let commandList = getCommandList(data);

        if (commandList.length == 0){
            return console.error("No command found.");
        }
        
        writeCommandToFile(commandList);

        writeCommandTmToFile(commandList);
    });
});

request.on('error', function (e) {
    console.log(e.message);
});

request.end();

function getCommandList(data) {
    let root = new JSDOM(data);
    let articleNode = root.window.document.querySelector("#post-3750");
    let contentDiv = articleNode.querySelector("div");
    if (!contentDiv) {
        console.error("Cannot find content div");
    }
    let commandTable = contentDiv.querySelectorAll("table");
    if (!commandTable) {
        console.error("Cannot find command table");
        return [];
    }

    // get the last table
    commandTable = commandTable[commandTable.length - 1];
    // get the first child node (tbody)
    commandTable = commandTable.querySelector("tbody");

    let commandList = [];
    commandTable.querySelectorAll("tr").forEach( (tr) => {
        tr.querySelectorAll("td").forEach( (td) => {
            let com = td.querySelector('a');
            if (com){
                commandList.push(com.innerHTML);
            }
        });
    });

    return commandList;
}

function getCommandTm(commandList) {
    let outputStr = "\"\\\\b("
    let arraySize = commandList.length - 1;
    commandList.forEach((command, index) => {
        outputStr += command
        if (index < arraySize) {
            outputStr += '|';}
    });
    outputStr += ")\\\\b\""
    return outputStr;
}

function writeCommandTmToFile(commandList) {
    let fileData = getCommandTm(commandList);
    fs.writeFile(commandTmFilePath, fileData, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Commands Tm saved here: \"" + commandTmFilePath + "\"");
    });
}


function writeCommandToFile(commandList) {
    let filedata = "";
    let arraySize = commandList.length - 1;
    commandList.forEach((command, index) => {
        filedata += command
        if (index < arraySize) {
            filedata += '\n';}
    });
    fs.writeFile(commandFilePath, filedata, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Commands list saved here: \"" + commandFilePath + "\"");
    });
}