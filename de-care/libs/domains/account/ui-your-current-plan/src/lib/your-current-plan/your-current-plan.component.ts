import { CommonModule } from '@angular/common';
import { NgModule, ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { ReactiveComponentModule } from '@ngrx/component';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { SharedSxmUiUiDatePipeModule } from '@de-care/shared/sxm-ui/ui-pipes';

export interface PlanData {
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
    selector: 'de-care-your-current-plan',
    templateUrl: './your-current-plan.component.html',
    styleUrls: ['./your-current-plan.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * @deprecated Use standalone component sxm-ui-your-current-plan from @de-care/shared/sxm-ui/ui-your-current-plan
 */
export class YourCurrentPlanComponent implements OnDestroy, ComponentWithLocale {
    private readonly _destroy$ = new Subject<boolean>();

    languageResources: LanguageResources;
    translateKeyPrefix: string;

    @Input() planData: PlanData;
    @Input() hasHeader = true;
    @Input() headerText: string;
    separator = ' - ';

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }
}

@NgModule({
    imports: [CommonModule, SharedSxmUiUiDatePipeModule, ReactiveComponentModule, TranslateModule.forChild()],
    declarations: [YourCurrentPlanComponent],
    exports: [YourCurrentPlanComponent],
})
export class DomainsAccountUiYourCurrentPlanModule {}
