const http = require("http");
const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const Snippet = require('./snippet');

const generatedSnippetFile = __dirname + "\\snippets.json";

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
        let snippets = generateSnippetsList(data);

        writeSnippetToFile(snippets);
    });
});

request.on('error', function (e) {
    console.log(e.message);
});

request.end();

function generateSnippetsList(data) {
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

    var snippetsData = {};
    for (let t = 1; t < commandTable.length - 1; t++) {
        let curTable = commandTable[t];
        let tableBody = curTable.querySelector('tbody');
        let tableContent = tableBody.querySelectorAll("tr");
        for (let x = 1; x < tableContent.length; x+=4) {
            const tabElem = tableContent[x];
            try {
                let code = tabElem.querySelectorAll("td")[1].querySelector("code");
                let curSnippet = new Snippet(code);
                snippetsData[curSnippet.getCommandName()] = curSnippet;
            } catch (error) {
                //console.log(error);
            }
        }
    }

    return snippetsData;
}

function writeSnippetToFile(snippetObj) {
    fs.writeFile(generatedSnippetFile, JSON.stringify(snippetObj, null, 4));
}