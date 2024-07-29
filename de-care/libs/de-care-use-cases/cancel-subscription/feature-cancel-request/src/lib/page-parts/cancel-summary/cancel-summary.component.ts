import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { SharedSxmUiUiIconCloseModule } from '@de-care/shared/sxm-ui/ui-icon-close';

export interface PlanInfo {
    packageName: string;
    termLength: number;
    isTrial?: boolean;
    endDate: Date;
    type: string;
    price: number;
    isDataCapableOrAviationMarine: boolean;
    streamingOnly: boolean;
    subscriptionId: number;
    hasSubscriptionWithTrialAndFollowOn?: boolean;
    followOnPlan?: PlanInfo;
    vehicleInfo?: {
        year: string | number;
        make: string;
        model: string;
    };
    name?: string;
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
    selector: 'de-care-cancel-summary',
    templateUrl: './cancel-summary.component.html',
    styleUrls: ['./cancel-summary.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,

    imports: [CommonModule, TranslateModule, DomainsSubscriptionsUiPlayerAppIntegrationModule, SharedSxmUiUiIconCloseModule],
})
export class CancelSummaryComponent implements OnInit, OnChanges, ComponentWithLocale {
    @Input() planInfo: PlanInfo;

    languageResources: LanguageResources;
    translateKeyPrefix: string;

    isEndOfCycle = false;
    dateFormat$ = this.translationsForComponentService.dateFormat$;
    currentLang$ = this.translationsForComponentService.currentLang$;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.planInfo) {
            this.isEndOfCycle = this.planInfo?.isTrial || (this.planInfo?.type === 'PROMO' && this.planInfo?.price === 0 && this.planInfo?.endDate != null);
        }
    }
}
