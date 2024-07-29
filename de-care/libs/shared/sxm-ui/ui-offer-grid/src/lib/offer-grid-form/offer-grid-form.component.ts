import { Component, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgForm } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { WithoutPlatformNamePipe } from '@de-care/shared/sxm-ui/ui-without-platform-name-pipe';
import { TranslateService } from '@ngx-translate/core';

export interface OfferData {
    selected: boolean;
    name: string;
    planCode: string;
    priceText: string;
    calloutText?: string;
    channelCountText?: string;
    adFreeChannelCountText?: string;
    features: OfferFeatureData[];
    channelLineupLink?: { text: string; url: string };
    packageName?: string;
}

export interface OfferFeatureData {
    name: string;
    tooltipText?: string;
}

interface FeatureRow extends OfferFeatureData {
    offerFlags: boolean[];
}

export type OfferGridFormComponentApi = {
    reset: () => void;
};

@Component({
    selector: 'sxm-ui-offer-grid-form',
    templateUrl: './offer-grid-form.component.html',
    styleUrls: ['./offer-grid-form.component.scss'],
})
export class OfferGridFormComponent implements AfterViewInit, OnChanges, OfferGridFormComponentApi {
    @ViewChild('form') private readonly _ngForm: NgForm;
    @Input() offers: OfferData[];
    @Input() textCopy: {
        priceRowText?: string;
        channelCountRowLabelInfo?: { text: string; tooltipText?: string };
        adFreeChannelCountRowLabelInfo?: { text: string; tooltipText?: string };
        channelLineupRowLabelInfo?: { text: string; tooltipText?: string };
        continueButtonText?: string;
    };
    @Output() submitted = new EventEmitter<string>();
    translateKeyPrefix = 'SharedSxmUiUiOfferGridModule.OfferGridFormComponent.';
    prices: string[];
    channelCounts: string[];
    adFreeChannelCounts: string[];
    featureRows: FeatureRow[];
    selectedColumn: number;
    channelLineupLinks: { text: string; url: string }[];
    selectedPackageName: string;

    constructor(private readonly _store: Store, private _withoutPlatformNamePipe: WithoutPlatformNamePipe, private _translateService: TranslateService) {}
    private _destroy$: Subject<boolean> = new Subject<boolean>();
    ngAfterViewInit(): void {
        this.selectedColumn = this.offers.map((offer) => offer.selected === true).indexOf(true);
        this._ngForm?.form.valueChanges
            .pipe(
                filter((form) => !!form.planCode),
                takeUntil(this._destroy$)
            )
            .subscribe((value) => {
                this.selectedColumn = this.offers.map((offer) => offer.planCode).indexOf(value.planCode);
                const packageName = this.offers.find((offer) => offer.planCode === value.planCode)?.packageName;
                if (packageName) {
                    this.selectedPackageName = this._getPackageNameWithoutPlatform(packageName);
                }
            });
    }

    onSubmit() {
        this.submitted.emit(this._ngForm?.form?.value?.planCode);
    }
    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }
    assignData() {
        this.prices = this.offers.map((offer) => offer.priceText);
        this.channelCounts = this.offers.some((offer) => offer.channelCountText) ? this.offers.map((offer) => offer.channelCountText) : [];
        this.adFreeChannelCounts = this.offers.some((offer) => offer.adFreeChannelCountText) ? this.offers.map((offer) => offer.adFreeChannelCountText) : [];
        const moreFeaturesOffer = this.offers.reduce((prevValue, currentValue) => {
            if (!prevValue || prevValue.features.length < currentValue.features.length) {
                return currentValue;
            }
            return prevValue;
        });
        this.featureRows = moreFeaturesOffer.features.map((feature) => ({
            ...feature,
            offerFlags: this.offers.reduce((set, offer) => [...set, offer.features.some((f) => f.name === feature.name)], []),
        }));
        this.channelLineupLinks = this.offers.some((offer) => offer.channelLineupLink) ? this.offers.map((offer) => offer.channelLineupLink) : [];
    }

    ngOnChanges(simpleChanges: SimpleChanges): void {
        if (simpleChanges.offers) {
            this.assignData();
        }
    }

    reset() {
        const selectedOfferIndex = this.offers?.findIndex((offer) => offer.selected);
        if (selectedOfferIndex > -1) {
            this.selectedColumn = selectedOfferIndex;
        }
    }

    private _getPackageNameWithoutPlatform(name): string {
        return this._withoutPlatformNamePipe.transform(this._translateService.instant('app.packageDescriptions.' + name + '.name'), name);
    }
}
