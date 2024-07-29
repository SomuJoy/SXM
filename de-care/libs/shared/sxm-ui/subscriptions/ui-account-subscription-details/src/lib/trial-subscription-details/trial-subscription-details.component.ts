import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedSxmUiDropdownNavigationListModule } from '@de-care/shared/sxm-ui/ui-dropdown-navigation-list';
import { AdditionalPlanNames, DropdownListModel } from '../interface';
import { SharedSxmUiUiDatePipeModule } from '@de-care/shared/sxm-ui/ui-pipes';

interface DataModel {
    planName: string[];
    term: number;
    endDate: Date;
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
    selector: 'sxm-ui-trial-subscription-details',
    templateUrl: './trial-subscription-details.component.html',
    styleUrls: ['./trial-subscription-details.component.scss'],
})
export class SxmUiTrialSubscriptionDetailsComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Input() data: DataModel;
    @Input() dropdownListData: DropdownListModel[] = [];
    @Output() editUsername = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private _translateService: TranslateService) {
        translationsForComponentService.init(this);
    }

    trackByStartDate(index: number, item: FollowOnPlanModel) {
        return item.startDate;
    }
}

@NgModule({
    declarations: [SxmUiTrialSubscriptionDetailsComponent],
    exports: [SxmUiTrialSubscriptionDetailsComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiDropdownNavigationListModule, SharedSxmUiUiDatePipeModule],
})
export class SharedSxmUiSubscriptionDetailsUiTrialSubscriptionDetailsModule {}
