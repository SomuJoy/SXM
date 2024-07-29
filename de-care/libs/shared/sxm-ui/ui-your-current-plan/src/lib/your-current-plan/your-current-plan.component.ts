import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input } from '@angular/core';
import { ReactiveComponentModule } from '@ngrx/component';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiDatePipeModule } from '@de-care/shared/sxm-ui/ui-pipes';

export interface PlanData {
    name: string;
    type?: 'PROMO' | 'PROMO_MCP' | 'TRIAL' | 'SELF_PAID' | 'TRIAL_EXT';
    termLength?: number;
    price?: number;
    endDate?: Date;
    fullPrice: number;
    withoutFees?: boolean;
    promoShowTotalPrice?: boolean;
    isFollowon?: boolean;
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
    selector: 'sxm-ui-your-current-plan',
    templateUrl: './your-current-plan.component.html',
    styleUrls: ['./your-current-plan.component.scss'],
    imports: [CommonModule, TranslateModule, ReactiveComponentModule, SharedSxmUiUiDatePipeModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiYourCurrentPlanComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    @Input() planData: PlanData;
    @Input() hasHeader = true;
    @Input() headerText: string;
    separator = ' - ';

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    imports: [SxmUiYourCurrentPlanComponent],
    exports: [SxmUiYourCurrentPlanComponent],
})
export class SxmUiYourCurrentPlanComponentModule {}
