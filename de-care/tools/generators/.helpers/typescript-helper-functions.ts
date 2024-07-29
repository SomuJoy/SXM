import { SchematicsException } from '@angular-devkit/schematics';
import { Tree, updateJson } from '@nrwl/devkit';
import * as ts from 'typescript';

export function getTypescriptClassConstructorInFile(node: ts.SourceFile) {
    let targetNode;
    getTypescriptClassDefinitionInFile(node).forEachChild((child) => {
        if (child.kind === ts.SyntaxKind.Constructor) {
            targetNode = child;
        }
    });
    return targetNode;
}

export function getTypescriptClassDefinitionInFile(node: ts.SourceFile) {
    let classDecl;
    node.forEachChild((child) => {
        if (child.kind === ts.SyntaxKind.ClassDeclaration && !classDecl) {
            classDecl = child;
        }
    });
    return classDecl;
}

export function getTypescriptClassNameOfFile(node: ts.SourceFile): string {
    const classDecl = getTypescriptClassDefinitionInFile(node);
    return classDecl.name.escapedText;
}

export function getTypescriptClassConstructorBodyInFile(node: ts.SourceFile) {
    const classConstructor = getTypescriptClassConstructorInFile(node);
    if (classConstructor) {
        return classConstructor.body;
    }
}

export function getTypescriptLastParamInsertLocationOffsetInFunctionDefinitionInFile(node: ts.Node): { hasParams: boolean; pos: number } {
    const paramList = node.getChildren().find((n) => n.kind === ts.SyntaxKind.SyntaxList);
    return {
        hasParams: paramList.getChildCount() > 0,
        pos: paramList.pos + (paramList.end - paramList.pos),
    };
}

export function showTreeDebugger(node: ts.Node, indent: string = '  '): void {
    console.log(indent + ts.SyntaxKind[node.kind]);
    if (node.getChildCount() === 0) {
        console.log(indent + '  Text: ' + node.getText());
    }
    for (const child of node.getChildren()) {
        showTreeDebugger(child, indent + '  ');
    }
}

/** Reads file given path and returns TypeScript source file. */
export function parseSourceFile(host: Tree, path: string): ts.SourceFile {
    const buffer = host.read(path);
    if (!buffer) {
        throw new SchematicsException(`Could not find file for path: ${path}`);
    }
    return ts.createSourceFile(path, buffer.toString(), ts.ScriptTarget.Latest, true);
}

export async function tsConfigAddTypesToCompilerOptions(tree: Tree, path: string, typesToAdd: string[] = []) {
    updateJson(tree, path, (value) => {
        return {
            ...value,
            compilerOptions: {
                ...value.compilerOptions,
                types: [...value.compilerOptions.types, ...typesToAdd],
            },
        };
    });
}
