import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'sxm-ui-button-cta-placeholder',
    template: `<div></div>`,
    styleUrls: ['./button-cta-placeholder.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiButtonCtaPlaceholderComponent {}

@NgModule({
    declarations: [SxmUiButtonCtaPlaceholderComponent],
    exports: [SxmUiButtonCtaPlaceholderComponent],
    imports: [],
})
export class SxmUiButtonCtaPlaceholderComponentModule {}
