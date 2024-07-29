import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiUiRadioOptionCardFormFieldModule } from '../shared-sxm-ui-ui-radio-option-card-form-field.module';

const stories = storiesOf('Component Library/Forms/Fields/RadioOptionCardFormField', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiRadioOptionCardFormFieldModule],
        })
    );

stories.add('default', () => ({
    template: `
        <form  [formGroup]="form" (ngSubmit)="onSubmit(form.value.option)">
            <div>
                <sxm-ui-radio-option-card-form-field formControlName ="option" label = "2017 Subaru Outback" value="true">
                    <div class = "content">
                        <ul>
                            <li>Radio ID: LB842F6Y</li>
                            <li>XM Select</li>
                            <li>Monthly Plan</li>
                            <li>Renews: 12/30/2020</li>
                            <li>Username: e****gmail.com</li>
                        </ul>
                    </div>
                </sxm-ui-radio-option-card-form-field>
            </div>
        </form>
    `,
    styles: [
        `
        form{
            margin: 30px auto;
            max-width:400px;
        }
        .content{
            padding: 16px;
        }

        ul{
            list-style-type: none;
            padding:0;
            margin:0;
        }

        ul li{
            padding: 5px 0;
            font-size:14px;
        }
        `,
    ],
    props: {
        form: new FormGroup({ option: new FormControl() }),
    },
}));
