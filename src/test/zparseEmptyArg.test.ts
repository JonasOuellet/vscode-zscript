import * as assert from 'assert';
import * as vscode from 'vscode';
import * as zparse from '../zFileParser';
import * as testHelper from './testHelper';

// https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35

suite("ZParse Empty Args Test", function () {

    test("Zempty Args test", (done)=>{
        let numberFile = testHelper.getTestFile('parse_emptyArgs.txt');
        vscode.window.showTextDocument(numberFile).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();

            assert.strictEqual(parser.scope.flow.length, 3);
            let flow = parser.scope.flow[0];
            assert.strictEqual(flow.type, zparse.ZParsedType.command);
            let com = flow as zparse.ZParsedCommand;
            assert.strictEqual(com.commandName, "Note");
            assert.strictEqual(com.insideScope.scopes.length, 4);
            assert.strictEqual(com.insideScope.scopes[3].flow[0].type, zparse.ZParsedType.lNumber);
            assert.strictEqual(com.insideScope.scopes[2].flow.length, 0);
            
            let flow2 = parser.scope.flow[1];
            assert.strictEqual(flow2.type, zparse.ZParsedType.command);
            let com2 = flow2 as zparse.ZParsedCommand;
            assert.strictEqual(com2.commandName, "");
        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });

    test("Z Empty args range test", (done)=>{
        let doc2 = testHelper.getTestFile('parse_args.txt');
        vscode.window.showTextDocument(doc2).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();
            
            let elem1 = parser.scope.flow[0];
            let command1 = elem1 as zparse.ZParsedCommand;
            
            let insideScope1 = command1.insideScope;
            assert.strictEqual(insideScope1.scopes[0].range.start, 1);
            assert.strictEqual(insideScope1.scopes[0].range.end, 15);

            assert.strictEqual(insideScope1.scopes[1].range.start, 16);
            assert.strictEqual(insideScope1.scopes[1].range.end, 17);
            
            let elem2 = parser.scope.flow[1];
            let command2 = elem2 as zparse.ZParsedCommand;
            let insideScope2 = command2.insideScope;

            assert.strictEqual(insideScope2.scopes[1].range.start, 34);
            assert.strictEqual(insideScope2.scopes[1].range.end, 34);

        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });
});