import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { setPackageSelectionIsprocessing, setPackageSelectionIsDowngrade, setPackageSelectionIsNotDowngrade, setPackageSelectionIsNotprocessing } from './state/actions';
import { TranslateService } from '@ngx-translate/core';
import {
    offerMarketTypeIsPromotional,
    offerTypeIsSelfPay,
    offerTypeIsIntroductory,
    offerMarketTypeIsDiscount,
    offerTypeIsNextOrForward,
} from '@de-care/domains/offers/state-offers';
import { getPackageChangePlanConfirmationData } from './state/selectors/change-subscription.selectors';
import { getDiffExcludedChannels } from '@de-care/domains/offers/state-package-descriptions';
import { behaviorEventReactionChangePlanConversionType } from '@de-care/shared/state-behavior-events';
import { isChoicePackage } from '@de-care/data-services';
@Injectable({ providedIn: 'root' })
export class PackageChangePlanRequiresConfirmationflowService implements DataWorkflow<void, boolean> {
    private readonly _packageDescriptionsKey = 'app.packageDescriptions';

    constructor(private readonly _store: Store, private readonly _translateService: TranslateService) {}

    build(): Observable<boolean> {
        return this._store.pipe(
            tap(() => this._store.dispatch(setPackageSelectionIsprocessing())),
            select(getPackageChangePlanConfirmationData),
            take(1),
            map((data) => {
                let requiresConfirmation = false;
                const diffExcludedChannels = getDiffExcludedChannels(
                    this._translateService.instant(`${this._packageDescriptionsKey}.${data.currentPlan.packageName}`),
                    data.selectedOffer.packageName
                );

                if (
                    offerMarketTypeIsDiscount(data.currentPlan.marketType) ||
                    ((offerMarketTypeIsPromotional(data.currentPlan.marketType) ||
                        isChoicePackage(data.currentPlan.packageName) ||
                        offerTypeIsNextOrForward(data.currentPlan.type)) &&
                        (offerTypeIsSelfPay(data.selectedOffer.type) || offerMarketTypeIsPromotional(data.selectedOffer.marketType)))
                ) {
                    requiresConfirmation = true;
                } else if (offerTypeIsSelfPay(data.currentPlan.type) && data.currentFollowOnPromoPlans?.length > 0) {
                    requiresConfirmation = true;
                    this._store.dispatch(setPackageSelectionIsNotDowngrade());
                    if (diffExcludedChannels) {
                        this._store.dispatch(setPackageSelectionIsDowngrade());
                        this._store.dispatch(behaviorEventReactionChangePlanConversionType({ conversionType: 'downgrade' }));
                    } else {
                        this._store.dispatch(behaviorEventReactionChangePlanConversionType({ conversionType: null }));
                    }
                } else if ((offerTypeIsSelfPay(data.currentPlan.type) || offerTypeIsIntroductory(data.currentPlan.type)) && !!diffExcludedChannels) {
                    requiresConfirmation = true;
                    this._store.dispatch(setPackageSelectionIsDowngrade());
                    this._store.dispatch(behaviorEventReactionChangePlanConversionType({ conversionType: 'downgrade' }));
                } else {
                    this._store.dispatch(setPackageSelectionIsNotDowngrade());
                    //If the selected Offer has more channels than the current plan then it is an upgrade.
                    if (diffExcludedChannels) {
                        this._store.dispatch(behaviorEventReactionChangePlanConversionType({ conversionType: 'upgrade' }));
                    } else {
                        this._store.dispatch(behaviorEventReactionChangePlanConversionType({ conversionType: null }));
                    }
                }
                this._store.dispatch(setPackageSelectionIsNotprocessing());
                return requiresConfirmation;
            })
        );
    }
}
