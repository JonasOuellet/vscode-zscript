import * as assert from 'assert';
import * as vscode from 'vscode';
import * as zparse from '../zFileParser';
import * as testHelper from "./testHelper";


// https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35

let varDefFile = testHelper.getTestFile('parse_Scope.txt');

suite("Scope Parsing Test", function () {

    test("Scope Test", (done)=>{
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();

            assert.strictEqual(parser.scope.flow.length, 1);
            assert.strictEqual(parser.scope.flow[0].type, zparse.ZParsedType.command);
            let command = parser.scope.flow[0] as zparse.ZParsedCommand;
            assert.strictEqual(command.commandName, "Loop");
            assert.strictEqual(command.insideScope.scopes.length, 4); 
            assert.strictEqual(command.insideScope.scopes[2].flow[0].type, zparse.ZParsedType.command);
            let varSet = command.insideScope.scopes[2].flow[0] as zparse.ZParsedCommand;
            assert.strictEqual(varSet.commandName, "VarSet");

            let strMerge = varSet.insideScope.scopes[2].flow[0] as zparse.ZParsedCommand;
            assert.strictEqual(strMerge.commandName, "StrMerge");

        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });
});