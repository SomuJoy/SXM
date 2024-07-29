import { SXM_UI_STORYBOOK_STORIES } from './sxm-ui.stories';
import { CreditCardNumberInputComponent } from '@de-care/sxm-ui';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { action } from '@storybook/addon-actions';

SXM_UI_STORYBOOK_STORIES.add('credit-card-number-input', () => ({
    component: CreditCardNumberInputComponent,
    props: {
        labelText: 'Card Number'
    }
}));

SXM_UI_STORYBOOK_STORIES.add('credit-card-number-input: masked', () => ({
    component: CreditCardNumberInputComponent,
    props: {
        labelText: 'Card Number',
        isMasked: true,
        maskedNum: '************1234'
    }
}));

SXM_UI_STORYBOOK_STORIES.add('credit-card-number-input: inside form element', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)">
            <credit-card-number-input formControlName="ccNum"></credit-card-number-input>
            <div *ngIf="form.get('ccNum').errors">Invalid!!!</div>
            <button type="submit">Submit</button>
        </form>
    `,
    moduleMetadata: {
        imports: [ReactiveFormsModule]
    },
    props: {
        form: new FormGroup({ ccNum: new FormControl('') }),
        onSubmit: action('Form submit')
    }
}));
