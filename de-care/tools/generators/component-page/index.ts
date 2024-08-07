import { strings } from '@angular-devkit/core';
import { formatFiles, generateFiles, joinPathFragments, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { componentGenerator } from '../.helpers/angular-generators';

interface Schema {
    name: string;
    project: string;
    skipTranslationSupport: boolean;
}

export default async function (tree: Tree, schema: Schema) {
    await componentPageGenerator(tree, schema);
    await formatFiles(tree);
}

export async function componentPageGenerator(tree, schema: Schema) {
    const name = `${strings.dasherize(schema.name)}-page`;
    await componentGenerator(tree, {
        name: `pages/${name}`,
        project: schema.project,
        style: 'scss',
        skipTests: true,
        skipImport: true,
        standalone: true,
    });

    const projectConfig = readProjectConfiguration(tree, schema.project);
    const libRoot = `${projectConfig.sourceRoot}/lib`;
    const filesPath = joinPathFragments(__dirname, schema.skipTranslationSupport ? './files' : './files-with-translation');
    generateFiles(tree, filesPath, libRoot, {
        name,
        classify: strings.classify,
        dasherize: strings.dasherize,
    });
}
