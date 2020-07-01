import * as assert from 'assert';
import * as vscode from 'vscode';
import * as zparse from "../zFileParser";

// https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35

let file = vscode.Uri.file(vscode.workspace.rootPath + '/testFile1.txt');

suite("ZParse Range and get ZParsed for position", function () {

    test("ZRange isContaining pos test1", ()=>{
        let range = new zparse.ZRange(25, 50);
        
        assert.equal(range.isContainingPosition(50), true);
    });

    test("ZRange isContaining pos test2", ()=>{
        let range = new zparse.ZRange(25, 50);
        
        assert.equal(range.isContainingPosition(26), true);
    });

    test("ZRange isContaining pos test3", ()=>{
        let range = new zparse.ZRange(25, 50);
        
        assert.equal(range.isContainingPosition(40), true);
    });

    test("ZRange is not Containing pos", ()=>{
        let range = new zparse.ZRange(25, 50);
        
        assert.equal(range.isContainingPosition(24), false);
    });

    test("ZRange is not Containing pos exclusive", ()=>{
        let range = new zparse.ZRange(25, 50);
        
        assert.equal(range.isContainingPosition(50, false), false);
    });

    test("ZParsed for positon 1", (done) => {
        vscode.window.showTextDocument(file).then((textEditor) => {
            let parser = new zparse.ZFileParser(textEditor.document);
            parser.parseDocument();

            let parsed = parser.getZParsedForPosition(new vscode.Position(0, 15));
            assert.notEqual(parsed, null);
            if (parsed){
                assert.equal(parsed.parsedObj.type, zparse.ZParsedType.lText);
            }
            
            let parsedNull = parser.getZParsedForPosition(new vscode.Position(5, 0));
            assert.equal(parsedNull, null);

            let parsedEmptyCommand = parser.getZParsedForPosition(new vscode.Position(7, 1));
            assert.notEqual(parsedEmptyCommand, null);
            if (parsedEmptyCommand){
                assert.equal(parsedEmptyCommand.parsedObj.type, zparse.ZParsedType.command);
                assert.equal(parsedEmptyCommand.index, -1);
            }

        }, (reason) => {
            console.log(reason);
        }).then(done, done);
    });
});