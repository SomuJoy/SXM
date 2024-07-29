import { Component, HostBinding, Input } from '@angular/core';

type widthConfigurations = 'fullWidthContent' | 'mainWideContent';

@Component({
    /*
    Usage examples (default):

        <header deCarePageFullWidthContent></header>

        <footer deCarePageFullWidthContent></footer>

    Usage examples (width config):

        <header deCarePageFullWidthContent="mainWideContent"></header>
     */
    selector: '[deCarePageFullWidthContent]',
    // the <div> here is to provide a way to do a full width background on the host
    // but render the content with column offset (applying the column layout to the <div>)
    // ...maybe we can find a way to support background on the host while having the host define the column offset too?
    template: `<div><ng-content></ng-content></div>`,
    styleUrls: ['./page-full-width-content.component.scss'],
})
export class PageFullWidthContentComponent {
    @HostBinding('class.main-wide-content') private _mainWideContent = false;
    @Input('deCarePageFullWidthContent') set widthConfiguration(value: widthConfigurations) {
        switch (value) {
            case 'mainWideContent': {
                this._mainWideContent = true;
                break;
            }
            case 'fullWidthContent':
            default: {
                this._mainWideContent = false;
                break;
            }
        }
    }
}
