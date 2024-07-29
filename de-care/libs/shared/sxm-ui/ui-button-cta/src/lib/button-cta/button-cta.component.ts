import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'button[sxmUiButtonCta], a[sxmUiButtonCta]',
    template: `<ng-content></ng-content>`,
    styleUrls: ['./button-cta.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiButtonCtaComponent {}

@NgModule({
    declarations: [SxmUiButtonCtaComponent],
    exports: [SxmUiButtonCtaComponent],
    imports: [],
})
export class SxmUiButtonCtaComponentModule {}
