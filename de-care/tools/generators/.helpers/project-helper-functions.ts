import { ProjectConfiguration } from '@nrwl/devkit';

export function getRelativePathToProject(projectConfig: ProjectConfiguration) {
    const pathDepth = projectConfig.root.split('/').length;
    const path = new Array(pathDepth).fill('../').join('');
    return path;
}
