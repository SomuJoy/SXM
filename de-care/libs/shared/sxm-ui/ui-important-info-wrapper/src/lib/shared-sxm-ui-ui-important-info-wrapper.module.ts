import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportantInfoWrapperComponent } from './important-info-wrapper/important-info-wrapper.component';

@NgModule({
    imports: [CommonModule],
    declarations: [ImportantInfoWrapperComponent],
    exports: [ImportantInfoWrapperComponent]
})
export class SharedSxmUiUiImportantInfoWrapperModule {}
