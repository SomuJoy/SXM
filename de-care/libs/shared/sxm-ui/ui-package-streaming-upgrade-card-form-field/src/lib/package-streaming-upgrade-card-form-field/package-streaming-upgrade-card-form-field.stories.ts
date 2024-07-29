import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { SharedSxmUiUiPackageStreamingUpgradeCardFormFieldModule } from '../shared-sxm-ui-ui-package-streaming-upgrade-card-form-field.module';
import { PackageStreamingCardFormFieldContent } from './package-streaming-upgrade-card-form-field.component';

const stories = storiesOf('Component Library/Forms/Fields/Package Streaming Upgrade Card Form Field', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [BrowserAnimationsModule, ReactiveFormsModule, SharedSxmUiUiPackageStreamingUpgradeCardFormFieldModule],
        })
    );

const sampleContent: PackageStreamingCardFormFieldContent = {
    title: 'Upgrade to SiriusXM All Access',
    copy: 'Add premium channels plus streaming for an additional $3.34 per month.',
    highlights: ['300+ channels on your phone, at home, and online', 'Ability to create Pandora stations', 'NCAA®, NHL® and NFL play-by-play and talk'],
    toggleCollapsed: 'Explore plan details',
    toggleExpanded: 'Hide',
};

const template = `
<form [formGroup]="form" (ngSubmit)="onSubmit(form.value)">
    <sxm-ui-package-streaming-upgrade-card-form-field
        formControlName="plan-name"
        [copyContent]="copyContent"
    ></sxm-ui-package-streaming-upgrade-card-form-field>
    <button type="submit">Submit</button>
    </form>
`;

stories.add('default', () => ({
    template,
    props: {
        copyContent: <PackageStreamingCardFormFieldContent>{ ...sampleContent },
        form: new FormGroup({ 'plan-name': new FormControl(false) }),
        onSubmit: action('Form submitted'),
    },
}));

stories.add('with deal addon', () => ({
    template,
    props: {
        copyContent: <PackageStreamingCardFormFieldContent>{
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
