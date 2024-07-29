import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiPackageCardModule } from '@de-care/shared/sxm-ui/ui-package-card';
import { SharedSxmUiUiStickyButtonsContainerModule } from '@de-care/shared/sxm-ui/ui-sticky-buttons-container';
import { DomainsAccountUiYourCurrentPlanModule } from '@de-care/domains/account/ui-your-current-plan';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { SxmUiYourCurrentPlanComponent } from '@de-care/shared/sxm-ui/ui-your-current-plan';

interface PackageData {
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
    standalone: true,
    selector: 'de-care-offers-presentment',
    templateUrl: './offers-presentment.component.html',
    styleUrls: ['./offers-presentment.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        SharedSxmUiUiStickyButtonsContainerModule,
        SharedSxmUiUiPackageCardModule,
        DomainsAccountUiYourCurrentPlanModule,
        DomainsChatUiChatWithAgentLinkModule,
        TranslateModule,
        SxmUiYourCurrentPlanComponent,
    ],
})
export class OffersPresentmentComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    onePlanToShow = false;
    private _packageData: PackageData[];

    @Input()
    set packageData(value: PackageData[]) {
        this._packageData = value;
        this.onePlanToShow = Array.isArray(value) && value?.length === 1;
    }
    get packageData(): PackageData[] {
        return this._packageData;
    }
    @Input() currentPlan;
    @Input() enableContinueButton = true;

    @Output() navigateToGrid = new EventEmitter();
    @Output() backToMyAccount = new EventEmitter();
    @Output() continueToCancel = new EventEmitter();
    @Output() packageSelected = new EventEmitter<string>();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    onNavigateToGrid() {
        this.navigateToGrid.emit();
    }

    onBackToMyAccount() {
        this.backToMyAccount.emit();
    }

    onContinueToCancel() {
        this.continueToCancel.emit();
    }

    onPackageSelected($event) {
        this.packageSelected.emit($event);
    }
}
