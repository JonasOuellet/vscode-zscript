import * as assert from 'assert';
import * as vscode from 'vscode';
import * as zparse from '../zFileParser';
import * as testHelper from "./testHelper";

// https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35

suite("ZScriptInser Test", function () {

    test("zscript insert test", (done)=>{
        let varDefFile = testHelper.getTestFile('parse_ZScript.txt');
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            parser.updateVariable();

            assert.strictEqual(parser.scope.flow.length, 2);
            assert.strictEqual(parser.variables.length, 1);
            assert.strictEqual(parser.insert.length, 1);


        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });
});