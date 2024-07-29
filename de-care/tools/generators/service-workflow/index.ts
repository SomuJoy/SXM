import { strings } from '@angular-devkit/core';
import { formatFiles, generateFiles, joinPathFragments, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { serviceGenerator } from '../.helpers/angular-generators';

interface Schema {
    name: string;
    project: string;
}
export default async function (tree: Tree, schema: Schema) {
    await workflowServiceGenerator(tree, schema);
    await formatFiles(tree);
}
export async function workflowServiceGenerator(tree, schema: Schema) {
    const name = `${strings.dasherize(schema.name)}-workflow`;
    await serviceGenerator(tree, {
        name: `workflows/${name}`,
        project: schema.project,
        skipTests: true,
    });

    const projectConfig = readProjectConfiguration(tree, schema.project);
    const libRoot = `${projectConfig.sourceRoot}/lib`;
    generateFiles(tree, joinPathFragments(__dirname, './files'), libRoot, {
        name,
        classify: strings.classify,
    });
}
