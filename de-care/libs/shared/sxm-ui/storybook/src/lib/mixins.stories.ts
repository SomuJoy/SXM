import { SXM_UI_STORYBOOK_STORIES } from './sxm-ui.stories';

SXM_UI_STORYBOOK_STORIES.add('mixins: checkmark list with subdescription', () => ({
    template: `
    <ul class="checkmark-list-with-subdescription">
        <li>
            <p><strong>2017 Nissan Rogue</strong></p>
            <p>XM All Access</p>
        </li>
    </ul>
    `
}));
