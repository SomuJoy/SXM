import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
    getPlanComparisonGridData,
    setSelectedPackageNameFromOfferGrid,
    setPlanIsSelectedFromGrid,
    resetPlanIsSelectedFromGrid,
    getOfferTypeForOfferDetails,
} from '@de-care/de-care-use-cases/cancel-subscription/state-cancel-request';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-modal-cancel-plan-comparison-grid',
    templateUrl: './modal-cancel-plan-comparison-grid.component.html',
    styleUrls: ['./modal-cancel-plan-comparison-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalCancelPlanComparisonGridComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    data$ = this._store.select(getPlanComparisonGridData);
    getOfferTypeForOfferDetails$ = this._store.select(getOfferTypeForOfferDetails);

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private readonly _store: Store, private readonly _router: Router) {
        translationsForComponentService.init(this);
    }

    onClosed() {
        this._store.dispatch(resetPlanIsSelectedFromGrid());
        this._router.navigate(['subscription', 'cancel', { outlets: { modal: null } }]);
    }

    onPackageNameSelected($event) {
        this._store.dispatch(setPlanIsSelectedFromGrid());
        this._store.dispatch(setSelectedPackageNameFromOfferGrid({ packageName: $event }));
        this._router.navigate(['subscription', 'cancel', { outlets: { modal: null } }]);
    }
}
