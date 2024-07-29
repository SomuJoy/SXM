import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';

const theme = create({
    base: 'light',
    brandTitle: 'SiriusXM',
    brandUrl: 'https://www.siriusxm.com',
    brandImage: 'https://www.siriusxm.com/sxm/img/global/nav-r/logo-r.png',
});

addons.setConfig({
    panelPosition: 'bottom',
    theme,
});
