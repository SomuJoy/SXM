import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { OfferPresentmentPageStore } from '@de-care/de-care-use-cases/checkout/state-streaming-self-pay-organic';
import { ReactiveComponentModule } from '@ngrx/component';
import { CommonModule } from '@angular/common';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { SxmUiSkeletonLoaderTextCopyComponentModule } from '@de-care/shared/sxm-ui/ui-skeleton-loader-panel';
import { SharedSxmUiUiPrimaryPackageCardModule, SxmUiPrimaryPackageCardSkeletonLoaderComponentModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SxmUiButtonCtaSkeletonLoaderComponentModule } from '@de-care/shared/sxm-ui/ui-button-cta';
import { RouterLinkWithHref } from '@angular/router';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-offer-presentment-page',
    templateUrl: './offer-presentment-page.component.html',
    styleUrls: ['./offer-presentment-page.component.scss'],
    standalone: true,
    providers: [OfferPresentmentPageStore],
    imports: [
        CommonModule,
        RouterLinkWithHref,
        TranslateModule,
        ReactiveComponentModule,
        DeCareSharedUiPageLayoutModule,
        SxmUiSkeletonLoaderTextCopyComponentModule,
        SxmUiPrimaryPackageCardSkeletonLoaderComponentModule,
        SxmUiButtonCtaSkeletonLoaderComponentModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        SharedSxmUiUiDataClickTrackModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferPresentmentPageComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    constructor(readonly translationsForComponentService: TranslationsForComponentService, protected readonly offerPresentmentPageStore: OfferPresentmentPageStore) {
        translationsForComponentService.init(this);
    }
}
