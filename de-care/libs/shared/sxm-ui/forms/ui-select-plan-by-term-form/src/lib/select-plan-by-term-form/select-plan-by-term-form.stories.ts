import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiFormsUiSelectPlanByTermFormModule } from '../shared-sxm-ui-forms-ui-select-plan-by-term-form.module';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';

const stories = storiesOf('Component Library/Forms/Full Forms/SelectPlanByTermForm', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiFormsUiSelectPlanByTermFormModule],
            providers: [...TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER],
        })
    )
    .addDecorator(withTranslation);

const commonPlansSet = [
    { planCode: 'planA', termLength: 1, price: 10.99 },
    { planCode: 'planB', termLength: 12, price: 120.0 },
];

stories.add('default', () => ({
    template: `
        <sxm-ui-select-plan-by-term-form [plans]="plans" (selectedPlanCode)="onSubmit($event)"></sxm-ui-select-plan-by-term-form>
    `,
    props: {
        plans: commonPlansSet,
        onSubmit: action(`Selected plan code`),
    },
}));

stories.add('with current term identified', () => ({
    template: `
        <sxm-ui-select-plan-by-term-form [plans]="plans" [currentPlanTermLength]="12" (selectedPlanCode)="onSubmit($event)"></sxm-ui-select-plan-by-term-form>
    `,
    props: {
        plans: commonPlansSet,
        onSubmit: action(`Selected plan code`),
    },
}));

stories.add('include plus fees', () => ({
    template: `
        <sxm-ui-select-plan-by-term-form [plans]="plans" [includePlusFees]="true" (selectedPlanCode)="onSubmit($event)"></sxm-ui-select-plan-by-term-form>
    `,
    props: {
        plans: commonPlansSet,
        onSubmit: action(`Selected plan code`),
    },
}));

stories.add('include plus fees and with current term identified', () => ({
    template: `
        <sxm-ui-select-plan-by-term-form [plans]="plans" [includePlusFees]="true" [currentPlanTermLength]="12" (selectedPlanCode)="onSubmit($event)"></sxm-ui-select-plan-by-term-form>
    `,
    props: {
        plans: commonPlansSet,
        onSubmit: action(`Selected plan code`),
    },
}));

stories.add('with all potential term lengths', () => ({
    template: `
        <sxm-ui-select-plan-by-term-form [plans]="plans" (selectedPlanCode)="onSubmit($event)"></sxm-ui-select-plan-by-term-form>
    `,
    props: {
        plans: [
            { planCode: 'planA', termLength: 1, price: 10.99 },
            { planCode: 'planB', termLength: 3, price: 30.99 },
            { planCode: 'planC', termLength: 6, price: 59.99 },
            { planCode: 'planD', termLength: 12, price: 120.0 },
            { planCode: 'planE', termLength: 4, price: 35.99 },
        ],
        onSubmit: action(`Selected plan code`),
    },
}));

stories.add('with custom continue button text', () => ({
    template: `
        <sxm-ui-select-plan-by-term-form [plans]="plans" continueButtonTextOverride="Select a term" (selectedPlanCode)="onSubmit($event)"></sxm-ui-select-plan-by-term-form>
    `,
    props: {
        plans: commonPlansSet,
        onSubmit: action(`Selected plan code`),
    },
}));
