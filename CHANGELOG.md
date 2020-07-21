## 1.6.0 - July 21th
* Provide additional syntax highlight [#9](https://github.com/JonasOuellet/vscode-zscript/issues/9)

## 1.5.2 - June 30th
* Add Timeline command.

## 1.5.1 - January 3rd 
* Parser bug fix with character '<' [#10](https://github.com/JonasOuellet/vscode-zscript/issues/10)

## 1.4.0 - July 17th, 2019
* Add autocomplete for window path.

## 1.3.1 - July 4th, 2019
* Display RoutineCall argument name even if there is no docstrings
* Fix an issue where some command definitions were not found
* Remove escape character for strings
* Relative path autocomplete now use one backslash on windows.

## 1.3.0 - March 6th, 2019
* Implemented [rename](https://code.visualstudio.com/docs/editor/editingevolved#_rename-symbol)
* Implemented [find references](https://code.visualstudio.com/docs/editor/editingevolved#_peek)
* Fix an issue when setting a command arg ex (Loop counter) was creating a document variable

## 1.2.0 - March 5th, 2019
* Implemented document link provider for `zscriptinsert` command
* Implemented [workspace symbol providers](https://code.visualstudio.com/docs/editor/editingevolved#_open-symbol-by-name)
* Implemented folding ranges.

## 1.1.0 - March 4th, 2019
* Implement Color Provider
* Fix command (`IGet`, `ISet`) arg type

## 1.0.1 - March 4th, 2019
* Fix readme image path to resolve to https

## 1.0.0 - March 4th, 2019
* Initial Release