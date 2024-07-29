import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { SharedSxmUiUiPackageTermUpgradeCardFormFieldModule } from '../shared-sxm-ui-ui-package-term-upgrade-card-form-field.module';
import { PackageTermCardFormFieldContent } from './package-term-upgrade-card-form-field.component';

const stories = storiesOf('Component Library/Forms/Fields/Package Term Upgrade Card Form Field', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [BrowserAnimationsModule, ReactiveFormsModule, SharedSxmUiUiPackageTermUpgradeCardFormFieldModule],
        })
    );

stories.add('default', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)">
            <sxm-ui-package-term-upgrade-card-form-field
                formControlName="plan-name"
                [copyContent]="copyContent"
            ></sxm-ui-package-term-upgrade-card-form-field>
            <button type="submit">Submit</button>
        </form>
    `,
    props: {
        copyContent: <PackageTermCardFormFieldContent>{
            title: 'Start with 12 months',
            copy: 'Lock in your rate for 6 more months',
            descriptionTitle: `<strong>Get 12 months of Sirius All Access for $119.98. You'll save $72.06</strong>`,
            description: `Compared to the 6-month deal after 12 months. Based on regular $21.99/mo rates. Fees and taxes apply. See offer details.`,
            toggleCollapsed: 'Explore plan details',
            toggleExpanded: 'Hide',
        },
        form: new FormGroup({ 'plan-name': new FormControl(false) }),
        onSubmit: action('Form submitted'),
    },
}));

stories.add('no expanded content', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)">
            <sxm-ui-package-term-upgrade-card-form-field
                formControlName="plan-name"
                [copyContent]="copyContent"
            ></sxm-ui-package-term-upgrade-card-form-field>
            <button type="submit">Submit</button>
        </form>
    `,
    props: {
        copyContent: <PackageTermCardFormFieldContent>{
            title: 'Start with 12 months',
            copy: 'Lock in your rate for 6 more months',
        },
        form: new FormGroup({ 'plan-name': new FormControl(false) }),
        onSubmit: action('Form submitted'),
    },
}));

stories.add('with deal addon', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)">
            <sxm-ui-package-term-upgrade-card-form-field
                formControlName="plan-name"
                [copyContent]="copyContent"
            ></sxm-ui-package-term-upgrade-card-form-field>
            <button type="submit">Submit</button>
        </form>
    `,
    props: {
        copyContent: <PackageTermCardFormFieldContent>{
            title: 'Start with 12 months',
            copy: '<p>Lock in your rate for 6 more months</p>',
            description: `<p><strong>Get 12 months of XM All Access for $99 and save $82.93</strong></p><p>Compared to the 6-month deal after 12 months. Based on regular $21.99/mo rates. Fees and taxes apply. See offer details.</p>`,
            toggleCollapsed: 'Explore plan details',
            toggleExpanded: 'Hide',
            upsellDeals: [
                {
                    name: 'CMS mock test: Echo Dot',
                    header: 'Free Amazon Echo Dot with subscription.',
                    deviceImage: 'assets/img/device-echodot-gen4.png',
                },
            ],
        },
        form: new FormGroup({ 'plan-name': new FormControl(false) }),
        onSubmit: action('Form submitted'),
    },
}));
