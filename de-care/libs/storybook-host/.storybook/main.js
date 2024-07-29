const rootMain = require('../../../.storybook/main');

module.exports = {
    ...rootMain,
    core: { ...rootMain.core, builder: 'webpack5' },
    stories: [...rootMain.stories, '../../../libs/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
    addons: [...rootMain.addons],
};
