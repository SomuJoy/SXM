import { Component, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import * as uuid from 'uuid/v4';

export interface PackageTermCardFormFieldContent {
    packageName?: string;
    title: string;
    copy: string;
    descriptionTitle?: string;
    description?: string;
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
    selector: 'sxm-ui-package-term-upgrade-card-form-field',
    templateUrl: './package-term-upgrade-card-form-field.component.html',
    styleUrls: ['./package-term-upgrade-card-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiPackageTermUpgradeCardFormFieldComponent,
            multi: true,
        },
    ],
})
export class SxmUiPackageTermUpgradeCardFormFieldComponent extends ControlValueAccessorConnector implements ComponentWithLocale {
    @Input() copyContent: PackageTermCardFormFieldContent;
    inputId = uuid();
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    constructor(injector: Injector, readonly translationsForComponentService: TranslationsForComponentService) {
        super(injector);
        translationsForComponentService.init(this);
    }
}
