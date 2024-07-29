import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getSelectedPlanCode, setSelectedPlanCode } from '@de-care/de-care-use-cases/checkout/state-streaming';
import { SharedSxmUiCurrencyPipeModule } from '@de-care/shared/sxm-ui/ui-pipes';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SxmUiRadioOptionCardWithRadioSelectFormFieldComponentModule } from '@de-care/shared/sxm-ui/ui-radio-option-card-form-field';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-pick-a-plan-term-billing-form',
    template: `
        <form [formGroup]="form" data-test="billingTermForm">
            <p class="instructions" [innerHTML]="translateKeyPrefix + '.DESCRIPTION' | translate"></p>
            <section>
                <sxm-ui-radio-option-card-with-radio-select-form-field
                    *ngFor="let termInfo of billingTerms"
                    data-test="billingTermOption"
                    formControlName="planCode"
                    [data]="{
                        title: termInfo.termLength | i18nPlural: (translateKeyPrefix + '.PLURAL_MAP.TERM' | translate),
                        description:
                            translateKeyPrefix + '.PRICE'
                            | translate
                                : {
                                      price: (termInfo.price | sxmUiCurrency),
                                      period: termInfo.termLength | i18nPlural: (translateKeyPrefix + '.PLURAL_MAP.PERIOD' | translate)
                                  },
                        value: termInfo.planCode
                    }"
                    sxmUiDataClickTrack="ui"
                    data-link-name="CHECKOUT STREAMING BILLING TERM OPTION"
                    [attr.data-link-key]="termInfo.planCode"
                ></sxm-ui-radio-option-card-with-radio-select-form-field>
            </section>
            <p class="legal-copy" [innerHTML]="translateKeyPrefix + '.OFFER_DETAILS' | translate"></p>
            <hr />
        </form>
    `,
    styleUrls: ['./pick-a-plan-term-billing-form.component.scss'],
})
export class PickAPlanTermBillingFormComponent implements ComponentWithLocale, OnInit, OnDestroy {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    selectedPlanCodeSubscription: Subscription;
    form: FormGroup;
    valueChangesSubscription: Subscription;

    @Input() billingTerms: {
        termLength: number;
        price: number;
        planCode: string;
    }[];

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private readonly _store: Store, private readonly _formBuilder: FormBuilder) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            planCode: '',
        });
        this._store
            .select(getSelectedPlanCode)
            .pipe(take(1))
            .subscribe((planCode) => this.form.controls.planCode.patchValue(planCode, { emitEvent: false }));
        this.valueChangesSubscription = this.form.controls.planCode.valueChanges.subscribe((planCode) => this._store.dispatch(setSelectedPlanCode({ planCode })));
    }

    ngOnDestroy(): void {
        this.valueChangesSubscription?.unsubscribe();
    }
}

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SxmUiRadioOptionCardWithRadioSelectFormFieldComponentModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiCurrencyPipeModule,
    ],
    declarations: [PickAPlanTermBillingFormComponent],
    exports: [PickAPlanTermBillingFormComponent],
})
export class PickAPlanTermBillingFormComponentModule {}
