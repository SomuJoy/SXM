import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { organicFollowOnOptionViewModel } from '@de-care/de-care-use-cases/checkout/state-streaming-roll-to-drop';
import { DeCareUseCasesCheckoutUiCommonModule } from '@de-care/de-care-use-cases/checkout/ui-common';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SxmUiRadioOptionCardWithRadioSelectFormFieldComponentModule } from '@de-care/shared/sxm-ui/ui-radio-option-card-form-field';
import { SxmUiStepHeaderTextBreadcrumbComponent } from '@de-care/shared/sxm-ui/ui-stepper';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ReactiveComponentModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../page-step-route-configuration';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-step-organic-follow-on-option-page',
    templateUrl: './step-organic-follow-on-option-page.component.html',
    styleUrls: ['./step-organic-follow-on-option-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        ReactiveComponentModule,
        SxmUiStepHeaderTextBreadcrumbComponent,
        SharedSxmUiUiDataClickTrackModule,
        SxmUiRadioOptionCardWithRadioSelectFormFieldComponentModule,
        ReactiveFormsModule,
        SharedSxmUiUiProceedButtonModule,
        DeCareSharedUiPageLayoutModule,
        DeCareUseCasesCheckoutUiCommonModule,
    ],
})
export class StepOrganicFollowOnOptionPageComponent implements ComponentWithLocale, OnInit, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    currentLang$ = this.translationsForComponentService.currentLang$;
    organicFollowOnOptionViewModel$ = this._store.select(organicFollowOnOptionViewModel).pipe(tap(console.log));
    formGroup = this._formBuilder.group({
        followon: this._formBuilder.control(null, Validators.required),
    });
    submitted = false;

    get displayFormError() {
        return this.submitted && this.formGroup.invalid;
    }

    get followonValueSelected() {
        return this.formGroup.valid && this.formGroup.value.followon !== 'SKIP';
    }

    constructor(
        private readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private readonly _router: Router
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'followonoptionpage' }));
    }

    submitForm() {
        this.submitted = true;
        if (this.formGroup.valid) {
            const followonValue = this.formGroup.value.followon;
            let nextUrl = this.pageStepRouteConfiguration.routeUrlNext;
            if (followonValue === 'SKIP') {
                nextUrl = this.pageStepRouteConfiguration.confirmationUrl;
            }
            this._router.navigate([nextUrl], { queryParamsHandling: 'preserve', relativeTo: this._activatedRoute });
        }
    }
}
