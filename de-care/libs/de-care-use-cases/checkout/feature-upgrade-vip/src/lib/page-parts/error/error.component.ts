import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SettingsService } from '@de-care/settings';
@Component({
    selector: 'de-care-error',
    template: `
        <ng-container *ngIf="errorCode">
            <hero-component [headerState]="translateKeyPrefix + 'ERROR.' + errorCode + '.HEADER' | translate" class="no-package-card-padding"></hero-component>
            <main class="background-white main-content">
                <div class="content-container">
                    <div class="row align-center no-padding-small">
                        <div class="column medium-2 no-padding background-white"></div>
                        <div class="column small-12 medium-6 background-white">
                            <p
                                class="error-message-padding fluid-text-align"
                                [innerHtml]="translateKeyPrefix + 'ERROR.' + errorCode + '.MESSAGE' | translate: { oacUrl: oacUrl }"
                            ></p>
                        </div>
                        <div class="column medium-2 no-padding background-white"></div>
                    </div>
                </div>
            </main>
        </ng-container>
    `,
    styleUrls: ['./error.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
    @Input() errorCode: string;
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeVipModule.PurchasePageComponent.';

    public readonly oacUrl = this._settingService.settings.oacUrl;
    constructor(private readonly _settingService: SettingsService) {}
}
