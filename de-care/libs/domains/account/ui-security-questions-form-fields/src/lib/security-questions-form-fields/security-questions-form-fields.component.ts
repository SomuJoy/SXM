import { Component, ChangeDetectionStrategy, Input, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { FormGroupControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Question {
    id: number;
    question: string;
}

@Component({
    selector: 'security-questions-form-fields',
    templateUrl: './security-questions-form-fields.component.html',
    styleUrls: ['./security-questions-form-fields.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SecurityQuestionsFormFieldsComponent,
            multi: true
        }
    ]
})
export class SecurityQuestionsFormFieldsComponent extends FormGroupControlValueAccessorConnector implements OnInit {
    constructor(injector: Injector) {
        super(injector);
    }

    @Input() set questions(value: Question[]) {
        this.questionsAsArray$.next(value);
    }
    translateKeyPrefix = 'domainsAccountUiSecurityQuestionsFormFieldsModule.securityQuestionsFormFieldsComponent';
    questionsAsArray$ = new BehaviorSubject([]);
    questionIdsSelected$: Observable<number[]>;

    static addQuestionAndAnswerControls(index: number, form: FormGroup): void {
        form.addControl(`question${index}`, new FormControl(null, Validators.required));
        form.addControl(`answer${index}`, new FormControl(null, { validators: [Validators.required, Validators.minLength(3)], updateOn: 'blur' }));
    }

    ngOnInit(): void {
        if (this.formGroup) {
            SecurityQuestionsFormFieldsComponent.addQuestionAndAnswerControls(1, this.formGroup);
            SecurityQuestionsFormFieldsComponent.addQuestionAndAnswerControls(2, this.formGroup);
            SecurityQuestionsFormFieldsComponent.addQuestionAndAnswerControls(3, this.formGroup);

            this.questionIdsSelected$ = this.formGroup.valueChanges.pipe(
                startWith([]),
                map(value => [
                    ...(!!value.question1 ? [value.question1] : []),
                    ...(!!value.question2 ? [value.question2] : []),
                    ...(!!value.question3 ? [value.question3] : [])
                ])
            );
        }
    }
}
