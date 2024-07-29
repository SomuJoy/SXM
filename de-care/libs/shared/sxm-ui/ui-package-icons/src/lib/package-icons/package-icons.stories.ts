import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { IconsDataModel, SxmUiPackageIconsComponent } from './package-icons.component';

const stories = storiesOf('Component Library/ui/Package Icons', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [BrowserAnimationsModule, SxmUiPackageIconsComponent],
        })
    );

stories.add('default', () => ({
    template: `
            <sxm-ui-package-icons [iconsData]="iconsData"></sxm-ui-package-icons>
        `,
    props: {
        iconsData: {
            inside: {
                isActive: true,
                label: 'Inside the Car',
            },
            outside: {
                isActive: true,
                label: 'Outside the Car',
            },
            pandora: {
                isActive: true,
                label: 'Custom Stations',
            },
            perks: {
                isActive: true,
                label: 'Perks',
            },
        } as IconsDataModel,
    },
}));
