import { convertObjectToUrlQueryParamsString, QueryParamMap } from '@de-care/browser-common';
import { Component, Inject, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { RflzFormComponentPresentation, RflzRadioFoundEvent } from '@de-care/identification';
import { ElementsNavigationService } from '../elements-navigation.service';
import { ContestParams } from '@de-care/data-services';
import { ElementsSettings, ElementsSettingsToken } from '../elements-settings-token';
import { DOCUMENT } from '@angular/common';
import { SettingsService } from '@de-care/settings';
import { PlanTypeEnum } from '@de-care/domains/account/state-account';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { RecoverRadioIdFromTokenWorkflowService } from '@de-care/domains/device/state-device-info';
import { Subject } from 'rxjs';
import { catchError, map, delay, switchMap, takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'sxm-rflz-widget',
    templateUrl: './rflz-widget.component.html',
    styleUrls: ['./rflz-widget.component.scss'],
})
export class RflzWidgetComponent implements OnInit, OnDestroy {
    sweepstakesEligible = false; // passed into RFLZ form component
    programCode: string; // passed into RFLZ form component
    isCanada = this._settingsService.isCanadaMode;
    openLicensePlateSearch: boolean = false;
    rflzFormPresentation: RflzFormComponentPresentation = RflzFormComponentPresentation.Default;
    hideErrorMessagePill: boolean = false;
    dtok: string;
    radioIdFromToken: string;
    tokenServiceComplete = false;
    radioIdOrVin: string;
    private _unsubscribe$ = new Subject<void>();
    private _contestParamsToForward: QueryParamMap | null = null;
    private readonly _window: Window;
    private readonly onsitePromocodes = { ONSITESVC: 'ONSITESVCSTR', CAONSITESVC: 'CAONSITESVCSTR', CAONSITEGEN: 'CAONSITEGENSTR' };

    @Input('disable-license-plate-lookup') disableLicensePlateLookup = false;
    @Input('enable-nfl-opt-in') enableNFLOptIn = false;
    @ViewChild('foundRadioErrorModal', { static: true }) foundRadioErrorModal: SxmUiModalComponent;
    deviceHelpModalAriaDescribedbyTextId = uuid();

    constructor(
        @Inject(DOCUMENT) private readonly _document: Document,
        private readonly _elementsNavigationService: ElementsNavigationService,
        private readonly _store: Store,
        @Inject(ElementsSettingsToken) private readonly _elementsSettings: ElementsSettings,
        private readonly _settingsService: SettingsService,
        private readonly _recoverRadioIdFromTokenWorkflowService: RecoverRadioIdFromTokenWorkflowService
    ) {
        this._window = document.defaultView;
    }

    ngOnInit() {
        const params = this._elementsNavigationService.getQueryParams();

        // Get contestId and contestUrl from queryParams
        const contestIdParamName = ContestParams.contestId;
        const contestId = params[contestIdParamName];

        const contestUrlParamName = ContestParams.contestUrl;
        const contestUrl = params[contestUrlParamName];

        // Does the contestInfo exist?
        const shouldAddContestDetails = contestId && contestUrl && contestUrl.length > 0;

        // Payload to forward if contest info exists
        this._contestParamsToForward = shouldAddContestDetails ? { [contestIdParamName]: contestId, [contestUrlParamName]: contestUrl } : null;

        this.sweepstakesEligible = shouldAddContestDetails; // let the RFLZ form component know

        const existingProgramCode: RegExpMatchArray = (this._document && this._document.defaultView.location.search.match(/programcode=([^&]*)/i)) || [];
        this.programCode = existingProgramCode.length > 1 ? existingProgramCode[1] : null;
        if (this.programCode && this.onsitePromocodes[this.programCode.toUpperCase()]) {
            this.rflzFormPresentation = RflzFormComponentPresentation.Onsite;
            this.hideErrorMessagePill = true;
        }

        const existingDtok: RegExpMatchArray = (this._document && this._document.defaultView.location.search.match(/dtok=([^&]*)/i)) || [];
        this.dtok = existingDtok.length > 1 ? existingDtok[1] : null;
        !!this.dtok && this._getRadioIdFromUrlToken(this.dtok);

        const existingRidVin: RegExpMatchArray = (this._document && this._document.defaultView.location.search.match(/rid_vin=([^&]*)/i)) || [];
        this.radioIdOrVin = existingRidVin.length > 1 ? existingRidVin[1] : null;
    }

    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    onFoundRadio({ last4DigitsOfRadioId, usedCarBrandingType, offerTypeForProgramCode }: RflzRadioFoundEvent) {
        const langParam = this._getLangParam();
        const existingProgramCode: RegExpMatchArray = (this._document && this._document.defaultView.location.search.match(/programcode=([^&]*)/i)) || [];
        const programCode = existingProgramCode.length > 1 ? existingProgramCode[1] : null;
        if (
            programCode &&
            (offerTypeForProgramCode === PlanTypeEnum.RtpOffer ||
                offerTypeForProgramCode === PlanTypeEnum.PromoMCP ||
                offerTypeForProgramCode === PlanTypeEnum.TrialExtensionRTC ||
                offerTypeForProgramCode === PlanTypeEnum.TrialExtension) &&
            usedCarBrandingType !== 'DEMO_USED_CAR'
        ) {
            this._elementsNavigationService.onSuccessNavigateTo(
                this._elementsSettings.nouvRtpUrl,
                convertObjectToUrlQueryParamsString({
                    radioId: last4DigitsOfRadioId,
                    usedCarBrandingType,
                    programCode,
                    ...(langParam && { langpref: langParam }),
                    redirectUrl: this._window.location.href,
                })
            );
        } else {
            this._elementsNavigationService.onSuccessNavigateTo(
                this._elementsSettings.rflzSuccessUrl,
                convertObjectToUrlQueryParamsString({
                    radioId: last4DigitsOfRadioId,
                    usedCarBrandingType,
                    ...(!!this.programCode && { programCode: this.programCode }),
                    ...(langParam && { langpref: langParam }),
                    ...(this.sweepstakesEligible && this._contestParamsToForward),
                    redirectUrl: this._window.location.href,
                })
            );
        }
    }

