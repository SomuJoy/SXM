import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiRadioOptionCardWithAccordionFormFieldModule } from '../shared-sxm-ui-ui-radio-option-card-with-accordion-form-field.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const stories = storiesOf('Component Library/Forms/Fields/RadioOptionCardWithAccordionFormField', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiRadioOptionCardWithAccordionFormFieldModule, BrowserAnimationsModule],
        })
    );

stories.add('default', () => ({
    template: `
        <form  [formGroup]="form" (ngSubmit)="onSubmit(form.value.option)">
            <div>
                <sxm-ui-radio-option-card-with-accordion-form-field
                expandedText = "See less"
                collapsedText = "Explore plan details"
                formControlName ="option"
                label = "Continue with all access in my new car"
                value="All Access">
                    <div class = "body" bodyContent>
                        <h3>
                            6 months for $8.33/mo
                        </h3>
                        <p>Then $21.99/mo. See <b>Offer Details</b> below</p>
                    </div>
                    <div class = "accordion-content" accordionContent>
                        <h5>SXM Select includes</h5>
                       <ul>
                            <li>
                                140+ channels
                            </li>
                            <li>
                                85 ad-free music channels
                            </li>
                       </ul>
                    </div>
                </sxm-ui-radio-option-card-with-accordion-form-field>
            </div>
        </form>
    `,
    styles: [
        `
        form{
            margin: 30px auto;
            max-width:400px;
        }

        .body{
            padding: 20px 16px;
        }

        .body h3{
            font-size:18px;
            margin-bottom: 0;
        }

        .accordion-content{
            padding: 0 16px;
        }

        h5{
            font-size:16px;
        }
        `,
    ],
    props: {
        form: new FormGroup({ option: new FormControl() }),
    },
}));
