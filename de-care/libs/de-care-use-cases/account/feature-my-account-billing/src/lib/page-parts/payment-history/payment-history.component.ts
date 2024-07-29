import { AfterViewInit, Component, NgModule } from '@angular/core';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { PaymentRecord, PaymentsDataSource } from './payment-history-data-source';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SxmUiSkeletonLoaderPanelComponentModule } from '@de-care/shared/sxm-ui/ui-skeleton-loader-panel';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { tap } from 'rxjs/operators';
import { getShowLoadingAnimation, getShowPaymentHistoryLoadMoreButton } from '@de-care/de-care-use-cases/account/state-my-account-billing';
import { incrementPaymentHistoryMaxItems } from '@de-care/de-care-use-cases/account/state-my-account';
import { SharedSxmUiCurrencyPipeModule, SharedSxmUiUiDatePipeModule } from '@de-care/shared/sxm-ui/ui-pipes';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'my-account-payment-history',
    templateUrl: './payment-history.component.html',
    styleUrls: ['./payment-history.component.scss'],
})
export class PaymentHistoryComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    loading = false;
    showDataTable = false;
    increment = 6;
    skeletonLoadingSource = Array(4).fill('');

    showLoadingAnimation$ = this._store.select(getShowLoadingAnimation).pipe(tap((showLoadingAnimation) => (this.showDataTable = !showLoadingAnimation)));
    showLoadMoreButton$ = this._store.select(getShowPaymentHistoryLoadMoreButton);

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private readonly _store: Store, readonly dataSource: PaymentsDataSource) {
        translationsForComponentService.init(this);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
    }

    trackById(index: number, item: PaymentRecord) {
        return `${item.datetime}_${item.description}`;
    }
    loadMoreActivities() {
        this._store.dispatch(incrementPaymentHistoryMaxItems({ increment: this.increment }));
    }
}

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        CdkTableModule,
        SxmUiSkeletonLoaderPanelComponentModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiCurrencyPipeModule,
        SharedSxmUiUiDatePipeModule,
    ],
    declarations: [PaymentHistoryComponent],
    exports: [PaymentHistoryComponent],
})
export class PaymentHistoryComponentModule {}
