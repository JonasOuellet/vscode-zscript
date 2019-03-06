# ZScript <font size="2"><em>(ZBrush scripting language)</em></font>

[![Zbrush link](https://img.shields.io/badge/ZBrush-ZScript-orange.svg)](http://docs.pixologic.com/user-guide/customizing-zbrush/zscripting/)
[![GitHub issues](https://img.shields.io/github/issues/JonasOuellet/vscode-zscript.svg)](https://github.com/JonasOuellet/vscode-zscript/issues)
[![GitHub license button](https://img.shields.io/github/license/JonasOuellet/vscode-zscript.svg)](https://github.com/JonasOuellet/vscode-zscript/blob/master/LICENSE)

## Description

ZScript language support for VS Code

*(ZScript is used in zBrush to automate tasks and script workflows.)*


## Features

### Intelligent autocomplete

* Provide valid zcommand name
* Provide the valid variable type
* Provide auto complete for command that require path (ex: `<zscriptinsert, "myScript.txt">`)
![zscriptinsert_auto](https://raw.githubusercontent.com/JonasOuellet/vscode-zscript/master/images/zscriptinsert_auto.png)
* Provide routine definition comment
* Provide routine definition arg type

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

### Color support

![colorProvider](https://raw.githubusercontent.com/JonasOuellet/vscode-zscript/master/images/colorProvider.gif)


## Future implementation

### Color Provider

`Implemented in 1.1.0` Some command require hexadecimal color (ex: 0xffffff). It is quite hard to know what the color is without looking somewhere else. Hopefully visual studio offer to provide color picker with `ColorProvider`.

### Linter implementation

Implement a linter to display some potential error.


## Release Notes

### 1.2.0
* Implementation of [workspace symbol providers](https://code.visualstudio.com/docs/editor/editingevolved#_open-symbol-by-name)
* Implementation of folding ranges
* Implementation of document link for `zscriptinset` command

### 1.1.0

* Implementation of ColorProvider.

### 1.0.0

* Initial release.