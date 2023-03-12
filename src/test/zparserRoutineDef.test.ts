import * as assert from 'assert';
import * as vscode from 'vscode';
import * as zparse from '../zFileParser';
import * as zutils from '../zCommandUtil';
import * as testHelper from "./testHelper";

// https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35

let varDefFile = testHelper.getTestFile('parse_RoutineDef.txt');

suite("Routine Definition Test", function () {

    test("Simple Routine Def Test", (done)=>{
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            parser.updateVariable();

            let rout = parser.variables[1];
            assert.strictEqual(rout.name, 'simpleRoutine');
            assert.strictEqual(rout.type, zutils.ZArgType.routine);

        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });

    test("Routine With Var", (done) => {
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            return parser.updateVariable()
        }).then((parser) => {
            let rout = parser.variables[2];
            assert.strictEqual(rout.name, 'myRoutine');
            assert.strictEqual(rout.type, zutils.ZArgType.routine);
            assert.strictEqual(rout.childs.length, 2);
            assert.strictEqual(rout.childs[0].name, "myVar");
            assert.strictEqual(rout.childs[1].name, "myVar2");
        }).then(done, done);
    });

    test("Routine with Output", (done) => {
        vscode.window.showTextDocument(varDefFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            return parser.updateVariable();
        }).then((parser) => {
            let rout = parser.variables[3];
            let command = rout.parsedObj;

            assert.strictEqual(rout.name, 'myRoutineOutput');
            assert.strictEqual(rout.type, zutils.ZArgType.routine);

            assert.strictEqual(command.args.hasOwnProperty("input1"), true);
            assert.strictEqual(command.args.hasOwnProperty("output2"), true);
            assert.strictEqual(command.args.hasOwnProperty("test3"), true);

            assert.strictEqual(command.args["input1"].type, zutils.ZArgType.number);
            assert.strictEqual(command.args["output2"].type, zutils.ZArgType.string);
            assert.strictEqual(command.args["test3"].type, zutils.ZArgType.any);

            assert.strictEqual(rout.childs.length, 2);
            assert.strictEqual(rout.childs[0].name, "myVar");
            assert.strictEqual(rout.childs[0].type, zutils.ZArgType.number);
            assert.strictEqual(rout.childs[1].name, "myVar2");
            assert.strictEqual(rout.childs[1].type, zutils.ZArgType.string);
        }).then(done, done);
    });
});