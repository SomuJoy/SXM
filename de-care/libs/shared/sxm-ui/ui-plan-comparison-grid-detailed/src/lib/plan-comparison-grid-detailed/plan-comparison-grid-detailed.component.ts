import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiIconCheckmarkModule } from '@de-care/shared/sxm-ui/ui-icon-checkmark';
import { SharedSxmUiUiIconDropdownArrowSmallModule } from '@de-care/shared/sxm-ui/ui-icon-dropdown-arrow-small';
import { SharedSxmUiUiIconCarModule } from '@de-care/shared/sxm-ui/ui-icon-car';
import { SharedSxmUiUiIconStreamingModule } from '@de-care/shared/sxm-ui/ui-icon-streaming';

export interface Data {
    plan1: PlanForComparison;
    plan2: PlanForComparison;
    plan3: PlanForComparison;
    features: Feature[];
    bestValuePlanCode?: string;
}

interface PlanForComparison {
    packageCodeName: string;
    planCode: string;
    packageName: string;
    channelCount: number | string;
    promoTermLength: number;
    promoPricePerMonth: number;
    pricePerMonth: number;
    listenOn: {
        insideTheCar: boolean;
        outsideTheCar: boolean;
    };
    channelLineupUrl: string;
}

interface Feature {
    name: string;
    capabilityPlan1: 'ALL' | 'SOME' | 'FEW' | 'NONE';
    capabilityPlan2: 'ALL' | 'SOME' | 'FEW' | 'NONE';
    capabilityPlan3: 'ALL' | 'SOME' | 'FEW' | 'NONE';
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-plan-comparison-grid-detailed',
    templateUrl: './plan-comparison-grid-detailed.component.html',
    styleUrls: ['./plan-comparison-grid-detailed.component.scss'],
    animations: [
        trigger('featuresExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0', overflow: 'hidden' })),
            state('expanded', style({ height: '*', overflow: 'visible' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiPlanComparisonGridDetailedComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input()
    set data(value: Data) {
        this._data = value;
        this.gridPlans = Object.entries(value)
            ?.filter((data) => data[0]?.includes('plan'))
            ?.map((data) => data[1]);
        this.features = value?.features
            ?.map((feature) => Object.entries(feature))
            ?.map((feats) => ({ name: feats?.[0]?.[1], capabilities: feats?.filter((capabilities) => capabilities[0]?.includes('capabilityPlan'))?.map((arr) => arr[1]) }))
            ?.filter((feature) => feature?.capabilities?.some((capability) => capability === 'SOME' || capability === 'ALL'));
        this.onePlanToShow = this.gridPlans?.length === 1;
    }
    get data(): Data {
        return this._data;
    }
    @Input() isExpanded = false;
    @Output() planCodeSelected = new EventEmitter<string>();
    @Output() packageNameSelected = new EventEmitter<string>();

    gridPlans: PlanForComparison[];
    features: { name: string; capabilities: string[] }[];
    onePlanToShow = false;
    private _data: Data;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    trackByFeatureName(feature: Feature) {
        return feature.name;
    }

    onSelectedPlan(planCode, packageCodeName) {
        this.planCodeSelected.next(planCode);
        this.packageNameSelected.next(packageCodeName);
    }
}

@NgModule({
    declarations: [SxmUiPlanComparisonGridDetailedComponent],
    exports: [SxmUiPlanComparisonGridDetailedComponent],
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiIconCheckmarkModule,
        SharedSxmUiUiIconDropdownArrowSmallModule,
        SharedSxmUiUiIconCarModule,
        SharedSxmUiUiIconStreamingModule,
    ],
})
export class SxmUiPlanComparisonGridDetailedComponentModule {}
