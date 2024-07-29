import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'sxm-ui-placeholder-text-copy',
    template: `
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    `,
    styleUrls: ['./placeholder-text-copy.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiPlaceholderTextCopyComponent {}

@NgModule({
    declarations: [SxmUiPlaceholderTextCopyComponent],
    exports: [SxmUiPlaceholderTextCopyComponent],
    imports: [],
})
export class SxmUiPlaceholderTextCopyComponentModule {}
