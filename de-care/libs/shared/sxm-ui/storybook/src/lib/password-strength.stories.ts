import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { text, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { TRANSLATE_PROVIDERS, withMockSettings } from '@de-care/shared/storybook/util-helpers';
import { SharedSxmUiUiPasswordFormFieldModule } from '@de-care/shared/sxm-ui/ui-password-form-field';

export const stories = storiesOf('Component Library/Forms/Fields/PasswordStrengthFormField', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiPasswordFormFieldModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    )
    .addDecorator(withMockSettings);

stories.add('default', () => ({
    moduleMetadata: { imports: [ReactiveFormsModule] },
    template: `<form [formGroup]="formGroup">
                    <br/>
                    <br />
                    <sxm-ui-password-strength
                        formControlName="password"
                        [labelText]="labelText"
                        [qatagName]="qatagName"
                        [id]="id"
                        [reservedWords]="reservedWords"
                    ></sxm-ui-password-strength>
                </form>
                <div class="invalid-feedback">
                    <p *ngIf="formGroup.get('password').hasError('required')">Enter a password.</p>
                    <p *ngIf="formGroup.get('password').hasError('length')">
                        Your password must be
                        {{ formGroup.get('password').errors.length.min }}
                        to {{ formGroup.get('password').errors.length.max }} characters long.
                    </p>
                    <p *ngIf="formGroup.get('password').hasError('policy')">
                        Your password must contain at least one character from at least 3 different groups, as explained in our password policy.
                    </p>
                    <p *ngIf="formGroup.get('password').errors?.reservedWords as reservedWordsError">
                        Your password cannot include the
                        {{ reservedWordsError.words.length > 1 ? 'words "' + reservedWordsError.words.join('" or "') + '".' : 'word "' + reservedWordsError.words[0] + '".' }}
                    </p>
                </div>
                <div>
                    <button type="button" (click)="reservedWords = ['sirius']">Set Single Reserved Word</button>
                    <br />
                    <button type="button" (click)="reservedWords = ['sirius', 'radio']">Set Multiple Reserved Words</button>
                    <br />
                    <button type="button" (click)="reservedWords = null">Clear Reserved Word(s)</button>
                </div>`,
    props: {
        formGroup: new FormGroup({ password: new FormControl('', { updateOn: 'blur' }) }),
        id: text('id', 'passwordField'),
        labelText: text('labelText', 'Password'),
        qatagName: text('qatagName', 'passwordFieldBlock'),
    },
}));

stories.add('with existing pwd (p@55word)', () => ({
    moduleMetadata: { imports: [ReactiveFormsModule] },
    template: `<form [formGroup]="formGroup">
                    <br/>
                    <br />
                    <sxm-ui-password-strength
                        formControlName="password"
                        [labelText]="labelText"
                        [qatagName]="qatagName"
                        [id]="id"
                        [reservedWords]="reservedWords"
                    ></sxm-ui-password-strength>
                </form>
                <div class="invalid-feedback">
                    <p *ngIf="formGroup.get('password').hasError('required')">Enter a password.</p>
                    <p *ngIf="formGroup.get('password').hasError('length')">
                        Your password must be
                        {{ formGroup.get('password').errors.length.min }}
                        to {{ formGroup.get('password').errors.length.max }} characters long.
                    </p>
                    <p *ngIf="formGroup.get('password').hasError('policy')">
                        Your password must contain at least one character from at least 3 different groups, as explained in our password policy.
                    </p>
                    <p *ngIf="formGroup.get('password').errors?.reservedWords as reservedWordsError">
                        Your password cannot include the
                        {{ reservedWordsError.words.length > 1 ? 'words "' + reservedWordsError.words.join('" or "') + '".' : 'word "' + reservedWordsError.words[0] + '".' }}
                    </p>
                </div>
                <div>
                    <button type="button" (click)="reservedWords = ['sirius']">Set Single Reserved Word</button>
                    <br />
                    <button type="button" (click)="reservedWords = ['sirius', 'radio']">Set Multiple Reserved Words</button>
                    <br />
                    <button type="button" (click)="reservedWords = null">Clear Reserved Word(s)</button>
                </div>`,
    props: {
        formGroup: new FormGroup({ password: new FormControl('p@55word', { updateOn: 'blur' }) }),
        id: text('id', 'passwordField'),
        labelText: text('labelText', 'Password'),
        qatagName: text('qatagName', 'passwordFieldBlock'),
    },
}));
