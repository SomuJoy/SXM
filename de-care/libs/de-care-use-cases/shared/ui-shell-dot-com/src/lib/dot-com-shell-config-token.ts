import { InjectionToken } from '@angular/core';

export interface DotComShellConfig {
    navigationDomain: string;
    assetDomain: string;
    sxmNavWidgetJavascriptPath: string;
    sxmNavWidgetEnvironment?: string;

    // Client Side Config
    // importJquery: boolean,
    // sxmNavCssPath: string,
    // sxmNavJavascriptPath: string,
    // lang?: string
}

export const DEFAULT_DOT_COM_SHELL_CONFIG_US: DotComShellConfig = {
    navigationDomain: 'https://www.siriusxm.com',
    assetDomain: 'https://www.siriusxm.com',
    sxmNavWidgetJavascriptPath: '/cms/static/global/js/minified/sxm.navwidget.min.js'
};

export const DEFAULT_DOT_COM_SHELL_CONFIG_CANADA: DotComShellConfig = {
    navigationDomain: 'https://www.siriusxm.com',
    assetDomain: 'https://www.siriusxm.com',
    sxmNavWidgetJavascriptPath: '/cms/static/global/js/minified/sxm.navwidget.min.js',
    // sxmNavWidgetEnvironment: 'staging',
};

export const DOT_COM_SHELL_CONFIG = 'DOT_COM_SHELL_CONFIG';

export const DotComShellConfigToken = new InjectionToken<DotComShellConfig>(DOT_COM_SHELL_CONFIG);