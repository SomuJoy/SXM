import { Component, Input, OnChanges, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { CurrencyPipe, I18nPluralPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    SettingsService,
    CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT,
    CURRENCY_PIPE_ZERO_DECIMAL_NUMBER_FORMAT,
    CURRENCY_PIPE_OPTIONAL_DECIMAL_NUMBER_FORMAT,
    UserSettingsService,
} from '@de-care/settings';

export interface TitleInput {
    price: string;
    termLength: number;
    monthlyPrice: string;
    platForm: string;
    pluralizedMonth?: string;
    perMonth?: string;
    planType: string;
    planNameSuffix?: string;
}

export enum HeroTitleTypeEnum {
    Get = 'GET',
    Keep = 'KEEP',
    TrialExtension = 'TRIAL_EXTENSION',
    Advantage = 'ADVANTAGE',
    Streaming = 'STREAMING',
    Thanks = 'THANKS',
    ThanksStreaming = 'THANKS_STREAMING',
    PromoDeal = 'PROMO_DEAL',
    Renewal = 'RENEWAL',
    RTC = 'RTC',
    UpgradePromo = 'UPGRADE_PROMO',
    Hulu = 'HULU',
    OrganicStreamingOnly = 'ORGANIC_STREAMING_ONLY',
    PickAPlan = 'PICK_A_PLAN',
    StudentPlan = 'STREAMING_STUDENT',
}

@Component({
    selector: 'hero-component',
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.scss'],
    providers: [CurrencyPipe, I18nPluralPipe],
})
export class HeroComponent implements OnChanges, OnInit, OnDestroy {
    @Input() isFreeOffer: boolean = false;
    @Input() heroTitleType: string;
    @Input() price: any;
    @Input() pricePerMonth: any;
    @Input() termLength: any;
    @Input() platform: string;
    @Input() packageName: string;
    @Input() showImage = false;
    // TODO: Rename this something more descriptive of it's use which is a pre-parsed string for the title
    @Input() headerState: string;
    @Input() headerStateSubtitle: string;
    @Input() isMCP: boolean;
    @Input() promoDealType: string;
    @Input() promoEndDate: string;
    @Input() alignLeftMediumUp = false;
    @Input() isMilitary = false;
    @HostBinding('class.renewal') isRenewal = false;
    title: string;
    imageTranslateResource: string = 'domainsOffersUiHeroModule.heroComponent.IMAGES.THANKS_DEFAULT';
    titleInput: TitleInput;
    subtitle: string;
    autoWidthTitle = false;

    private _unsubscribe: Subject<void> = new Subject();

    constructor(
        private translateService: TranslateService,
        private _settingsService: SettingsService,
        private _userSettingsService: UserSettingsService,
        private currencyPipe: CurrencyPipe,
        private _i18nPluralPipe: I18nPluralPipe
    ) {}

    ngOnInit() {
        this.isRenewal = this.heroTitleType === HeroTitleTypeEnum.Renewal;
        this.translateService.onLangChange.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this.updateTitle();
        });
    }

    ngOnChanges() {
        this.updateTitle();
        if (this.showImage) {
            if (this.heroTitleType === HeroTitleTypeEnum.ThanksStreaming && !this.isMilitary) {
                this.imageTranslateResource = 'domainsOffersUiHeroModule.heroComponent.IMAGES.THANKS_STREAMING';
            } else if (this.isMilitary) {
                this.imageTranslateResource = 'domainsOffersUiHeroModule.heroComponent.IMAGES.THANKS_MILITARY';
            }
        }
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private isCanadaTrialExtension(): boolean {
        return this.heroTitleType === HeroTitleTypeEnum.TrialExtension && this._settingsService.isCanadaMode;
    }

    private hasPromoDeal(): boolean {
        return this.promoDealType && this.promoDealType in this.translateService.instant('domainsOffersUiHeroModule.heroComponent.TITLE.PROMO_DEAL');
    }

    private updateTitle(): void {
        // The code below preserves the 'hierarchy' of precedence to determine a title
        const isQuebec = this._userSettingsService.isQuebec();
        const quebecKeyString = isQuebec ? '_QUEBEC' : '';
        let subtitleExtraKey = '';
        this.autoWidthTitle = false;

        if (this.headerState) {
            // Provided text is already localized/translated
            this.title = this.headerState;
            this.titleInput = null;
        } else {
            const base = 'domainsOffersUiHeroModule.heroComponent.TITLE.';
            let key = base + 'DEFAULT';
            let priceFormat = CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT;
            if (this.heroTitleType === HeroTitleTypeEnum.UpgradePromo && !this.hasPromoDeal()) {
                priceFormat = CURRENCY_PIPE_OPTIONAL_DECIMAL_NUMBER_FORMAT;
            } else if (this.isCanadaTrialExtension()) {
                priceFormat = CURRENCY_PIPE_ZERO_DECIMAL_NUMBER_FORMAT;
            }
            // values include defaults to ensure no RTEs
            const isAdvantagePlan = this.heroTitleType === HeroTitleTypeEnum.Advantage;
            const isAnnualAdvantagePlan = isAdvantagePlan && this.termLength > 0 && this.termLength % 12 === 0;
            const monthlyPriceRounded = Math.ceil(this.pricePerMonth || 0);
            const monthlyPrice = this.currencyPipe.transform(monthlyPriceRounded, 'USD', 'symbol-narrow', '1.0', this.translateService.currentLang);
            const price = this.currencyPipe.transform(this.price || 0, 'USD', 'symbol-narrow', priceFormat, this.translateService.currentLang);
            const pluralMonthMap = this.translateService.instant('domainsOffersUiHeroModule.heroComponent.PLURAL_MAP.MONTH');
            const planType = this.translateService.instant('app.packageDescriptions.' + this.packageName + '.name');
            this.titleInput = {
                platForm: this.heroTitleType === HeroTitleTypeEnum.Streaming ? 'SiriusXM' : this.platform || '', //if streaming, platform has to be SiriusXM
                price,
                termLength: this.termLength || '',
                monthlyPrice,
                planType,
                pluralizedMonth: this._i18nPluralPipe.transform(this.termLength, pluralMonthMap),
                perMonth: this.isMCP || isAdvantagePlan ? this.translateService.instant('domainsOffersUiHeroModule.heroComponent.PER_MONTH_COPY') : '',
            };

            //check if specific promo deal copy exists
            if (this.heroTitleType !== HeroTitleTypeEnum.UpgradePromo && this.hasPromoDeal()) {
                if (this._settingsService.isCanadaMode || this.promoDealType !== 'AMZ_DOT') {
                    this.heroTitleType = HeroTitleTypeEnum.PromoDeal;
                } else if (this.heroTitleType === HeroTitleTypeEnum.Streaming) {
                    this.heroTitleType = HeroTitleTypeEnum.PromoDeal;
                }
            }

            switch (this.heroTitleType) {
                case HeroTitleTypeEnum.Thanks:
                case HeroTitleTypeEnum.ThanksStreaming:
                case HeroTitleTypeEnum.TrialExtension:
                case HeroTitleTypeEnum.PickAPlan:
                case HeroTitleTypeEnum.Streaming:
                case HeroTitleTypeEnum.StudentPlan: {
                    key = base + this.heroTitleType;
                    break;
                }
                case HeroTitleTypeEnum.OrganicStreamingOnly: {
                    key = base + this.heroTitleType;
                    break;
                }
                case HeroTitleTypeEnum.UpgradePromo: {
                    this.autoWidthTitle = true;
                    const dealType = this.promoDealType ? '_' + this.promoDealType : '';
                    key = base + 'PROMO_UPGRADE' + dealType + quebecKeyString;
                    this.isMCP && (subtitleExtraKey = '_MCP');
                    break;
                }
                case HeroTitleTypeEnum.PromoDeal: {
                    const planNameSuffix = planType.split(' ').slice(1).join(' '); //Platform is always SiriusXM for PANDORA plans as per Business (Req# NLAL-HEROCOPY-GEN-010)
                    this.titleInput.planNameSuffix = planNameSuffix ? planNameSuffix : '';
                    key = base + this.heroTitleType + '.' + this.promoDealType;
                    break;
                }
                case HeroTitleTypeEnum.Get: {
                    key = base + 'GET_PLATFORM';
                    break;
                }
                case HeroTitleTypeEnum.Advantage: {
                    key = base + 'ADVANTAGE' + (isAnnualAdvantagePlan ? '_ANNUAL' : '');
                    break;
                }
                case HeroTitleTypeEnum.Keep:
                default: {
                }
            }
            this.title = this.translateService.instant(key, this.titleInput);
            const subtitleKey = key + subtitleExtraKey + '_SUBTITLE';
            const subTitleTranslation = this.translateService.instant(subtitleKey, this.titleInput);
            if (subTitleTranslation !== subtitleKey) {
                this.subtitle = subTitleTranslation;
            }
        }
        if (this.headerStateSubtitle) {
            this.subtitle = this.headerStateSubtitle;
        }
    }
}
