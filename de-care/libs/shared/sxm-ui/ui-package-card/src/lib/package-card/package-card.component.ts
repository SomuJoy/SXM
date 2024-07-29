import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ScrollService } from '@de-care/shared/browser-common/window-scroll';
import { TranslateModule } from '@ngx-translate/core';

export interface PackageData {
    packageName: string;
    packageShortName: string;
    pricePerMonth: number;
    termLength: number;
    retailPrice: number;
    features: string[];
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-package-card',
    templateUrl: './package-card.component.html',
    styleUrls: ['./package-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiPackageCardComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() public packageData: PackageData;
    @Output() packageSelected = new EventEmitter<string>();

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private readonly _scrollService: ScrollService) {
        translationsForComponentService.init(this);
    }

    onPackageSelected(packageName: string) {
        this.packageSelected.emit(packageName);
    }

    onClickSeeOfferDetails() {
        this._scrollService.scrollToElementBySelector('offer-details');
    }
}

@NgModule({
    declarations: [SxmUiPackageCardComponent],
    exports: [SxmUiPackageCardComponent],
    imports: [CommonModule, TranslateModule.forChild()],
})
export class SharedSxmUiUiPackageCardModule {}
