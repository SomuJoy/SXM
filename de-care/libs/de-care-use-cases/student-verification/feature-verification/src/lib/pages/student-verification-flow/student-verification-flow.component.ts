import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil, tap, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import {
    getSheerIdIdentificationWidgetUrl,
    loadFollowOnOffersForStreamingFromPlanCode,
    Offer,
    pageDataFinishedLoading,
    selectFirstFollowOnOffer,
    selectOffer,
    studentVerificationVM,
} from '@de-care/de-care-use-cases/student-verification/state-verification';
import { getOfferDetails } from '@de-care/domains/offers/state-offers';

@Component({
    selector: 'de-care-student-verification-flow',
    templateUrl: './student-verification-flow.component.html',
    styleUrls: ['./student-verification-flow.component.scss'],
})
export class StudentVerificationFlowComponent implements OnInit, OnDestroy {
    langPref: string;
    programCode: string;
    offer$: Observable<Offer>;
    offerDetails;
    off$ = this._store.select(getOfferDetails);
    vm$ = this._store.pipe(select(studentVerificationVM));
    sheerIdIdentificationWidgetUrl$ = this._store.pipe(select(getSheerIdIdentificationWidgetUrl));
    private _destroy$ = new Subject<boolean>();

    constructor(private _store: Store<any>, private _route: ActivatedRoute, private _translateService: TranslateService) {}

    ngOnInit() {
        this._getRouteData();
        this._listenForLangChange();
        this.offer$ = combineLatest([this._store.pipe(select(selectOffer)), this._store.pipe(select(selectFirstFollowOnOffer))]).pipe(
            tap(([offer, followOnOffer]) => {
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
                    offerType: offer.type,
                    followOnPrice: followOnOffer ? followOnOffer.price : null,
                    followOnTermLength: followOnOffer ? followOnOffer.termLength : null,
                    marketType: offer.marketType,
                    isStudentOffer: offer.student,
                };
                if (offer && offer.student && offer.type === 'RTP_OFFER' && !followOnOffer) {
                    this._store.dispatch(loadFollowOnOffersForStreamingFromPlanCode({ planCode: offer.planCode }));
                }
            }),
            map(([offer]) => offer)
        );
        this._store.dispatch(pageDataFinishedLoading());
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    private _getRouteData(): void {
        const langPref = this._route.snapshot.data.studentData.langPref;
        const programCode = this._route.snapshot.data.studentData.programCode;
        this.langPref = langPref ? langPref : '';
        this.programCode = programCode ? programCode : '';
    }

    private _listenForLangChange(): void {
        this._translateService.onLangChange.pipe(takeUntil(this._destroy$)).subscribe((langChangeEvent) => (this.langPref = this.getLangKey(langChangeEvent.lang)));
    }
    private getLangKey(langPref: string) {
        return langPref.split('-')[0];
    }
}
