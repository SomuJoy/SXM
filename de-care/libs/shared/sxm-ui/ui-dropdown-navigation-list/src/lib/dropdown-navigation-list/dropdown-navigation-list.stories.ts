import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { SharedSxmUiDropdownNavigationListModule } from './dropdown-navigation-list.component';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

const stories = storiesOf('Component Library/ui/Dropdown Navigation List', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiDropdownNavigationListModule],
        })
    );

const listData = [
    { label: 'Change my plan', url: 'https://siriusxm.com' },
    { label: 'Change my billing plan', url: 'https://siriusxm.com' },
    { label: 'Refresh radio signal', url: 'https://siriusxm.com' },
];

stories.add('default', () => ({
    template: `
        <div style="height: 300px">
            <sxm-ui-dropdown-navigation-list [buttonLabel]="{label: 'Modify'}" [listData]="listData"></sxm-ui-dropdown-navigation-list>
        </div>
    `,
    props: {
        listData: listData,
    },
}));

stories.add('with loading delay', () => ({
    template: `
        <div style="height: 300px">
            <sxm-ui-dropdown-navigation-list [buttonLabel]="{label: 'Modify'}" [listData]="listData$ | async"></sxm-ui-dropdown-navigation-list>
        </div>
    `,
    props: {
        listData$: of(listData).pipe(delay(5000)),
    },
}));
