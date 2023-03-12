import * as assert from 'assert';
import * as vscode from 'vscode';
import * as zparse from '../zFileParser';
import * as zutils from '../zCommandUtil';
import * as testHelper from "./testHelper";


// https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35

let varDefFile = testHelper.getTestFile('parse_MVarDef.txt');

suite("Memory Variable Definition Test", function () {

    test("MVarDef Name test", (done)=>{
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            parser.updateVariable();

            assert.strictEqual(parser.variables[0].name, 'mVarTest');
            assert.strictEqual(parser.variables[1].name, 'mVarTest2');
            assert.strictEqual(parser.variables[2].name, 'mVarTest3');
            assert.strictEqual(parser.variables[3].name, 'mVarTest4');

        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });

    test("MVarDef type test", (done) => {
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            parser.updateVariable();

            assert.strictEqual(parser.variables[0].type, zutils.ZArgType.varMemoryBlock);
            assert.strictEqual(parser.variables[1].type, zutils.ZArgType.varMemoryBlock);
            assert.strictEqual(parser.variables[2].type, zutils.ZArgType.varMemoryBlock);
            assert.strictEqual(parser.variables[3].type, zutils.ZArgType.varMemoryBlock);

        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });
    
    test("MVarDef size Test", (done) => {
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            parser.updateVariable();

            assert.strictEqual(parser.variables[0].size, 25);
            assert.strictEqual(parser.variables[1].size, 50);
            assert.strictEqual(parser.variables[2].size, 1);
            assert.strictEqual(parser.variables[3].size, 1);

        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });
});