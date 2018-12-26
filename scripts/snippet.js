const util = require("util");

class Snippet {
    constructor (dom) {
        this.prefix = dom.querySelector("b").innerHTML.replace(/\s+/g, '');
        this.prefix = this.prefix.replace('&lt;', '<');
        if (this.prefix[this.prefix.length - 1] === ']') {
            this.prefix = this.prefix.slice(0, this.prefix.length - 1);
        }else{
            let comma = this.prefix.indexOf(',');
            if (comma != -1){
                this.prefix = this.prefix.slice(0, comma + 1);
            }
        }
        
        this.body = this.getBody(dom);
        this.description = "Snippet for command " + this.getCommandName();
    }

    getCommandName() {
        if (this.prefix[this.prefix.length - 1] === ','){
            return this.prefix.slice(1, this.prefix.length - 1);
        }
        return this.prefix.slice(1, this.prefix.length);            
    }

    getText(dom){
        if (this.prefix[this.prefix.length - 1] !== ','){
            if (this.prefix[0] === '<') {
                return this.prefix + '>';
            }else{
                return this.prefix + ']';
            }
            
        }

        let body = this.prefix + ' ';
        let spanList = dom.querySelectorAll("span");
        spanList.forEach( (span, index) => {
            if (index != 0) {
                body += ", ";   
            }
            body += span.innerHTML;
            });

        if (this.prefix[0] === '<') {
            body += '>';
        }else{
            body += ']';
        }
            
        return body;
    }

    getBody(dom) {
        if (this.prefix[this.prefix.length - 1] !== ','){
            if (this.prefix[0] === '<') {
                body += '>';
            }else{
                body += ']';
            }
        }

        let body = this.prefix;
        let spanList = dom.querySelectorAll("span");
        let arraySize = spanList.length - 1;
        let wasCommandGroup = false;
        spanList.forEach( (span, index) => {
            let currentText = span.innerHTML;
            let isCommandGroup = false;
            if (currentText.startsWith("Commands group")){
                body += util.format("\n\t[${%d:CommandsGroup}]\n", index + 1);
                isCommandGroup = true;
                wasCommandGroup = true;
            }
            if (!isCommandGroup) {
                if (!wasCommandGroup){
                    body += " ";
                }
                wasCommandGroup = false;
                body += util.format("${%d:%s}", index+1, this.getCamelCaseNoSpace(currentText));
            }
            
            if (index < arraySize) {
                body += ",";   
            }
            });
        return body;
    }

    getCamelCaseNoSpace(text) {
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
}

module.exports = Snippet;