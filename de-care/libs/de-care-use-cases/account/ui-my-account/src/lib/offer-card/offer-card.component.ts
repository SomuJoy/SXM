import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { OfferDestinationType, OfferProfileType, DeviceIdentifierType } from '@de-care/de-care-use-cases/account/state-my-account';
import { OfferDetailsData } from '@de-care/shared/sxm-ui/marketing/ui-marketing';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface OfferCardData {
    title: string;
    subtitle?: string;
    legalCopy?: string;
    destination: OfferDestinationType;
    subscriptionId?: string;
    overwriteCopy: boolean;
    offerProfile: OfferProfileType;
    radioId: string;
    accountNumberLast4Digits: string;
    deviceData: DeviceData;
}

interface DeviceData {
    type: DeviceIdentifierType;
    identifier: string;
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'my-account-offer-card',
    templateUrl: './offer-card.component.html',
    styleUrls: ['./offer-card.component.scss'],
})
export class OfferCardComponent implements ComponentWithLocale, OnInit, OnChanges, OnDestroy {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Input() data: OfferCardData;
    @Output() offerCtaClicked = new EventEmitter();
    offerDetailsData: OfferDetailsData;
    offerDetailsAvailable: boolean;
    offerProfileDestination: string; //used when the offer profile in the translate files overwrites the destination
    private readonly _destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
		this.offerDetailsAvailable = false;
        this.translationsForComponentService.currentLang$.pipe(takeUntil(this._destroy$)).subscribe(() => {
            this._assembleOfferData();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.data) {
            this._assembleOfferData();
        }
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    private _assembleOfferData() {
        if (this.data?.offerProfile) {
            const offerProfileTranslation = this.translateKeyPrefix + '.OFFER_PROFILES.';
            const buttonLabel = this.translationsForComponentService.instant(offerProfileTranslation + this.data?.offerProfile + '.LABEL');
            let copyOverwriteData = {};
            
            if (!this.translationsForComponentService.hasKey(offerProfileTranslation + this.data?.offerProfile)) {
				this.offerDetailsData = null;
				this.offerDetailsAvailable = false;
			} else {
	            // Inject copy for offers not in CMS
	            if (this.data.overwriteCopy) {
	                copyOverwriteData = {
	                    title: this.translationsForComponentService.instant(offerProfileTranslation + this.data?.offerProfile + '.TITLE', {
	                        device: this.translationsForComponentService.instant(
	                            offerProfileTranslation + this.data?.offerProfile + '.DEVICE_MAP.' + this.data?.deviceData?.type,
	                            {
	                                identifier: this.data?.deviceData?.identifier,
	                            }
	                        ),
	                    }),
	                    subtitle: this.translationsForComponentService.instant(offerProfileTranslation + this.data?.offerProfile + '.SUBTITLE', {
	                        device: this.translationsForComponentService.instant(
	                            offerProfileTranslation + this.data?.offerProfile + '.DEVICE_MAP.' + this.data?.deviceData?.type,
	                            {
	                                identifier: this.data?.deviceData?.identifier,
	                            }
	                        ),
	                    }),
	                    legalCopy: this.translationsForComponentService.instant(offerProfileTranslation + this.data?.offerProfile + '.LEGAL_COPY'),
	                };
	
	                if (this.translationsForComponentService.hasKey(offerProfileTranslation + this.data?.offerProfile + '.DESTINATION')) {
	                    this.offerProfileDestination = this.translationsForComponentService.instant(offerProfileTranslation + this.data?.offerProfile + '.DESTINATION');
	                }
	            }
	            this.offerDetailsData = { ...this.data, ...copyOverwriteData, buttonLabel };
	            this.offerDetailsAvailable = true;
            }
        }
    }

    onCtaClicked() {
        const destinationTranslation = this.offerProfileDestination
            ? this.translateKeyPrefix + '.OFFER_DESTINATIONS.' + this.offerProfileDestination
            : this.translateKeyPrefix + '.OFFER_DESTINATIONS.' + this.data?.destination;
        const routerLink = this.translationsForComponentService.instant(destinationTranslation + '.ROUTER_LINK');
        const url = this.translationsForComponentService.instant(destinationTranslation + '.URL');
        const queryParams = this.translationsForComponentService.instant(destinationTranslation + '.QUERY_PARAMS');
        const offerState = this.translationsForComponentService.instant(destinationTranslation + '.STATE');
        let params = {};
        // convert queryParams array into object with values interpolated
        if (Array.isArray(queryParams)) {
            params = queryParams
                .map((item, i) => ({
                    key: item.KEY,
                    value: this.translationsForComponentService.instant(destinationTranslation + '.QUERY_PARAMS.' + i + '.VALUE', {
                        // all possible values needed for interpolation
                        subscriptionId: this.data.subscriptionId,
                        programCode: this.translationsForComponentService.instant(this.translateKeyPrefix + '.OFFER_PROFILES.' + this.data?.offerProfile + '.PROGRAM_CODE'),
                        radioId: this.data.radioId,
                        last4DigitsOfAccountNumber: this.data.accountNumberLast4Digits,
                    }),
                }))
                .reduce((map, entry) => ((map[entry.key] = entry.value), map), {});
        }
        let state = {};
        if (Array.isArray(offerState)) {
            state = offerState
                .map((item, i) => ({
                    key: item.KEY,
                    value: this.translationsForComponentService.instant(destinationTranslation + '.STATE.' + i + '.VALUE', {
                        radioId: this.data.radioId,
                    }),
                }))
                .reduce((map, entry) => ((map[entry.key] = entry.value), map), {});
        }
        this.offerCtaClicked.emit({ routerLink, url, params, state });
    }
}
