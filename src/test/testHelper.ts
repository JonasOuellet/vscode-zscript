import * as vscode from 'vscode';

/**
 * Retrive a test file.
 * @param filename the name of the test file to retrive
 * @returns The test file uri
 */
export function getTestFile(filename: string): vscode.Uri {
    let folders = vscode.workspace.workspaceFolders;
    if (folders) {
        return vscode.Uri.file(folders[0].uri.fsPath + '/' + filename);
    }
    throw new Error("Invalid workspace folder");
};