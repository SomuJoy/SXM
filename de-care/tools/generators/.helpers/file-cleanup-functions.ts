import * as fs from 'fs';
import * as path from 'path';
import { Tree } from '@nrwl/devkit';
import * as strings from '@angular-devkit/core/src/utils/strings';

export async function deleteDirectory(tree: Tree, { directory }: { directory: string }) {
    const filePath = `${strings.dasherize(path.join(directory))}`;
    if (tree.exists(filePath)) {
        tree.delete(filePath);
    }
}

export async function deleteLibReadmeFile(tree: Tree, { directory, name }: { directory: string; name: string }) {
    const readmeFilePath = `${strings.dasherize(path.join('libs', directory, name))}/README.md`;
    if (tree.exists(readmeFilePath)) {
        tree.delete(readmeFilePath);
    }
}

export async function deleteLibDefaultTSFile(tree: Tree, { directory, name }: { directory: string; name: string }) {
    const specFilePath = `${strings.dasherize(path.join('libs', directory, name))}/src/lib/${directory}-${name}.spec.ts`;
    if (tree.exists(specFilePath)) {
        tree.delete(specFilePath);
    }
    const mainFilePath = `${strings.dasherize(path.join('libs', directory, name))}/src/lib/${directory}-${name}.ts`;
    if (tree.exists(mainFilePath)) {
        tree.delete(mainFilePath);
    }
    const indexFilePath = `${strings.dasherize(path.join('libs', directory, name))}/src/index.ts`;
    if (tree.exists(indexFilePath)) {
        tree.write(indexFilePath, '');
    }
}

export async function tempRollbackOfRootPackageJsonChange(tree: Tree) {
    const filePath = 'package.json';
    if (tree.exists(filePath)) {
        const originalSource = fs.readFileSync(filePath);
        if (tree.read(filePath) !== originalSource) {
            tree.write(filePath, originalSource);
        }
    }
}

export async function tempRollbackOfRootJestConfigChange(tree: Tree) {
    const filePath = 'jest.config.js';
    if (tree.exists(filePath)) {
        const originalSource = fs.readFileSync(filePath);
        if (tree.read(filePath) !== originalSource) {
            tree.write(filePath, originalSource);
        }
    }
}
