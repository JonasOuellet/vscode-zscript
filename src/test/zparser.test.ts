import * as assert from 'assert';
import * as vscode from 'vscode';

import * as zparse from '../zFileParser';
import { zWindowIDs } from '../zWindowIDs';


// https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35

let numberFile = vscode.Uri.file(vscode.workspace.rootPath + '/parse_number.txt');

suite("ZParse document", function () {

    test("window id", (done) => {
        var windowPath = zWindowIDs['Tool'];
        assert.notEqual(windowPath, null);
        done();
    });

    test("number Test", (done)=>{
        vscode.window.showTextDocument(numberFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            
            let flow = parser.scope.flow;
            let item1 = flow[0] as zparse.ZParsedNumber;
            assert.equal(item1.isHexaDecimal, true);
            assert.equal(parser.getParsedText(item1), "0x000000");

            let item2 = flow[1] as zparse.ZParsedNumber;
            assert.equal(parser.getParsedText(item2), "548.0255");
            assert.equal(item2.isDecimal, true);

            assert.equal(item2.value, 548.0255);
            assert.equal(item1.value, 0x000000);

        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });
});