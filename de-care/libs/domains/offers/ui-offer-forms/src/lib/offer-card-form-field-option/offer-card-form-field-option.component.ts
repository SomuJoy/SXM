import { Component, HostBinding, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';

interface OfferOptionPackageDataIcon {
    isActive: boolean;
    label: string;
}

export interface OfferOptionPackageData {
    packageName: string;
    priceAndTermDescTitle: string;
    processingFeeDisclaimer: string;
    icons: {
        inside: OfferOptionPackageDataIcon;
        outside: OfferOptionPackageDataIcon;
        pandora: OfferOptionPackageDataIcon;
        perks?: OfferOptionPackageDataIcon;
        vip?: OfferOptionPackageDataIcon;
    };
    highlightsText: string[];
    footer: string;
    theme: string;
    presentation: string;
    longDescription?: string;
    packageFeatures?: {
        packageName: string;
        features: {
            name: string;
            tooltipText: string;
            shortDescription: string;
            learnMoreLinkText: string;
            learnMoreInformation: string;
        }[];
    }[];
}

export interface OfferOption {
    headlineFlagCopy?: string;
    ariaLabel?: string;
    fieldLabel: string;
    optionsHeaderCopy?: string;
    planCodeOptions: {
        planCode: string;
        optionLabel?: string;
        optionLabelTooltipText?: string;
    }[];
    packageData: OfferOptionPackageData;
}

@Component({
    selector: 'offer-card-form-field-option',
    templateUrl: './offer-card-form-field-option.component.html',
    styleUrls: ['./offer-card-form-field-option.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: OfferCardFormFieldOptionComponent,
            multi: true,
        },
    ],
})
export class OfferCardFormFieldOptionComponent extends ControlValueAccessorConnector {
    @Input() offerOptionData: OfferOption;
    @Input() hideHead = false;
    @HostBinding('attr.data-test') dataTest = 'offerCardFormFieldOption';
}
