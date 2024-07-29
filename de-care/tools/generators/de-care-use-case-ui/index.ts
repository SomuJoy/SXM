import * as strings from '@angular-devkit/core/src/utils/strings';
import { libraryGenerator } from '@nrwl/angular/generators';
import { formatFiles, Tree } from '@nrwl/devkit';
import { deleteLibReadmeFile, tempRollbackOfRootJestConfigChange, tempRollbackOfRootPackageJsonChange } from '../.helpers/file-cleanup-functions';

interface Schema {
    name: string;
    useCaseName: string;
    type: 'shared' | 'feature';
}

export default async function (tree: Tree, schema: Schema) {
    await deCareUseCaseUiLibraryGenerator(tree, schema);

    // temp rollback of undesired file changes
    await tempRollbackOfRootPackageJsonChange(tree);
    await tempRollbackOfRootJestConfigChange(tree);

    await formatFiles(tree);
}

export async function deCareUseCaseUiLibraryGenerator(tree: Tree, schema: Schema) {
    const useCaseName = strings.dasherize(schema.useCaseName);
    const name = `ui-${strings.dasherize(schema.name)}`;
    const deCareUseCasePathRelativeToLibsPath = `de-care-use-cases/${useCaseName}`;
    await libraryGenerator(tree, {
        name,
        directory: deCareUseCasePathRelativeToLibsPath,
        tags: `type:ui, scope:de-care-use-case-${schema.type}-ui`,
    });
    await deleteLibReadmeFile(tree, { directory: deCareUseCasePathRelativeToLibsPath, name });
}
