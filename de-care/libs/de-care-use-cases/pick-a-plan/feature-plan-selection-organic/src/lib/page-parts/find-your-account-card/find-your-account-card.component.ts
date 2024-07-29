import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { SharedVerifyDeviceUserSelection, VerifyDeviceTabsComponent } from '@de-care/identification';
import { behaviorEventReactionRTCProactiveOrganicAccountLookupCompleted } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';
import { SettingsService } from '@de-care/settings';
import { getLandingPageInboundUrlParams, LoadOrganicPickAPlanWorkflowService } from '@de-care/de-care-use-cases/pick-a-plan/state-plan-selection-organic';
import { concatMap, mapTo, take, takeUntil } from 'rxjs/operators';
import { getSelectedProvince, provinceChanged, setProvinceSelectionDisabled } from '@de-care/domains/customer/state-locale';
import { of, Subject } from 'rxjs';

@Component({
    selector: 'find-your-account-card',
    templateUrl: './find-your-account-card.component.html',
    styleUrls: ['./find-your-account-card.component.scss'],
})
export class FindYourAccountCardComponent implements OnInit, OnDestroy {
    @ViewChild(VerifyDeviceTabsComponent) verifyDeviceTabsComponent: VerifyDeviceTabsComponent;

    @Output() accountRadioSelected = new EventEmitter();

    @Input()
    get questionsPhoneNumber(): string {
        return this._questionsPhoneNumber;
    }

    set questionsPhoneNumber(tfn: string) {
        this._questionsPhoneNumber = tfn?.trim();
    }

    private _questionsPhoneNumber: string;

    programCode: string;
    marketingPromoCode: string;

    translateKeyPrefix = 'DeCareUseCasesPickAPlanFeaturePlanSelectionOrganicModule.FindYourAccountCardComponent.';
    tabsToShow = ['radio-info', 'account-info'];

    accountLoaded = false;
    selectedProvince: string;
    private _destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private readonly _store: Store,
        private _settingsService: SettingsService,
        private _loadOrganicPickAPlanWorkflowService: LoadOrganicPickAPlanWorkflowService
    ) {}

    ngOnInit(): void {
        if (this._settingsService.isCanadaMode) {
            this.tabsToShow = ['car-info', 'account-info'];
            this._store
                .pipe(
                    select(getSelectedProvince),
                    takeUntil(this._destroy$),
                    concatMap((province) => {
                        if (!this.accountLoaded && this.selectedProvince && this.selectedProvince !== province) {
                            this.selectedProvince = province;
                            return this._loadOrganicPickAPlanWorkflowService.build(province);
                        } else {
                            this.selectedProvince = province;
                            return of(null);
                        }
                    })
                )
                .subscribe();
        }
        this._store.pipe(select(getLandingPageInboundUrlParams), take(1)).subscribe(({ programCode, promocode }) => {
            this.programCode = programCode;
            this.marketingPromoCode = promocode;
        });
    }

    handleCloseAllModals() {
        this.verifyDeviceTabsComponent.completeYourInfoLoading();
        this.verifyDeviceTabsComponent.closeAllModals();
    }

    handleUserSelection(sharedVerifyDeviceUserSelection: SharedVerifyDeviceUserSelection) {
        this._store.dispatch(behaviorEventReactionRTCProactiveOrganicAccountLookupCompleted({ componentName: 'rtcLandingPage' }));
        this.accountLoaded = true;
        if (this._settingsService.isCanadaMode) {
            const province = sharedVerifyDeviceUserSelection.selectedAccount?.serviceAddress?.state;
            if (province) {
                this._store.dispatch(provinceChanged({ province }));
            }
            this._store.dispatch(setProvinceSelectionDisabled({ isDisabled: true }));
        }
        this.accountRadioSelected.emit({
            radioId: sharedVerifyDeviceUserSelection.selectedRadio?.last4DigitsOfRadioId,
            accountNumber: sharedVerifyDeviceUserSelection.selectedAccount?.isNewAccount ? undefined : sharedVerifyDeviceUserSelection.selectedAccountNumber,
        });
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }
}
