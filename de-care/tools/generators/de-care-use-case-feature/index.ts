import * as strings from '@angular-devkit/core/src/utils/strings';
import { libraryGenerator } from '@nrwl/angular/generators';
// import { insertNgModuleImport } from '@nrwl/angular/src/generators/utils/insert-ngmodule-import';
import { formatFiles, Tree } from '@nrwl/devkit';
import { insertImport } from '@nrwl/workspace/src/utils/ast-utils';
import { getNgModuleFilePath } from '../.helpers/angular-helper-functions';
import { deCareStateLibraryGenerator } from '../de-care-use-case-state';
import { deleteLibReadmeFile, tempRollbackOfRootJestConfigChange, tempRollbackOfRootPackageJsonChange } from '../.helpers/file-cleanup-functions';
import { getTypescriptClassNameOfFile, parseSourceFile } from '../.helpers/typescript-helper-functions';
import ts = require('typescript');

export default async function (tree: Tree, schema: { name: string; useCaseName: string; skipState: boolean }) {
    const useCaseName = strings.dasherize(schema.useCaseName);
    const name = strings.dasherize(schema.name);
    const deCareUseCasePathRelativeToLibsPath = `de-care-use-cases/${useCaseName}`;
    const featureName = `feature-${name}`;

    // create use case feature
    await libraryGenerator(tree, {
        name: featureName,
        directory: deCareUseCasePathRelativeToLibsPath,
        routing: true,
        lazy: true,
        tags: 'type:feature, scope:de-care-use-case-feature',
    });
    await deleteLibReadmeFile(tree, { directory: deCareUseCasePathRelativeToLibsPath, name: featureName });

    // create use case state
    if (!schema.skipState) {
        const stateName = `state-${name}`;
        await deCareStateLibraryGenerator(tree, { name, useCaseName, type: 'feature' });

        const featureNgModuleFilePath = await getNgModuleFilePath(tree, `libs/${deCareUseCasePathRelativeToLibsPath}/${featureName}/src/lib`);
        const stateNgModuleFilePath = await getNgModuleFilePath(tree, `libs/${deCareUseCasePathRelativeToLibsPath}/${stateName}/src/lib`);

        const importName = getTypescriptClassNameOfFile(parseSourceFile(tree as any, stateNgModuleFilePath));
        // insertNgModuleImport(tree, featureNgModuleFilePath, importName);
        const sourceFile = ts.createSourceFile(featureNgModuleFilePath, tree.read(featureNgModuleFilePath)!.toString('utf-8'), ts.ScriptTarget.Latest, true);
        insertImport(sourceFile, featureNgModuleFilePath, importName, `@de-care/de-care-use-cases/${useCaseName}/${stateName}`);
    }

    // temp rollback of undesired file changes
    await tempRollbackOfRootPackageJsonChange(tree);
    await tempRollbackOfRootJestConfigChange(tree);

    await formatFiles(tree);
}
