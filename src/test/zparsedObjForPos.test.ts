import * as assert from 'assert';
import * as vscode from 'vscode';
import * as zparse from "../zFileParser";
import * as testhelper from "./testHelper";


// https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35


suite("ZParse Range and get ZParsed for position", function () {

    test("ZRange isContaining pos test1", ()=>{
        let range = new zparse.ZRange(25, 50);
        let test = range.isContainingPosition(50);
        assert(test);
    });

    test("ZRange isContaining pos test2", ()=>{
        let range = new zparse.ZRange(25, 50);
        
        assert(range.isContainingPosition(26));
    });

    test("ZRange isContaining pos test3", ()=>{
        let range = new zparse.ZRange(25, 50);
        
        assert(range.isContainingPosition(40));
    });

    test("ZRange is not Containing pos", ()=>{
        let range = new zparse.ZRange(25, 50);
        
        assert.strictEqual(range.isContainingPosition(24), false);
    });

    test("ZRange is not Containing pos exclusive", ()=>{
        let range = new zparse.ZRange(25, 50);
        // make sure that this is really what we want.
        let value = range.isContainingPosition(50, false);
        assert.strictEqual(value, true);
    });

    test("ZParsed Literal Txt", (done) => {
        vscode.window.showTextDocument(testhelper.getTestFile("testFile1.txt")).then((te) => {
            let parser = new zparse.ZFileParser(te.document);
            parser.parseDocument();
            let parsed = parser.getZParsedForPosition(new vscode.Position(0, 15));
            assert.notStrictEqual(parsed, null);
            assert.strictEqual(parsed?.parsedObj.type, zparse.ZParsedType.lText);
        }).then(done, done);
    });
    
    test("ZParsed Null", (done) => {
        vscode.window.showTextDocument(testhelper.getTestFile("testFile1.txt")).then((te) => {
            let parser = new zparse.ZFileParser(te.document);
            parser.parseDocument();
            let parsedNull = parser.getZParsedForPosition(new vscode.Position(5, 0));
            assert.strictEqual(parsedNull, null);
        }).then(done, done); 
    });
    
    test("ZParsed, empty command", (done) => {
        vscode.window.showTextDocument(testhelper.getTestFile("testFile1.txt")).then((te) => {
            let parser = new zparse.ZFileParser(te.document);
            parser.parseDocument();
            let parsedEmptyCommand = parser.getZParsedForPosition(new vscode.Position(7, 1));
            assert.notStrictEqual(parsedEmptyCommand, null);
            if (parsedEmptyCommand){
                assert.strictEqual(parsedEmptyCommand.parsedObj.type, zparse.ZParsedType.command);
                assert.strictEqual(parsedEmptyCommand.index, 0);
            }
        }).then(done, done);
    });
});