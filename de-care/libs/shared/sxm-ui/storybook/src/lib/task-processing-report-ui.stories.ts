import { SXM_UI_STORYBOOK_STORIES } from './sxm-ui.stories';

SXM_UI_STORYBOOK_STORIES.add('task processing report icons', () => ({
    template: `
    <svg class="icon icon-utility extra-wide">
        <use class="icon-checkmark-lg" xlink:href="#icon-checkmark-lg"></use>
    </svg>
    <svg class="icon icon-utility large no-padding error">
        <use class="icon-remove" xlink:href="#icon-remove"></use>
    </svg>
    `
}));
