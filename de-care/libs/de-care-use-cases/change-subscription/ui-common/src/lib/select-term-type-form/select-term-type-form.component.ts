import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UserSettingsService, SettingsService } from '@de-care/settings';
import { Observable } from 'rxjs';

export interface TermOptionInfo {
    monthlyPrice: number;
    annualPrice: number;
    currentPlanTermType: TermType;
}

export type TermType = 'monthly' | 'annual' | null;

@Component({
    selector: 'select-term-type-form',
    templateUrl: './select-term-type-form.component.html',
    styleUrls: ['./select-term-type-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectTermTypeFormComponent {
    @Input() termOptionInfo: TermOptionInfo = null;
    @Input() set selectedTermType(termType: TermType) {
        if (!termType) {
            this._reset();
        }
    }
    @Input() currentLang: string;
    @Output() termSelected = new EventEmitter();
    translateKeyPrefix = 'deCareUseCasesChangeSubscriptionUiCommonModule.selectTermTypeFormComponent';
    termTypeSelected: TermType = null;
    selectionErrorMessage: boolean = false;
    isCanada: boolean;
    isQuebec: boolean;

    constructor(private readonly _settingsService: SettingsService, private readonly _userSettingsService: UserSettingsService) {
        this.isCanada = this._settingsService.isCanadaMode;
        this.isQuebec = this.isCanada && this._userSettingsService.isQuebec();
    }

    onSubmit(event): void {
        event.preventDefault();
        if (!this.termTypeSelected) {
            this.selectionErrorMessage = true;
        } else {
            this.selectionErrorMessage = false;
            this.termSelected.emit(this.termTypeSelected);
        }
    }

    onTermSelected(term): void {
        this.termTypeSelected = term;
        this.selectionErrorMessage = false;
    }

    private _reset(): void {
        this.termTypeSelected = null;
    }
}
