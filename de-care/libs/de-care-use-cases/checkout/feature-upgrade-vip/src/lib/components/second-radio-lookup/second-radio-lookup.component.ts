import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LANGUAGE_CODES } from '@de-care/shared/translation';
import { TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs/operators';
import { Device, DeviceType } from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { DeviceLookupWizardComponent, DeviceLookupWizardOutput } from '@de-care/identification';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { setIsStreaming, setStreamingAccount, Streaming } from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import * as uuid from 'uuid/v4';

type RadioModel = Record<string, any>;

@Component({
    selector: 'de-care-second-radio-lookup',
    templateUrl: './second-radio-lookup.component.html',
    styleUrls: ['./second-radio-lookup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondRadioLookupComponent implements OnChanges {
    readonly findAsecondRadio = 'findAsecondRadio';
    readonly addSecondRadioLater = 'addSecondRadioLater';
    readonly createStreamingAccount = 'createStreamingAccount';

    @ViewChild('areYouSureModal', { static: true })
    areYouSureModal: SxmUiModalComponent;
    @ViewChild('lookupWizardComponent', { static: false })
    lookupWizardComponent: DeviceLookupWizardComponent;
    @ViewChild('confirmRadioModal', { static: true })
    confirmRadioModal: SxmUiModalComponent;
    @ViewChild('notEligibleRadio', { static: true })
    notEligibleRadio: SxmUiModalComponent;
    @ViewChild('validateUserRadioModal', { static: true }) validateUserRadioModal: SxmUiModalComponent;

    // @ViewChild('streamingAccountSearch') private readonly _streamingAccountSearch: StreamingAccountCredentialsAndLookupStepComponent;
    @ViewChild('accountSearchModal') private readonly _accountSearchModal: SxmUiModalComponent;

    currentLang$ = this._translateService.onLangChange.pipe(
        startWith({ lang: this._translateService.currentLang }),
        map((ev) => ev.lang)
    );

    currentLangIsFrench$ = this.currentLang$.pipe(map((lang) => lang === LANGUAGE_CODES.FR_CA));
    currentLangIsNotFrench$ = this.currentLangIsFrench$.pipe(map((isFrench) => !isFrench));

    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeVipModule.SecondRadioLookupComponent.';

    form = this._fb.group({
        selectedRadio: [],
    });

    translationOverrides = require('./second-radio-lookup-translations-overrides.json');

    displayedVehicles: Device[] = [];
    moreVehicles: Device[] = [];
    secondRadioToConfirm: RadioModel;
    optionBeenSelectedFlag: boolean;
    validateRadioModalAriaDescribedbyTextId = uuid();

    @Input()
    secondVehicles: Device[];

    @Input()
    streamingAccounts: Streaming[];

    @Input()
    couldSkipRadioSelection = true;
    @Input()
    radioIdToValidate: string;

    @Input()
    isLoading = false;

    @Input()
    displayValidateUserRadioModal = false;

    @Input()
    enablePVIPStreamingFlag: boolean;

    @Output()
    continue = new EventEmitter<DeviceType>();

    constructor(private readonly _translateService: TranslateService, private readonly _fb: FormBuilder, private readonly _store: Store) {}

    ngOnChanges() {
        if (this.secondVehicles?.length > 0) {
            this.displayedVehicles = this.secondVehicles.slice(0, 3);
            this.moreVehicles = this.secondVehicles.slice(3);
        }
    }

    onContinue() {
        this._store.dispatch(setIsStreaming({ isStreaming: false }));
        const subscription = this.form.value.selectedRadio;
        if (subscription?.userName || subscription?.maskedUserName) {
            this._store.dispatch(setIsStreaming({ isStreaming: true }));
            this._store.dispatch(setStreamingAccount({ streamingAccount: subscription }));
            this.continue.emit({ streaming: subscription });
        } else if (!subscription && this.couldSkipRadioSelection) {
            this.onAddSecondRadioLater();
        } else if (subscription === this.findAsecondRadio) {
            this.onFindASecondRadio();
        } else if (subscription === this.addSecondRadioLater) {
            this.onAddSecondRadioLater();
        } else if (subscription === this.createStreamingAccount) {
            this.openSearchModal();
        } else {
            const selectedSecondRadio = this._findSecondRadioByLast4Digits(subscription);
            this.continue.emit({ device: selectedSecondRadio });
        }
    }

    openSearchModal() {
        this._accountSearchModal.open();
        this._store.dispatch(setIsStreaming({ isStreaming: true }));
    }

    setStreamingAfterContinueAccount(streamingAccount) {
        const account: Streaming = streamingAccount;
        this._store.dispatch(setStreamingAccount({ streamingAccount: account }));
        this.continue.emit({ streaming: account });
        this._accountSearchModal.close();
    }
    onAddSecondRadioLater() {
        this._openAreYouSureModal();
    }

    onFindASecondRadio() {
        this._openLookupWizardComponent();
    }

    radioButtonSelected() {
        this.optionBeenSelectedFlag = true;
    }

    shouldDisableContinueButton() {
        return {
            disabled: !this.couldSkipRadioSelection && !this.optionBeenSelectedFlag,
        };
    }

    onSelectionFinished(data: DeviceLookupWizardOutput) {
        // TODO: this logic must be handled by MS, update it once the service is working
        const accountHasSubscriptions = data.selectedAccount?.subscriptions?.[0];
        if (accountHasSubscriptions) {
            this._openNotEligibleRadioModal();
        } else if (this.displayValidateUserRadioModal) {
            this.secondRadioToConfirm = data.selectedRadio;
            this.validateUserRadioModal.open();
            this._openConfirmRadioModal();
        } else {
            this.secondRadioToConfirm = data.selectedRadio;
            this._openConfirmRadioModal();
        }
    }

    onContinueWithOneInAreYouSureModal() {
        this.continue.emit(null);
        this.areYouSureModal.close();
    }

    onNoAccountFound(data: DeviceLookupWizardOutput) {
        this.secondRadioToConfirm = data.selectedRadio;
        if (this.displayValidateUserRadioModal) {
            this.validateUserRadioModal.open();
        } else {
            this._openConfirmRadioModal();
        }
    }

    onChooseASecondRadioFromAreYouSureModal() {
        this.areYouSureModal.close();
        this._onChooseASecondRadio();
    }

    onContinueFromConfirmRadioModal() {
        this.confirmRadioModal.close();
        const secondRadio = this.secondRadioToConfirm;
        this.continue.emit({
            device: {
                radioId: secondRadio.last4DigitsOfRadioId,
                status: 'CLOSED',
                vehicle: {
                    ...secondRadio.vehicleInfo,
                    year: secondRadio.vehicleInfo.year as number,
                },
            },
            isJustFound: true,
        });
    }

    onContinueWithOneInNotEligibleRadioModal() {
        this.continue.emit(null);
        this.notEligibleRadio.close();
    }

    onChooseASecondRadioFromNotEligibleRadioModal() {
        this.notEligibleRadio.close();
        this._onChooseASecondRadio();
    }

    onValidateUserBackButton() {
        this.validateUserRadioModal.close();
    }

    onValidUserInfoFromValidateUserRadio() {
        this.validateUserRadioModal.close();
        this._openConfirmRadioModal();
    }

    private _openAreYouSureModal() {
        this.areYouSureModal.open();
        this._store.dispatch(
            behaviorEventImpressionForComponent({
                componentName: 'Overlay:continueWithOne',
            })
        );
    }

    private _openLookupWizardComponent() {
        this.lookupWizardComponent.open();
        this._store.dispatch(
            behaviorEventImpressionForComponent({
                componentName: 'Overlay:DontSeeYourRadio',
            })
        );
    }

    private _findSecondRadioByLast4Digits(radioId: string) {
        return this.secondVehicles.find((radio) => radio.radioId === radioId);
    }

    private _openNotEligibleRadioModal() {
        this.notEligibleRadio.open();
        this._store.dispatch(
            behaviorEventImpressionForComponent({
                componentName: 'Overlay:vipIneligible',
            })
        );
    }

    private _openConfirmRadioModal() {
        this.confirmRadioModal.open();
        this._store.dispatch(
            behaviorEventImpressionForComponent({
                componentName: 'Overlay:confirmSecondRadio',
            })
        );
    }

    private _onChooseASecondRadio() {
        if (!this.secondVehicles.length) {
            this._openLookupWizardComponent();
        }
    }
}
