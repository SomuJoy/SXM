export const enum ShellComponentThemingFooterBorder {
    NONE = 'remove-border'
}

export interface ShellComponentTheming {
    footer: {
        border: ShellComponentThemingFooterBorder;
    };
}
