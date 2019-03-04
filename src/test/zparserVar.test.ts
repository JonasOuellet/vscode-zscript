import * as assert from 'assert';
import * as vscode from 'vscode';
import * as zparse from '../zFileParser';
import * as zutils from '../zCommandUtil';

// https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35

let varDefFile = vscode.Uri.file(vscode.workspace.rootPath + '/parse_varDef.txt');

suite("Variable Definition Test", function () {

    test("VarDef Name test", (done)=>{
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            parser.updateVariable();

            assert.equal(parser.variables[0].name, 'var1');
            assert.equal(parser.variables[1].name, 'var2');
            assert.equal(parser.variables[2].name, 'var3');
            assert.equal(parser.variables[3].name, 'var4');

        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });

    test("VarDef type test", (done) => {
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            parser.updateVariable();

            assert.equal(parser.variables[0].type, zutils.ZArgType.number);
            assert.equal(parser.variables[1].type, zutils.ZArgType.string);
            assert.equal(parser.variables[2].type, zutils.ZArgType.numberList);
            assert.equal(parser.variables[3].type, zutils.ZArgType.stringList);

        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });
    
    test("VarDef size Test", (done) => {
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            parser.updateVariable();

            assert.equal(parser.variables[0].size, 1);
            assert.equal(parser.variables[1].size, 1);
            assert.equal(parser.variables[2].size, 10);
            assert.equal(parser.variables[3].size, 5);


        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });

    test("VarSet Occurences", (done) => {
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            parser.updateVariable();

            assert.equal(parser.variables.length, 5);

        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });

    test("VarSet nested", (done) => {
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            parser.updateVariable();

            assert.equal(parser.variables[4].name, "displayMessage");
            assert.equal(parser.variables[4].type, zutils.ZArgType.string);

        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });
});