import { Tree } from '@nrwl/devkit';

export async function getNgModuleFilePath(tree: Tree, srcLibRoot: string) {
    const ngModuleFile = tree.children(`${srcLibRoot}`).filter(file => file.endsWith('.module.ts'))[0];
    return `${srcLibRoot}/${ngModuleFile}`;
}
