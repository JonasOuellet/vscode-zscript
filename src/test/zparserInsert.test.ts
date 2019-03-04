import * as assert from 'assert';
import * as vscode from 'vscode';
import * as zparse from '../zFileParser';

// https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35

let varDefFile = vscode.Uri.file(vscode.workspace.rootPath + '/parse_ZScript.txt');

suite("ZScriptInser Test", function () {

    test("zscript insert test", (done)=>{
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            parser.updateVariable();

            assert.equal(parser.scope.flow.length, 2);
            assert.equal(parser.variables.length, 1);
            assert.equal(parser.insert.length, 1);


        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });
});