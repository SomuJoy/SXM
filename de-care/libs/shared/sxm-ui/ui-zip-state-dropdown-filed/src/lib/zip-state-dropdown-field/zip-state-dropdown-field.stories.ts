import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiZipStateDropdownFiledModule } from '../shared-sxm-ui-ui-zip-state-dropdown-filed.module';
import { ZIP_BASED_STATE_LOOKUP } from '../token';
import { TRANSLATE_PROVIDERS, withMockSettings } from '@de-care/shared/storybook/util-helpers';

const stories = storiesOf('Component Library/Forms/Fields/ZipStateDropdownField', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiZipStateDropdownFiledModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                {
                    provide: ZIP_BASED_STATE_LOOKUP,
                    useValue: {
                        getState: (zip) =>
                            zip === '02861'
                                ? [
                                      { key: 'RI', state: 'RHODE ISLAND' },
                                      { key: 'MA', state: 'MASSACHUSETTS' },
                                  ]
                                : null,
                    },
                },
            ],
        })
    )
    .addDecorator(withMockSettings);

stories.add('default', () => ({
    template: `
    <main>
    <code>zip 02861 corresponds to RI and MA</code>
    <div class="row no-padding" style="height:400px;margin:32px;">
        <div class="col small-12 no-padding">
            <sxm-ui-zip-state-dropdown-field [formGroup]="formGroup" style="width:300px;"></sxm-ui-zip-state-dropdown-field>
        </div>
    </div>
    </main>
    `,
    props: {
        formGroup: new FormGroup({}),
    },
}));
