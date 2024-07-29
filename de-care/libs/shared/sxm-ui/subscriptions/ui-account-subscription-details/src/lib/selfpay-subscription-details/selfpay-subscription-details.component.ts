import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { SharedSxmUiDropdownNavigationListModule } from '@de-care/shared/sxm-ui/ui-dropdown-navigation-list';
import { SharedSxmUiUiDatePipeModule } from '@de-care/shared/sxm-ui/ui-pipes';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AdditionalPlanNames, DropdownListModel } from '../interface';

interface DataModel {
    planName: string[];
    term: number;
    planUrl: string;
    followOnPlans?: FollowOnPlanModel[];
    hasPromoFollowOn?: boolean;
    additionalPlanName?: AdditionalPlanNames;
}

interface FollowOnPlanModel {
    planName: string;
    startDate: Date;
    endDate?: Date;
    term: number;
    type?: 'PROMO' | 'SELFPAY';
    additionalPlanName?: AdditionalPlanNames;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-selfpay-subscription-details',
    templateUrl: './selfpay-subscription-details.component.html',
    styleUrls: ['./selfpay-subscription-details.component.scss'],
})
export class SxmUiSelfpaySubscriptionDetailsComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Input() data: DataModel;
    @Input() dropdownListData: DropdownListModel[] = [];
    @Output() modifyActionSelected = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private readonly _translateService: TranslateService) {
        translationsForComponentService.init(this);
    }

    trackByStartDate(index: number, item: FollowOnPlanModel) {
        return item.startDate;
    }
}

@NgModule({
    declarations: [SxmUiSelfpaySubscriptionDetailsComponent],
    exports: [SxmUiSelfpaySubscriptionDetailsComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiDropdownNavigationListModule, SharedSxmUiUiDatePipeModule],
})
export class SharedSxmUiSubscriptionDetailsUiSelfpaySubscriptionDetailsModule {}
