import { Component, NgModule, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'sxm-ui-product-banner',
    template: `
        <article>
            <span [innerHTML]="data?.text"></span>
        </article>
        <footer>
            <img [src]="data?.imageUrl" [attr.alt]="data?.imageAltText" />
        </footer>
    `,
    styleUrls: ['./product-banner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiProductBannerComponent {
    @Input() data: {
        text: string;
        imageUrl: string;
        imageAltText: string;
    };
}

@NgModule({
    declarations: [SxmUiProductBannerComponent],
    exports: [SxmUiProductBannerComponent],
    imports: [],
})
export class SxmUiProductBannerComponentModule {}
