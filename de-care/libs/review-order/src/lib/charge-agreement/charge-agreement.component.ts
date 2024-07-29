import { Component, OnInit, forwardRef, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import * as uuid from 'uuid/v4';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { map, take, takeUntil } from 'rxjs/operators';
import { SharedEventTrackService } from '@de-care/data-layer';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { combineLatest, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getProvinceIsQuebec } from '@de-care/domains/customer/state-locale';

export interface Details {
    etf?: number;
    etfTerm?: number;
    isLongTerm?: boolean;
    isPlatinumVip?: boolean;
}

@Component({
    selector: 'charge-agreement',
    templateUrl: './charge-agreement.component.html',
    styleUrls: ['./charge-agreement.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ChargeAgreementComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => ChargeAgreementComponent),
            multi: true,
        },
    ],
})
export class ChargeAgreementComponent implements OnInit, ControlValueAccessor, Validator, OnDestroy {
    uniqueId: string = uuid();
    currentLang: string = 'en';
    private _checked: boolean = false;

    trackCheckAction: string = 'charge-agreement-check';
    trackComponentName: string = 'charge-agreement';
    copyPart1aKey = 'part1a';
    copyPart3aKey = 'part3';
    copyPart4aKey = 'part4';
    showChangeLanguageLink = true;

    copyPartCardAgreement = 'text';

    @Input() details: Details;

    @Output() checkChange = new EventEmitter<boolean>();

    @Input('checked')
    set checked(value: boolean) {
        this._checked = value;
        this.onTouchedCallback && this.onTouchedCallback();
        this.onChangeCallback && this.onChangeCallback(this._checked);

        this.checkChange.emit(this._checked);

        this._eventTrackService.track(this.trackCheckAction, { componentName: this.trackComponentName, checked: this._checked });
    }

    get checked() {
        return this._checked;
    }

    private onTouchedCallback: () => void;
    private onChangeCallback: (_: any) => void;
    private _unsubscribe: Subject<void> = new Subject();

    constructor(
        private readonly _store: Store,
        private translate: TranslateService,
        private _eventTrackService: SharedEventTrackService,
        private readonly _userSettingsService: UserSettingsService,
        public settingsService: SettingsService
    ) {}

    ngOnInit() {
        if (this.settingsService.isCanadaMode) {
            this.showChangeLanguageLink = false;
            // NOTE: Hotfix to support legacy quebec check until legacy code can be fully removed.
            //This aggregates together both sources and if either are true then in Quebec.
            combineLatest([this._store.pipe(select(getProvinceIsQuebec)), this._userSettingsService.isQuebec$])
                .pipe(
                    map(([isQuebecFromState, isQuebecFromLegacy]) => isQuebecFromState || isQuebecFromLegacy),
                    takeUntil(this._unsubscribe)
                )
                .subscribe((val) => {
                    this.copyPart1aKey = val ? 'part1a_QUEBEC' : 'part1a';
                    this.copyPart3aKey = val ? 'part3_QUEBEC' : 'part3';
                    this.copyPart4aKey = val ? 'part4_QUEBEC' : 'part4';
                    this.copyPartCardAgreement = val ? 'text_QUEBEC' : 'text';
                });
        }
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    writeValue(value: boolean) {
        this._checked = value;
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    changeLanguage($event: Event) {
        $event.preventDefault();
        // TODO: figure out how this is going to work with the app as a whole being able to change language
        this.translate
            .get(`reviewOrder.chargeAgreementComponent.${this.details && this.details.etf ? 'copy_etf' : 'copy'}.${this.currentLang}.languagelink`)
            .pipe(take(1))
            .subscribe((value) => {
                this.currentLang = value;
            });
    }

    validate(c: FormControl) {
        if (this._checked) {
            return null;
        } else {
            return {
                ChargeAgreement: {
                    valid: false,
                },
            };
        }
    }
}
