import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';

export interface RegistrationSecurityQuestionsStepComponentApi {
    markAsFinishedProcessing: () => void;
}

export interface SecurityQuestionAnswer {
    id: number;
    answer: string;
}

@Component({
    selector: 'registration-security-questions-step',
    templateUrl: './registration-security-questions-step.component.html',
    styleUrls: ['./registration-security-questions-step.component.scss']
})
export class RegistrationSecurityQuestionsStepComponent implements OnInit, RegistrationSecurityQuestionsStepComponentApi {
    translateKeyPrefix = 'DomainsAccountUiRegisterMultiStepModule.RegistrationSecurityQuestionsStepComponent.';
    form: FormGroup;
    @Input() securityQuestions;
    securityQuestionsFormProcessing$ = new BehaviorSubject(false);
    @Output() stepCompleted = new EventEmitter<SecurityQuestionAnswer[]>();

    constructor(private readonly _store: Store, private readonly _formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.form = this._formBuilder.group({});
    }

    onSubmit() {
        this.form.markAllAsTouched();
        this.securityQuestionsFormProcessing$.next(true);
        if (this.form.valid) {
            this.stepCompleted.next(this.form.value);
        } else {
            const errors: string[] = [];
            if (this.form.get('question1').errors) {
                errors.push('Registration - Security Question not selected for question 1');
            }
            if (this.form.get('question2').errors) {
                errors.push('Registration - Security Question not selected for question 2');
            }
            if (this.form.get('question3').errors) {
                errors.push('Registration - Security Question not selected for question 3');
            }
            if (this.form.get('answer1').errors) {
                errors.push('Registration - Missing Security Question answer for question 1');
            }
            if (this.form.get('answer2').errors) {
                errors.push('Registration - Missing Security Question answer for question 2');
            }
            if (this.form.get('answer3').errors) {
                errors.push('Registration - Missing Security Question answer for question 3');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
            this.securityQuestionsFormProcessing$.next(false);
        }
    }

    markAsFinishedProcessing(): void {
        this.securityQuestionsFormProcessing$.next(false);
    }
}
