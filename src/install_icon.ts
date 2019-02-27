import { env, commands } from 'vscode';
import { join, normalize, relative } from "path";
import { copyFileSync, readFileSync, writeFileSync, unlinkSync } from "fs";

function getExtensionFolder(): string {
    return  join(env.appRoot, 'extensions');
}

function getSetiExtensionIconsFolder(): string {
    return join(getExtensionFolder(), "theme-seti", "icons");
}

function getSetiIconJsonFile(): string {
    return join(getSetiExtensionIconsFolder(), "vs-seti-icon-theme.json");
} 

function getImageFolder(): string {
    return normalize(join(__dirname, "..", "images"));
}

function getIconPath(): string {
    return join(getImageFolder(), "zbrush_icon.svg");
}

function getDestinationIconPath(): string {
    return join(getExtensionFolder(), "zbrush_icon.svg");
}

function setZbrushFileIconForSeti(){
    let sourceIcon = getIconPath();
    let targetIcon = getDestinationIconPath();
    copyFileSync(sourceIcon, targetIcon);

    let relPath = relative(getSetiExtensionIconsFolder(), targetIcon);

    let setiFile = getSetiIconJsonFile();
    let setiData = JSON.parse(readFileSync(setiFile,  "utf8"));

    setiData.iconDefinitions["_zscript"] = {
        iconPath: relPath
    };

    setiData.languageIds["zscript"] = '_zscript';
    setiData.light.languageIds["zscript"] = '_zscript';

    writeFileSync(setiFile, JSON.stringify(setiData, undefined, 4), "utf8");
}

function removeIconForSeti() {
    let targetIcon = getDestinationIconPath();
    unlinkSync(targetIcon);

    let setiFile = getSetiIconJsonFile();
    let setiData = JSON.parse(readFileSync(setiFile,  "utf8"));

    delete setiData.iconDefinitions["_zscript"];
    delete setiData.languageIds["zscript"];
    delete setiData.light.languageIds["zscript"];

    writeFileSync(setiFile, JSON.stringify(setiData, undefined, 4), "utf8");
}

export function installIcon() {
    setZbrushFileIconForSeti();

    commands.executeCommand("workbench.action.reloadWindow");
}

export function uninstallIcon() {
    removeIconForSeti();

    commands.executeCommand("workbench.action.reloadWindow");
}