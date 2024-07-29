import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';

export interface PreSelectedPlanInfo {
    price: number | string;
    planName: string;
}
export interface CurrentPlan {
    packageName: string;
    type?: 'PROMO' | 'PROMO_MCP' | 'TRIAL' | 'SELF_PAID' | 'TRIAL_EXT';
    termLength?: number;
    price?: number;
    endDate?: Date;
    isCanada: boolean;
    isQuebec: boolean;
    isFollowon?: boolean;
    fullPrice: number;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-pre-selected-second-plan',
    templateUrl: './pre-selected-second-plan.component.html',
    styleUrls: ['./pre-selected-second-plan.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreSelectedSecondPlanComponent implements OnInit, ComponentWithLocale {
    @Input() preSelectedPlanInfo: PreSelectedPlanInfo;
    @Input() currentPlan: CurrentPlan;
    @Output() keepCurrentPlan = new EventEmitter();
    @Output() switchPlan = new EventEmitter();
    @Output() cancelPlan = new EventEmitter();

    languageResources: LanguageResources;
    translateKeyPrefix: string;

    // TODO: Temporary hardcoded values for Streaming Music Showcase preselected offer
    channelDescriptions = [
        {
            name: 'SXM_APP',
            includesInnerHtml: false,
        },
        {
            name: 'SPORTS_TALK',
            includesInnerHtml: true,
        },
        {
            name: 'AD_FREE',
            includesInnerHtml: false,
        },
        {
            name: 'HOWARD_STERN',
            includesInnerHtml: false,
        },
        {
            name: 'ORIGINAL_TALK',
            includesInnerHtml: false,
        },
    ];
    preSelectedPackageName = 'SIR_IP_SA';

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        // TODO: Implement init config
    }

    onGetThisPlan() {
        this.switchPlan.emit();
    }

    onKeepCurrentPlan() {
        this.keepCurrentPlan.emit();
    }

    onCancelPlan() {
        this.cancelPlan.emit();
    }
}
