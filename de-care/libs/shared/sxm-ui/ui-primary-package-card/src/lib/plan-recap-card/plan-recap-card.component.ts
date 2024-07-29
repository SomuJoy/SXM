import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { pluck, startWith } from 'rxjs/operators';

@Component({
    selector: 'sxm-ui-plan-recap-card',
    template: `
        <article *ngrxLet="currentLang$ as currentLang">
            <p *ngIf="data?.description" [innerHTML]="data?.description"></p>
        </article>
    `,
    styleUrls: ['./plan-recap-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiPlanRecapCardComponent {
    translateKeyPrefix = 'SharedSxmUiUiPrimaryPackageCardModule.SxmUiPlanRecapCardComponent.';
    @Input() data: {
        description: string;
    };
    currentLang$ = this._translateService.onLangChange.pipe(
        startWith({
            lang: this._translateService.currentLang,
            translations: null,
        } as LangChangeEvent),
        pluck('lang')
    );

    constructor(readonly _translateService: TranslateService) {}
}
