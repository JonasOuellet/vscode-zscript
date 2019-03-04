# vscode-zscript

[![Zbrush link](https://img.shields.io/badge/ZBrush-ZScript-orange.svg)](http://docs.pixologic.com/user-guide/customizing-zbrush/zscripting/)
[![GitHub issues](https://img.shields.io/github/issues/JonasOuellet/vscode-zscript.svg)](https://github.com/JonasOuellet/vscode-zscript/issues)
[![GitHub license button](https://img.shields.io/github/license/JonasOuellet/vscode-zscript.svg)](https://github.com/JonasOuellet/vscode-zscript/blob/master/LICENSE)

## Description

ZScript language support for VS Code

*(ZScript is used in zBrush to automate tasks and script workflows.)*


## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

### Intelligent autocomplete

* Only display the valid variable type
* Path auto complete for command that require path (ex: `<zscriptinsert, "myScript.txt">`)
![zscriptinsert_auto](https://raw.githubusercontent.com/JonasOuellet/vscode-zscript/master/images/zscriptinsert_auto.png)
* Routine definition comment

* Routine definition arg type

![routine_auto](https://raw.githubusercontent.com/JonasOuellet/vscode-zscript/master/images/routine_auto.gif)


### ZCommand Signature

Display information about each command argument (type, description)

![signature](https://raw.githubusercontent.com/JonasOuellet/vscode-zscript/master/images/signature.gif)

### Hover

Provide information about a symbol when hovering it.

![hover](https://raw.githubusercontent.com/JonasOuellet/vscode-zscript/master/images/hover.png)


### Variables 

* Display all the variables in the file.
* provide `goto declaration` functionality
* Variable has type.

### Snippets

* `Loop` insert a loop command snippet.
* `If` insert a if command snippet.
* `IfElse` insert a if else command snippet.
* `RoutineDef` insert a routine definition snippet.
* `RoutineDef1` insert a routine definition with one arg snippet.

### Adding type for routine Definition

You can specifiy the type of your routine definition optional argument to have a better signature and help the autocomplete displaying the good variable type.

### Support for zscriptinsert

Autocomplete will display variable defined in the inserted file.

### Commands

* `ZScript: Web Doc` Open the zscript documentation web page in your browser
* `ZScript: Web Command Reference"` Open the zscript command reference web page in your browser.
* `ZScript: Install File Icon` Display the zbrush icon for zscript files.![zscript_file_icon](https://raw.githubusercontent.com/JonasOuellet/vscode-zscript/master/images/zscript_file_icon.png)
* `ZScript: Uninstall File Icon` Remove the zscript icon display.


## Future implementation

### Color Provider

Some command require hexadecimal color (ex: 0xffffff). It is quite hard to know what the color is without looking somewhere else. Hopefully visual studio offer to provide color picker with `ColorProvider`.

## Release Notes

### 1.0.0

Initial release.