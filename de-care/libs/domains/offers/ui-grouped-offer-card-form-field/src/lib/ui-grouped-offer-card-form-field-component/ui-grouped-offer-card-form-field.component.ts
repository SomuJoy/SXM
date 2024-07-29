import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PackageDescriptionViewModel } from '@de-care/domains/offers/ui-offer-card';
import { Component, ChangeDetectionStrategy, Input, Injector, HostBinding, SimpleChanges } from '@angular/core';
import { Offer } from '@de-care/domains/offers/state-offers';
import { OfferInfo } from '@de-care/domains/offers/ui-offer-description';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { RadioOptionWithTooltipFormFieldSetOption } from '@de-care/shared/sxm-ui/ui-radio-option-with-tooltip-form-field-set';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'ui-grouped-offer-card-form-field',
    templateUrl: './ui-grouped-offer-card-form-field.component.html',
    styleUrls: ['./ui-grouped-offer-card-form-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: UIGroupedOfferCardFormFieldComponent,
            multi: true
        }
    ]
})
export class UIGroupedOfferCardFormFieldComponent extends ControlValueAccessorConnector {
    @Input() isRTC: boolean = false;
    @Input() parentOffer: OfferInfo;
    @Input() packageDescription: PackageDescriptionViewModel;
    @Input() packageOptions: Offer[];
    @Input() excludePriceAndTermDisplay = false;
    @Input() opened = false;
    @Input() selectedRenewalOfferPrice: number;
    @Input() flagPresent: boolean = false;
    @Input() headlinePresent: boolean = false;
    @Input() isCurrentPackage: boolean = false;
    @HostBinding('attr.data-e2e') dataE2E = 'groupedOfferCardFormField';

    private _packageInfoForOptions$ = new BehaviorSubject<{ planCode: string; packageName: string }[]>([]);
    options$: Observable<RadioOptionWithTooltipFormFieldSetOption[]> = combineLatest([
        this._packageInfoForOptions$,
        this._translateService.stream('app.packageDescriptions')
    ]).pipe(
        map(([packageInfoForOptions, packageDescriptions]) =>
            packageInfoForOptions.map(({ packageName, planCode }) => ({
                label: packageDescriptions[packageName].shortName,
                value: planCode,
                tooltipTitle: packageDescriptions[packageName].channels[0].title,
                tooltipText: packageDescriptions[packageName].channels[0].descriptions
            }))
        )
    );

    constructor(injector: Injector, private readonly _translateService: TranslateService) {
        super(injector);
    }

    copyKey = 'uiGroupedOfferCardFormField.uiGroupedOfferCardFormFieldComponent.';

    ngOnChanges(simpleChanges: SimpleChanges) {
        if (simpleChanges.packageOptions) {
            this._packageInfoForOptions$.next(
                simpleChanges.packageOptions.currentValue.map(({ planCode, packageName }) => ({
                    planCode,
                    packageName
                }))
            );
        }
    }
}