    redirectToStreaming() {
        const langParam = this._getLangParam();
        this._elementsNavigationService.onSuccessNavigateTo(
            this._elementsSettings.rflzNotEligibleStreamingUrl,
            convertObjectToUrlQueryParamsString({
                programCode: this.onsitePromocodes[this.programCode.toUpperCase()],
                dataFromRflz: 'e',
                langpref: langParam,
            })
        );
    }

    onFoundRadioError(errorCode: string) {
        if (errorCode !== '3494' && this.rflzFormPresentation === RflzFormComponentPresentation.Onsite) {
            this.foundRadioErrorModal.open();
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Overlay:onsiteIneligible' }));
        }
    }

    onRedirectError(errorCode: string): void {
        if (this.rflzFormPresentation !== RflzFormComponentPresentation.Onsite || errorCode === '3494') {
            if (errorCode === '3494' || errorCode === '103' || errorCode === '5035') {
                this._organicVanityUrlRedirect(errorCode);
            } else {
                this._flepzVanityUrlRedirect(errorCode);
            }
        } else {
            this.onFoundRadioError(errorCode);
        }
    }

    private _flepzVanityUrlRedirect(errorCode: string): void {
        const langParam = this._getLangParam();
        this._elementsNavigationService.onSuccessNavigateTo(
            this._elementsSettings.rflzErrorCodeFlepzRedirectUrl,
            convertObjectToUrlQueryParamsString({
                errorCode,
                langpref: langParam,
            })
        );
    }

    private _organicVanityUrlRedirect(errorCode: string): void {
        const langParam = this._getLangParam();
        this._elementsNavigationService.onSuccessNavigateTo(
            this._elementsSettings.rflzErrorCodeStreamingRedirectUrl,
            convertObjectToUrlQueryParamsString({
                errorCode,
                langpref: langParam,
            })
        );
    }

    private _getLangParam() {
        const existingLangParam = (this._document && this._document.defaultView.location.search.match(/langpref=([^&]*)/i)) || [];
        if (existingLangParam && existingLangParam.length > 0) {
            return existingLangParam[1];
        }
        return;
    }

    private _getRadioIdFromUrlToken(deviceToken: string) {
        return this._recoverRadioIdFromTokenWorkflowService
            .build({ token: deviceToken })
            .pipe(
                map(({ last4DigitsOfRadioId }) => last4DigitsOfRadioId),
                switchMap((resp) => {
                    this.radioIdFromToken = resp;
                    return resp;
                }),
                // time to ensure the form will contain the masked RID in the input avoiding the customer to see an empty space
                delay(400),
                takeUntil(this._unsubscribe$),
                // if error pass a string, so the rflz form will require the RID hidding the de-tokenization error
                catchError(() => 'error')
            )
            .subscribe(() => {
                this.tokenServiceComplete = true;
            });
    }
}
