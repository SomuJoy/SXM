import { Component, Input, OnChanges, OnDestroy, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ComponentNameEnum, DataLayerActionEnum } from '@de-care/data-services';
import { UserSettingsService } from '@de-care/settings';
import { SharedEventTrackService } from '@de-care/data-layer';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ReviewSubscriptionOptions {
    selectedRenewalPackageName: string;
    monthlyPrice: number;
    endDate: string;
}

@Component({
    selector: 'review-subscription-options',
    templateUrl: './review-subscription-options.component.html',
    styleUrls: ['./review-subscription-options.component.scss']
})
export class ReviewSubscriptionOptionsComponent implements OnInit, OnChanges, OnDestroy {
    dateFormat$: Observable<string>;
    renewalPackageName: string;
    renewalMonthlyPrice: number;
    renewalEndDate: string;
    timezone: string;
    locale: string;
    private _unsubscribe$: Subject<any> = new Subject();

    @Input() renewalPlan: ReviewSubscriptionOptions;
    @Output() optionsModalRequested: EventEmitter<any> = new EventEmitter();

    constructor(private _translateService: TranslateService, private _userSettingsService: UserSettingsService, private _eventTrackService: SharedEventTrackService) {
        this.dateFormat$ = _userSettingsService.dateFormat$;
        this.timezone = null;
        this.locale = _translateService.currentLang;
    }

    ngOnInit() {
        this._listenForLocale();
    }

    private _listenForLocale(): void {
        this._translateService.onLangChange.pipe(takeUntil(this._unsubscribe$)).subscribe((changes: LangChangeEvent) => {
            this.locale = changes.lang;
        });
    }

    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    ngOnChanges(changes: SimpleChanges) {
        const currentRenewalPlan: ReviewSubscriptionOptions = changes.renewalPlan ? changes.renewalPlan.currentValue : null;
        if (currentRenewalPlan) {
            this.renewalPackageName = currentRenewalPlan.selectedRenewalPackageName;
            this.renewalMonthlyPrice = currentRenewalPlan.monthlyPrice;
            this.renewalEndDate = currentRenewalPlan.endDate;
        }
    }

    openModal(): void {
        this.optionsModalRequested.emit();
    }
}
