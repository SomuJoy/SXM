import { Component, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { IconsDataModel } from '@de-care/shared/sxm-ui/ui-package-icons';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import * as uuid from 'uuid/v4';

export interface PackageSatelliteCardFormFieldContent {
    packageName?: string;
    marketingCallout?: string;
    title: string;
    copy: string;
    icons: IconsDataModel;
    descriptionTitle?: string;
    highlights?: string[];
    toggleCollapsed?: string;
    toggleExpanded?: string;
    upsellDeals?: UpsellDealContent[];
}
export interface UpsellDealContent {
    name: string;
    header: string;
    deviceImage?: string;
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-package-satellite-upgrade-card-form-field',
    templateUrl: './package-satellite-upgrade-card-form-field.component.html',
    styleUrls: ['./package-satellite-upgrade-card-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: PackageSatelliteUpgradeCardFormFieldComponent,
            multi: true,
        },
    ],
})
export class PackageSatelliteUpgradeCardFormFieldComponent extends ControlValueAccessorConnector implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() copyContent: PackageSatelliteCardFormFieldContent;
    inputId = uuid();

    constructor(injector: Injector, readonly translationsForComponentService: TranslationsForComponentService) {
        super(injector);
        translationsForComponentService.init(this);
    }
}
