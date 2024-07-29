import * as strings from '@angular-devkit/core/src/utils/strings';
import { libraryGenerator } from '@nrwl/angular/generators';
import { formatFiles, generateFiles, joinPathFragments, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { deleteLibReadmeFile, tempRollbackOfRootJestConfigChange, tempRollbackOfRootPackageJsonChange } from '../.helpers/file-cleanup-functions';
import * as path from 'path';

interface Schema {
    name: string;
    useCaseName: string;
    type: 'shared' | 'feature';
}

export default async function (tree: Tree, schema: Schema) {
    await deCareStateLibraryGenerator(tree, schema);

    // temp rollback of undesired file changes
    await tempRollbackOfRootPackageJsonChange(tree);
    await tempRollbackOfRootJestConfigChange(tree);

    await formatFiles(tree);
}

export async function deCareStateLibraryGenerator(tree: Tree, schema: Schema) {
    const useCaseName = strings.dasherize(schema.useCaseName);
    const name = strings.dasherize(schema.name);
    const deCareUseCasePathRelativeToLibsPath = `de-care-use-cases/${useCaseName}`;
    const stateName = `state-${name}`;
    await libraryGenerator(tree, {
        name: stateName,
        directory: deCareUseCasePathRelativeToLibsPath,
        tags: `type:state, scope:de-care-use-case-${schema.type}-state`,
    });

    const libRoot = path.join('libs', deCareUseCasePathRelativeToLibsPath, stateName);
    generateFiles(tree, joinPathFragments(__dirname, './files'), `${libRoot}/src/lib`, {
        name: `de-care-use-cases-${useCaseName}-${stateName}`,
        nameForModuleClass: `DeCareUseCases${strings.classify(schema.useCaseName)}State${strings.classify(schema.name)}Module`,
    });

    await deleteLibReadmeFile(tree, { directory: deCareUseCasePathRelativeToLibsPath, name: stateName });
}
