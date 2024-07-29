import { AfterViewInit, Component, NgModule } from '@angular/core';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BillingDateSet, BillingItemSet, BillingRecordsDataSource } from './billing-history-data-source';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiIconDropdownArrowSmallModule } from '@de-care/shared/sxm-ui/ui-icon-dropdown-arrow-small';
import { SxmUiSkeletonLoaderPanelComponentModule } from '@de-care/shared/sxm-ui/ui-skeleton-loader-panel';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { tap } from 'rxjs/operators';
import { getShowBillingHistoryLoadMoreButton, getShowLoadingAnimation, getShowServerError } from '@de-care/de-care-use-cases/account/state-my-account-billing';
import { incrementBillingHistoryMaxItems } from '@de-care/de-care-use-cases/account/state-my-account';
import { SharedSxmUiCurrencyPipeModule, SharedSxmUiUiDatePipeModule } from '@de-care/shared/sxm-ui/ui-pipes';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'my-account-billing-history',
    templateUrl: './billing-history.component.html',
    styleUrls: ['./billing-history.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', paddingBottom: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*', paddingBottom: '32px' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
        trigger('statementExpand', [state('expanded', style({ height: '*', paddingBottom: '20px' }))]),
    ],
})
export class BillingHistoryComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    loading = false;
    showDataTable = false;
    increment = 6;
    skeletonLoadingSource = Array(4).fill('');
    initLoad = true;

    showLoadingAnimation$ = this._store.select(getShowLoadingAnimation).pipe(tap((showLoadingAnimation) => (this.showDataTable = !showLoadingAnimation)));
    showLoadMoreButton$ = this._store.select(getShowBillingHistoryLoadMoreButton);
    showServerError$ = this._store.select(getShowServerError);

    constructor(private readonly _store: Store, readonly dataSource: BillingRecordsDataSource, readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
    }

    trackByDatetime(index: number, item: BillingDateSet) {
        return item.datetime;
    }

    trackByItemSetName(index: number, item: BillingItemSet) {
        return item.name;
    }

    toggleSubscriptions(item: BillingDateSet, resetFirst = false) {
        // The first row is expanded when the page first loads
        // once the user attempts to close the first row, it will now behave like every other row and no longer be initially expanded
        if (resetFirst && this.initLoad) {
            this.initLoad = false;
            item.isExpanded = false;
        } else {
            item.isExpanded = !item.isExpanded;
        }
    }

    keyup(evt, item) {
        if (evt.key === 'Enter') {
            this.toggleSubscriptions(item);
        }
    }

    loadMoreActivities() {
        this._store.dispatch(incrementBillingHistoryMaxItems({ increment: this.increment }));
    }
}

@NgModule({
    imports: [
        CommonModule,
        CdkTableModule,
        TranslateModule,
        SharedSxmUiUiIconDropdownArrowSmallModule,
        SharedSxmUiCurrencyPipeModule,
        SharedSxmUiUiDatePipeModule,
        SxmUiSkeletonLoaderPanelComponentModule,
        SharedSxmUiUiDataClickTrackModule,
    ],
    declarations: [BillingHistoryComponent],
    exports: [BillingHistoryComponent],
})
export class BillingHistoryComponentModule {}
