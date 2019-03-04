import * as assert from 'assert';
import * as vscode from 'vscode';
import * as zparse from '../zFileParser';
import * as zutils from '../zCommandUtil';

// https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35

let varDefFile = vscode.Uri.file(vscode.workspace.rootPath + '/parse_RoutineDef.txt');

suite("Routine Definition Test", function () {

    test("Simple Routine Def Test", (done)=>{
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            parser.updateVariable();

            let rout = parser.variables[1];
            assert.equal(rout.name, 'simpleRoutine');
            assert.equal(rout.type, zutils.ZArgType.routine);

        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });

    test("Routine With Var", (done) => {
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            parser.updateVariable();
            
            let rout = parser.variables[2];
            assert.equal(rout.name, 'myRoutine');
            assert.equal(rout.type, zutils.ZArgType.routine);
            assert.equal(rout.childs.length, 2);
            assert.equal(rout.childs[0].name, "myVar");
            assert.equal(rout.childs[1].name, "myVar2");

        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });

    test("Routine with Output", (done) => {
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            parser.updateVariable();
            
            let rout = parser.variables[3];
            let command = rout.parsedObj;

            assert.equal(rout.name, 'myRoutineOutput');
            assert.equal(rout.type, zutils.ZArgType.routine);

            assert.equal(command.args.hasOwnProperty("input1"), true);
            assert.equal(command.args.hasOwnProperty("output2"), true);
            assert.equal(command.args.hasOwnProperty("test3"), true);

            assert.equal(command.args["input1"].type, zutils.ZArgType.number);
            assert.equal(command.args["output2"].type, zutils.ZArgType.string);
            assert.equal(command.args["test3"].type, zutils.ZArgType.any);

            assert.equal(rout.childs.length, 2);
            assert.equal(rout.childs[0].name, "myVar");
            assert.equal(rout.childs[0].type, zutils.ZArgType.number);
            assert.equal(rout.childs[1].name, "myVar2");
            assert.equal(rout.childs[1].type, zutils.ZArgType.string);

        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });
});