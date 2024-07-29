import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import {
    GetDeviceStatusForRouterWorkflowService,
    GetDeviceStatusForRouterWorkflowServiceErrors,
    getSelectYourRadioPageViewModel,
    setSelectedRadioId,
} from '@de-care/de-care-use-cases/checkout/state-add-radio-router';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiRadioOptionFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-form-field';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ReactiveComponentModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routes/page-step-route-configuration';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-select-your-radio-page',
    templateUrl: './select-your-radio-page.component.html',
    styleUrls: ['./select-your-radio-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        SharedSxmUiUiRadioOptionFormFieldModule,
        TranslateModule,
        ReactiveFormsModule,
        ReactiveComponentModule,
        DeCareSharedUiPageLayoutModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiProceedButtonModule,
        CommonModule,
    ],
})
export class SelectYourRadioPageComponent implements ComponentWithLocale, OnInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    form: FormGroup;
    viewModel$ = this._store.select(getSelectYourRadioPageViewModel);
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    onSubmit() {
        if (this.form.value.selectedRadioOption === 'DEVICE_LOOK_UP') {
            this._router.navigate([this.pageStepRouteConfiguration.lookupDeviceUrl], { relativeTo: this._activatedRoute });
        } else {
            const radioId = this.form.value.selectedRadioOption;
            this._store.dispatch(setSelectedRadioId({ radioId }));
            this._getDeviceStatusForRouterWorkflowService.build().subscribe({
                next: (result) => {
                    if (result === 'ESN not in use') {
                        this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute });
                    } else {
                        //TBD
                        this._router.navigate(['/subscribe/checkout/flepz']);
                    }
                },
                error: (error: { errorType: GetDeviceStatusForRouterWorkflowServiceErrors }) => {
                    if (error && error.errorType) {
                        this._router.createUrlTree(['/error']);
                    }
                },
            });
        }
    }
    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private _store: Store,
        private readonly _activatedRoute: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private readonly _router: Router,
        private readonly _getDeviceStatusForRouterWorkflowService: GetDeviceStatusForRouterWorkflowService
    ) {
        translationsForComponentService.init(this);
    }
    ngOnInit(): void {
        this._selectFirstOption();
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }
    private _selectFirstOption() {
        this.viewModel$.pipe(take(1)).subscribe((radios) => {
            this.form = this._formBuilder.group({
                selectedRadioOption: [radios.radios[0].radioId],
            });
        });
    }
}
