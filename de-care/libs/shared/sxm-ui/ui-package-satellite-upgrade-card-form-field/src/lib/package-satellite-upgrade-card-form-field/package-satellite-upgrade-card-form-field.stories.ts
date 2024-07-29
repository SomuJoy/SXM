import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { SharedSxmUiUiPackageSatelliteUpgradeCardFormFieldModule } from '../shared-sxm-ui-ui-package-satellite-upgrade-card-form-field.module';
import { PackageSatelliteCardFormFieldContent } from './package-satellite-upgrade-card-form-field.component';

const stories = storiesOf('Component Library/Forms/Fields/Package Satellite Upgrade Card Form Field', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [BrowserAnimationsModule, ReactiveFormsModule, SharedSxmUiUiPackageSatelliteUpgradeCardFormFieldModule],
        })
    );

const sampleContent: PackageSatelliteCardFormFieldContent = {
    title: 'Upgrade to SiriusXM All Access',
    copy: 'Add premium channels plus streaming for an additional $3.34 per month.',
    descriptionTitle: 'Sirius XM All Access Includes:',
    highlights: ['300+ channels on your phone, at home, and online', 'Ability to create Pandora stations', 'NCAA®, NHL® and NFL play-by-play and talk'],
    icons: {
        inside: {
            isActive: true,
            label: 'Inside the car',
        },
        outside: {
            isActive: true,
            label: 'Outside the car',
        },
        pandora: {
            isActive: false,
            label: null,
        },
        perks: {
            isActive: false,
            label: null,
        },
    },
    toggleCollapsed: 'Explore plan details',
    toggleExpanded: 'Hide',
};

const template = `
    <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)">
        <sxm-ui-package-satellite-upgrade-card-form-field
            formControlName="plan-name"
            [copyContent]="copyContent"
        ></sxm-ui-package-satellite-upgrade-card-form-field>
        <button type="submit">Submit</button>
    </form>
`;

stories.add('default', () => ({
    template,
    props: {
        copyContent: { ...sampleContent },
        form: new FormGroup({ 'plan-name': new FormControl(false) }),
        onSubmit: action('Form submitted'),
    },
}));

stories.add('with marketing callout', () => ({
    template,
    props: {
        copyContent: <PackageSatelliteCardFormFieldContent>{
            marketingCallout: 'Our Best Offer',
            ...sampleContent,
        },
        form: new FormGroup({ 'plan-name': new FormControl(false) }),
        onSubmit: action('Form submitted'),
    },
}));

stories.add('with deal addon', () => ({
    template,
    props: {
        copyContent: <PackageSatelliteCardFormFieldContent>{
            upsellDeals: [
                {
                    name: 'CMS mock test: Echo Dot',
                    header: 'CMS mock test: ECHO DOT INCLUDED',
                    deviceImage: 'assets/img/device-echodot-gen4.png',
                },
            ],
            ...sampleContent,
        },
        form: new FormGroup({ 'plan-name': new FormControl(false) }),
        onSubmit: action('Form submitted'),
    },
}));
