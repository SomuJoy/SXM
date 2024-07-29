import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { getSxmValidator } from '@de-care/shared/validation';
import { TabInfo } from '@de-care/shared/sxm-ui/ui-tabs';
import * as uuid from 'uuid/v4';
import { SendRefreshSignalWorkflowService, SendTextInstructionsWorkflowService } from '@de-care/domains/device/state-device-refresh';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RefreshErrorTypesEnum } from '../../refresh-error.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'activate-radio',
    templateUrl: './activate-radio.component.html',
    styleUrls: ['./activate-radio.component.scss'],
})
export class ActivateRadioComponent implements OnInit, OnDestroy {
    textInstructionsForm: FormGroup;

    submitted = false;
    isInvalidPhone = false;
    tabInfoYes: TabInfo = {
        id: 'yes-tab',
        qaTag: 'YesTabLink',
        index: 0,
        isSelected: true,
    };
    tabInfoNo: TabInfo = {
        id: 'no-tab',
        qaTag: 'NoTabLink',
        index: 1,
        isSelected: false,
    };

    @Input() radioId = '';
    @Input() phone = '';
    @Input() outsideCarSteps = true;
    @Output() userInCar = new EventEmitter<boolean>();
    @Output() activeComponentUpdate = new EventEmitter<string>();
    @Output() refreshError = new EventEmitter<RefreshErrorTypesEnum>();

    readonly outsideCarLegalId = uuid();
    readonly phoneId = uuid();

    refreshTypeUseInCar: boolean;

    get formControls(): {
        [key: string]: AbstractControl;
    } {
        return this.textInstructionsForm.controls;
    }

    private unsubscribe$: Subject<void> = new Subject();

    constructor(
        private formBuilder: FormBuilder,
        private _sendRefreshSignalService: SendRefreshSignalWorkflowService,
        private _sendTextInstructionsService: SendTextInstructionsWorkflowService,
        private readonly _translateService: TranslateService
    ) {}

    ngOnInit() {
        this.textInstructionsForm = this.startTextInstructionsForm();
        // Notify parent that userInCar tab is selected by default
        this.userInCar.emit(true);
        this.refreshTypeUseInCar = true;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    tabSelected($event: TabInfo) {
        // If user the "Yes Tab" (ie the "In Car Tab), return true
        this.refreshTypeUseInCar = $event.id === 'yes-tab';
        this.userInCar.emit($event.id === 'yes-tab');
    }

    sendRefreshSignal() {
        this._sendRefreshSignalService
            .build({ ...(this.radioId && { radioId: this.radioId }), ...(this.phone && { phone: this.phone }) })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (response) => {
                    if (response) {
                        this.activeComponentUpdate.emit('success-message');
                    } else {
                        this.activeComponentUpdate.emit('error-message');
                    }
                },
                (error) => this._handleRefreshServiceErrors(error)
            );
    }

    sendTextInstructions() {
        this.submitted = true;
        if (this.textInstructionsForm.valid) {
            const phone = this.textInstructionsForm.value.phoneNumber;
            const languagePreference = this._normalizeLangToLocale(this._translateService.currentLang);

            this._sendTextInstructionsService
                .build({ phone, radioId: this.radioId, languagePreference })
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(
                    (response) => {
                        if (response) {
                            this.activeComponentUpdate.emit('success-message');
                        } else {
                            this.activeComponentUpdate.emit('error-message');
                        }
                    },
                    (_) => this._handleTextServiceError()
                );
        }
    }

    private _handleRefreshServiceErrors(err: { status: number }) {
        this.activeComponentUpdate.emit('error-message');
        this.refreshError.emit(this._translateServiceError(err.status));
    }

    private _handleTextServiceError() {
        this.activeComponentUpdate.emit('error-message');
        this.refreshError.emit(RefreshErrorTypesEnum.TEXT_FAIL_SERVICE_NOT_AVAILABLE);
    }

    private _normalizeLangToLocale(locale: string): string {
        return locale?.replace('-', '_');
    }

    private _translateServiceError(errStatus: number): RefreshErrorTypesEnum {
        switch (errStatus) {
            case 429:
                return RefreshErrorTypesEnum.REFRESH_FAIL_MAXIMUM_LIMIT;
            case 409:
                return RefreshErrorTypesEnum.REFRESH_FAIL_MULTIPLE_REQUESTS;
            default: {
                if (this.refreshTypeUseInCar) {
                    return RefreshErrorTypesEnum.REFRESH_FAIL_GENERIC;
                } else {
                    return RefreshErrorTypesEnum.TEXT_FAIL_SERVICE_NOT_AVAILABLE;
                }
            }
        }
    }

    private startTextInstructionsForm(): FormGroup {
        return this.formBuilder.group({
            phoneNumber: this.formBuilder.control('', {
                updateOn: 'blur',
                validators: getSxmValidator('phoneNumber'),
            }),
            checkbox: this.formBuilder.control('', {
                updateOn: 'change',
                validators: getSxmValidator('agreement'),
            }),
        });
    }
}
