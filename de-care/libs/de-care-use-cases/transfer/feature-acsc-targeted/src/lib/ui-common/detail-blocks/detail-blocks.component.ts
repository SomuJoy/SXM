import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { PortDetailFooter } from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { BehaviorSubject, combineLatest } from 'rxjs';

interface DetailData {
    type: 'car' | 'subscription';
    title?: string;
    ymm?: string;
    radioId?: string;
    footer?: PortDetailFooter;
    trialEndDate?: string;
    subResumeDate?: string;
}
@Component({
    selector: 'sxm-ui-detail-blocks',
    template: `
        <table>
            <tr *ngFor="let block of details$ | async">
                <td>
                    <sxm-ui-listener-details [listenerData]="block">
                        <p>{{ block.description }}</p>
                    </sxm-ui-listener-details>
                </td>
            </tr>
            <ng-content></ng-content>
        </table>
    `,
    styleUrls: ['./detail-blocks.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiDetailBlocksComponent {
    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.SxmUiDetailBlocks';
    @Input() set detailData(data: DetailData[]) {
        this._detailData$.next(data);
    }
    private _detailData$ = new BehaviorSubject<DetailData[]>(null);
    details$ = combineLatest([this._translateService.stream(this.translateKeyPrefix), this._detailData$]).pipe(
        map(([detailText, detailData]) =>
            detailData?.map((data, index) => ({
                eyebrow: detailText?.[`EYEBROW_${data.type?.toUpperCase()}_${index}`],
                title: data.title ?? data.ymm ?? (data.radioId ? `${detailText?.['RADIO_ID']}${data.radioId}` : null),
                description: data.trialEndDate
                    ? `${detailText?.['TRIAL_ENDS']}${data.trialEndDate}`
                    : data.subResumeDate
                    ? `${detailText?.['SUBSCRIPTION_RESUMES']}${data.subResumeDate}`
                    : null,
                footer: detailText?.[data.footer] ?? null,
            }))
        )
    );

    constructor(private readonly _translateService: TranslateService) {}
}
