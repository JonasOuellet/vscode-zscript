import * as assert from 'assert';
import * as vscode from 'vscode';
import * as zparse from '../zFileParser';
import * as zutils from '../zCommandUtil';
import * as testHelper from "./testHelper";


// https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35

let varDefFile = testHelper.getTestFile('parse_varDef.txt');

suite("Variable Definition Test", function () {

    test("VarDef Name test", (done) => {
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            return parser.updateVariable();
        }).then((parser) => {
            assert.strictEqual(parser.variables[0].name, 'var1');
            assert.strictEqual(parser.variables[1].name, 'var2');
            assert.strictEqual(parser.variables[2].name, 'var3');
            assert.strictEqual(parser.variables[3].name, 'var4');
        }).then(done, done);
    });

    test("VarDef type test", (done) => {
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            return parser.updateVariable();
        }).then((parser) => {
            assert.strictEqual(parser.variables[0].type, zutils.ZArgType.number);
            assert.strictEqual(parser.variables[1].type, zutils.ZArgType.string);
            assert.strictEqual(parser.variables[2].type, zutils.ZArgType.numberList);
            assert.strictEqual(parser.variables[3].type, zutils.ZArgType.stringList);
        }).then(done, done);
    });
    
    test("VarDef size Test", (done) => {
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            return parser.updateVariable();
        }).then((parser) => {
            assert.strictEqual(parser.variables[0].size, 1);
            assert.strictEqual(parser.variables[1].size, 1);
            assert.strictEqual(parser.variables[2].size, 10);
            assert.strictEqual(parser.variables[3].size, 5);
        }).then(done, done);
    });

    test("VarSet Occurences", (done) => {
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            return parser.updateVariable();
        }).then((parser) => {
            assert.strictEqual(parser.variables.length, 5);
        }).then(done, done);
    });

    test("VarSet nested", (done) => {
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            return parser.updateVariable();
        }).then((parser) => {
            assert.strictEqual(parser.variables[4].name, "displayMessage");
            assert.strictEqual(parser.variables[4].type, zutils.ZArgType.string);
        }).then(done, done);
    });

});