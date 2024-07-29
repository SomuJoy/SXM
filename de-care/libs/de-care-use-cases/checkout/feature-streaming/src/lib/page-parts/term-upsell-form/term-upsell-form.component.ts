import { CommonModule } from '@angular/common';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getSelectedPlanCode, setSelectedPlanCode, termUpsellOptionsViewModel } from '@de-care/de-care-use-cases/checkout/state-streaming';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SxmUiRadioOptionCardWithRadioSelectFormFieldComponentModule } from '@de-care/shared/sxm-ui/ui-radio-option-card-form-field';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ReactiveComponentModule } from '@ngrx/component';
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
    selector: 'de-care-term-upsell-form',
    template: `
        <ng-container *ngrxLet="termUpsellOptionsViewModel$ as termUpsellOptionsViewModel">
            <form [formGroup]="form" data-test="checkoutTermUpsellForm">
                <p class="instructions" [innerHTML]="termUpsellOptionsViewModel.termOfferOption.description"></p>
                <section>
                    <sxm-ui-radio-option-card-with-radio-select-form-field
                        data-test="upsellOptionLeadOffer"
                        formControlName="planCode"
                        [data]="{
                            title:
                                termUpsellOptionsViewModel.currentOfferOption.termLength +
                                ' ' +
                                (termUpsellOptionsViewModel.currentOfferOption.termLength | i18nPlural: (translateKeyPrefix + '.PLURAL_MAP.MONTH' | translate)),
                            description:
                                termUpsellOptionsViewModel.currentOfferOption.price > 0
                                    ? (termUpsellOptionsViewModel.currentOfferOption.price | currency: 'USD':'symbol-narrow':'1.0-2')
                                    : (translateKeyPrefix + '.UPSELL_OPTION_DESCRIPTION_FREE' | translate),
                            value: termUpsellOptionsViewModel.currentOfferOption.planCode
                        }"
                        sxmUiDataClickTrack="ui"
                        data-link-name="CHECKOUT STREAMING UPSELL OPTION"
                        [attr.data-link-key]="termUpsellOptionsViewModel.currentOfferOption.planCode"
                    ></sxm-ui-radio-option-card-with-radio-select-form-field>
                    <sxm-ui-radio-option-card-with-radio-select-form-field
                        data-test="upsellOptionTermOffer"
                        formControlName="planCode"
                        [data]="{
                            title:
                                termUpsellOptionsViewModel.termOfferOption.termLength +
                                ' ' +
                                (termUpsellOptionsViewModel.termOfferOption.termLength | i18nPlural: (translateKeyPrefix + '.PLURAL_MAP.MONTH' | translate)),
                            description:
                                termUpsellOptionsViewModel.termOfferOption.price > 0
                                    ? (termUpsellOptionsViewModel.termOfferOption.price | currency: 'USD':'symbol-narrow':'1.0-2')
                                    : (translateKeyPrefix + '.UPSELL_OPTION_DESCRIPTION_FREE' | translate),
                            value: termUpsellOptionsViewModel.termOfferOption.planCode,
                            callout: termUpsellOptionsViewModel.termOfferOption.deal
                                ? {
                                      text: termUpsellOptionsViewModel.termOfferOption.deal.header,
                                      imageUrl: termUpsellOptionsViewModel.termOfferOption.deal.deviceImage
                                  }
                                : null
                        }"
                        sxmUiDataClickTrack="ui"
                        data-link-name="CHECKOUT STREAMING UPSELL OPTION"
                        [attr.data-link-key]="termUpsellOptionsViewModel.currentOfferOption.planCode"
                    ></sxm-ui-radio-option-card-with-radio-select-form-field>
                </section>
                <p class="legal-copy" [innerHTML]="termUpsellOptionsViewModel.termOfferOption.legalCopy"></p>
                <hr />
            </form>
        </ng-container>
    `,
    styleUrls: ['./term-upsell-form.component.scss'],
})
export class TermUpsellFormComponent implements ComponentWithLocale, OnInit, OnDestroy {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    termUpsellOptionsViewModel$ = this._store.select(termUpsellOptionsViewModel);
    selectedPlanCodeSubscription: Subscription;
    form: FormGroup;
    valueChangesSubscription: Subscription;

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
        ReactiveComponentModule,
        SxmUiRadioOptionCardWithRadioSelectFormFieldComponentModule,
        SharedSxmUiUiDataClickTrackModule,
    ],
    declarations: [TermUpsellFormComponent],
    exports: [TermUpsellFormComponent],
})
export class TermUpsellFormComponentModule {}
