import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';

import {
    Offer,
    pageDataFinishedLoading,
    selectOffer,
    selectStudentReverificationPageData,
    StudentReVerificationFlowPageState,
    studentReVerificationVM,
} from '@de-care/de-care-use-cases/student-verification/state-reverification';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { getBaseLocationUrl } from '../../url-helpers';

const redirectUrlPath = 'student/re-verify/confirm';
const CURRENCY_PIPE_OPTIONAL_DECIMAL_NUMBER_FORMAT = '1.0-2';
interface StudentReVerificationData {
    programCode: string;
    tkn: string;
    redirectUrl: string;
    langPref: string;
}

@Component({
    selector: 'de-care-student-reverification-flow',
    templateUrl: './student-reverification-flow.component.html',
    styleUrls: ['./student-reverification-flow.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentReverificationFlowComponent implements OnInit, OnDestroy {
    lang: string;
    offer$: Observable<Offer>;
    offerDetails;
    vm$ = this._store.pipe(select(studentReVerificationVM));
    priceFormat = CURRENCY_PIPE_OPTIONAL_DECIMAL_NUMBER_FORMAT;
    studentReVerificationData;
    pageState = this._store.select(selectStudentReverificationPageData);
    private _destroy$ = new Subject<boolean>();
    translateKeyPrefix = 'deCareUseCasesStudentVerificationFeatureReverification.studentReverificationFlowComponent';

    constructor(private _store: Store<any>, private _route: ActivatedRoute, private _translateService: TranslateService) {}

    ngOnInit() {
        this._listenForPageData();
        this._listenForLangChange();
        this.offer$ = this._store.pipe(
            select(selectOffer),
            tap((offer) => {
                // TODO: tap will be removed in refactor: DEX-14222
                this.offerDetails = offer && {
                    type: offer.deal ? offer.deal.type : offer.type,
                    offerTotal: offer.price,
                    processingFee: offer.processingFee,
                    msrpPrice: offer.msrpPrice,
                    name: offer.packageName,
                    offerTerm: offer.termLength,
                    offerMonthlyRate: offer.pricePerMonth,
                    savingsPercent: Math.floor(((offer.retailPrice - offer.pricePerMonth) / offer.retailPrice) * 100),
                    retailRate: offer.retailPrice,
                    etf: offer.deal && offer.deal.etfAmount,
                    etfTerm: offer.deal && offer.deal.etfTerm,
                    priceChangeMessagingType: offer.priceChangeMessagingType,
                    isStreaming: this._route.snapshot.data.isStreaming,
                    deal: offer.deal,
                    isMCP: offer.type === 'PROMO_MCP',
                    isLongTerm: offer.type === 'LONG_TERM',
                    marketType: offer.marketType,
                    isStudentOffer: offer.student,
                    offerType: offer.type,
                };
            })
        );

        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'authentication', componentKey: 'studentReverificationSheerIDLandingPage' }));
        this._store.dispatch(pageDataFinishedLoading());
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    private _buildRedirectUrl(tkn: string, programCode: string, langPref: string) {
        const base = getBaseLocationUrl();
        return base + redirectUrlPath;
    }

    private _setSheerIDData(state: StudentReVerificationFlowPageState): void {
        const { langPref, programCode, tkn } = state;
        this.studentReVerificationData = {
            langPref,
            programCode,
            tkn,
            redirectUrl: this._buildRedirectUrl(tkn, programCode, langPref),
        };
    }

    private _listenForPageData(): void {
        this.pageState.pipe(takeUntil(this._destroy$)).subscribe(this._setSheerIDData.bind(this));
    }

    private _listenForLangChange(): void {
        this._translateService.onLangChange.pipe(takeUntil(this._destroy$)).subscribe((langChangeEvent) => {
            this.lang = langChangeEvent.lang;
            const langPref = this.lang.split('-')[0];
            this.studentReVerificationData = {
                ...this.studentReVerificationData,
                langPref,
            };
            this.priceFormat = CURRENCY_PIPE_OPTIONAL_DECIMAL_NUMBER_FORMAT;
        });
    }
}
