import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    getSelectedOfferFallbackReasonInfo,
    getUpdateOfferOnProvinceChange,
    SetSelectedProvinceAndLoadOffersWorkflowService,
    setSelectedProvinceCode,
    updateOfferOnProvinceChange,
} from '@de-care/de-care-use-cases/checkout/state-streaming-roll-to-drop';
import { DeCareSharedUiProvinceSelectionModule, ProvinceSelection, PROVINCE_SELECTION } from '@de-care/de-care/shared/ui-province-selection';
import { SharedSxmUiUiLoadingOverlayModule } from '@de-care/shared/sxm-ui/ui-loading-overlay';
import { SharedSxmUiUiLoadingWithAlertMessageModule } from '@de-care/shared/sxm-ui/ui-loading-with-alert-message';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of, Subscription, timer } from 'rxjs';
import { skip, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-purchase-organic-step-shell-page',
    templateUrl: './purchase-organic-step-shell-page.component.html',
    styleUrls: ['./purchase-organic-step-shell-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        DeCareSharedUiProvinceSelectionModule,
        SharedSxmUiUiLoadingOverlayModule,
        SharedSxmUiUiLoadingWithAlertMessageModule,
    ],
})
export class PurchaseOrganicStepShellPageComponent implements ComponentWithLocale, AfterViewInit, OnDestroy {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    showFullViewLoader$ = new BehaviorSubject(false);
    displayIneligibleLoader$ = new BehaviorSubject(false);
    fallbackMessageKeyPrefix: string;

    private _provinceUiChangeSubscription: Subscription | undefined;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        @Inject(PROVINCE_SELECTION) private readonly _provinceSelection: ProvinceSelection,
        private readonly _setSelectedProvinceAndLoadOffersWorkflowService: SetSelectedProvinceAndLoadOffersWorkflowService,
        private readonly _store: Store
    ) {
        translationsForComponentService.init(this);
    }

    ngAfterViewInit(): void {
        this._store
            .select(getSelectedOfferFallbackReasonInfo)
            .pipe(take(1))
            .subscribe((fallbackInfo) => {
                if (fallbackInfo?.programcode && fallbackInfo?.isFallback) {
                    this.fallbackMessageKeyPrefix = `${this.translateKeyPrefix}.FALLBACK_MESSAGES.${fallbackInfo?.reason.toUpperCase() === 'EXPIRED' ? 'EXPIRED' : 'DEFAULT'}`;
                    this.displayIneligibleLoader$.next(true);
                    timer(4000).subscribe(() => {
                        this.displayIneligibleLoader$.next(false);
                    });
                }
            });

        // if we are using the province bar we need to listen for province changes and handle it in feature state
        this._provinceUiChangeSubscription = this._provinceSelection?.selectedProvince$
            .pipe(
                tap((provinceCode) => {
                    if (provinceCode) {
                        this._store.dispatch(setSelectedProvinceCode({ provinceCode }));
                    }
                }),
                skip(1),
                tap(() => {
                    this.showFullViewLoader$.next(true);
                }),
                // TODO: (tech debt) See about refining this so the component doesn't need to contain this logic
                withLatestFrom(this._store.select(getUpdateOfferOnProvinceChange)),
                switchMap(([provinceCode, shouldUpdateOffer]) => {
                    if (shouldUpdateOffer) {
                        return this._setSelectedProvinceAndLoadOffersWorkflowService.build({ provinceCode });
                    }
                    this._store.dispatch(updateOfferOnProvinceChange());
                    return of(true);
                })
            )
            .subscribe(() => {
                this.showFullViewLoader$.next(false);
            });
    }

    ngOnDestroy(): void {
        this._provinceUiChangeSubscription?.unsubscribe();
    }

    onLoadingWithAlertMessageComplete($event: boolean) {
        // TODO: behavior tracking here
    }
}
