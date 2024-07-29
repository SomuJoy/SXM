import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'de-care-page-footer-basic',
    template: `
        <section id="footerLinks">
            <ul>
                <li *ngFor="let link of translateKeyPrefix + 'LINKS_SET_1' | translate">
                    <a [href]="link.LINK_URL" class="tracklink" target="_blank" rel="">{{ link.LINK_TEXT }}</a>
                </li>
            </ul>
            <ul>
                <li *ngFor="let link of translateKeyPrefix + 'LINKS_SET_2' | translate">
                    <a *ngIf="link.LINK_URL" [href]="link.LINK_URL" class="{{ link.LINK_CSS }} tracklink" target="_blank" rel=""
                        >{{ link.LINK_TEXT }}<img *ngIf="link.LINK_IMG" src="{{ link.LINK_IMG }}"
                    /></a>
                    <a *ngIf="!link.LINK_URL" class="{{ link.LINK_CSS }} tracklink" target="_blank" rel=""
                        >{{ link.LINK_TEXT }}<img *ngIf="link.LINK_IMG" src="{{ link.LINK_IMG }}"
                    /></a>
                </li>
            </ul>
        </section>
        <section id="copyright">
            © <span class="year">{{ currentYear }}</span> {{ translateKeyPrefix + 'COPYRIGHT_TEXT' | translate }}
        </section>
    `,
    styleUrls: ['./page-footer-basic.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageFooterBasicComponent {
    translateKeyPrefix = 'DeCareSharedUiPageFooterBasicModule.PageFooterBasicComponent.';
    date = new Date();
    currentYear = this.date.getFullYear();
}
