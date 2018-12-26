// docs.pixologic.com/user-guide/customizing-zbrush/zscripting/command-reference

var article = document.querySelector("#post-3750");
var contentDiv = article.querySelector('div');

let tablecontent = contentDiv.querySelectorAll("table");

let table = tablecontent[tableContent.length - 1];

let tableBody = table.querySelector("tbody");

var commands = [];

tableBody.querySelectorAll("tr").forEach((tr) => {
    tr.querySelectorAll("td").forEach((td) => {
        let a = td.querySelector("a");
        if (a) {
            commands.push(a.innerHTML);
        }
    });
});
