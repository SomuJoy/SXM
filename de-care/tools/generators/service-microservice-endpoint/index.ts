import { strings } from '@angular-devkit/core';
import { formatFiles, generateFiles, joinPathFragments, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { serviceGenerator } from '../.helpers/angular-generators';

interface Schema {
    name: string;
    project: string;
    getDataMethodName?: string;
}
export default async function (tree: Tree, schema: Schema) {
    await microserviceServiceGenerator(tree, schema);
    await formatFiles(tree);
}
export async function microserviceServiceGenerator(tree, schema: Schema) {
    const name = `${strings.dasherize(schema.name)}`;
    await serviceGenerator(tree, {
        name: `data-services/${name}`,
        project: schema.project,
        skipTests: true,
    });

    const projectConfig = readProjectConfiguration(tree, schema.project);
    const libRoot = `${projectConfig.sourceRoot}/lib`;
    generateFiles(tree, joinPathFragments(__dirname, './files'), libRoot, {
        name,
        methodName: schema.getDataMethodName ? strings.camelize(schema.getDataMethodName) : '',
        classify: strings.classify,
    });
}
