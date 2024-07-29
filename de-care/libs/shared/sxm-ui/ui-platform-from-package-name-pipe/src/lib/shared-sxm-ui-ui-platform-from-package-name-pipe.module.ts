import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformFromPackageNamePipe } from './platform-from-package-name.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [PlatformFromPackageNamePipe],
    exports: [PlatformFromPackageNamePipe]
})
export class SharedSxmUiUiPlatformFromPackageNamePipeModule {}
