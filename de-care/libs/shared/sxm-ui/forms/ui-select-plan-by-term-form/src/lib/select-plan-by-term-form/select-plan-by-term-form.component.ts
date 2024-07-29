import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-select-plan-by-term-form',
    templateUrl: './select-plan-by-term-form.component.html',
    styleUrls: ['./select-plan-by-term-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPlanByTermFormComponent implements ComponentWithLocale {
    @Input() plans: { planCode: string; termLength: number; price: number }[];
    @Input() currentPlanTermLength: number;
    @Input() includePlusFees = false;
    @Input() continueButtonTextOverride: string;
    @Output() selectedPlanCode = new EventEmitter<string>();
    form: FormGroup;
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    constructor(private readonly _formBuilder: FormBuilder, private readonly _store: Store, readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
        this.form = this._formBuilder.group({
            planCode: [null, Validators.required],
        });
    }

    submitForm() {
        this.form.markAllAsTouched();
        if (this.form.valid) {
            this.selectedPlanCode.next(this.form.value.planCode);
        } else {
            const errors = [];
            if (this.form.get('planCode').hasError('required')) {
                errors.push('');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
        }
    }
}
