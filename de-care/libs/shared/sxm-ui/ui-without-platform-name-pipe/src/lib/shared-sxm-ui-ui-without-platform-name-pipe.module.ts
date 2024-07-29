import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithoutPlatformNamePipe } from './without-platform-name.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [WithoutPlatformNamePipe],
    exports: [WithoutPlatformNamePipe],
})
export class SharedSxmUiUiWithoutPlatformNamePipeModule {}
