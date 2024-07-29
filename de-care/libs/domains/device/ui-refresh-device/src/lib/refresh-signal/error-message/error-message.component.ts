import { Component, Input } from '@angular/core';
import { RefreshErrorTypesEnum } from '../../refresh-error.enum';

@Component({
    selector: 'error-message',
    templateUrl: './error-message.component.html',
    styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent {
    errorMessageKey = 'refreshDevice.ErrorMessageComponent.TEXT_FAIL_SERVICE_NOT_AVAILABLE';
    _errorType: RefreshErrorTypesEnum;

    @Input() set errorType(value: RefreshErrorTypesEnum) {
        if (value !== this._errorType) {
            this.errorMessageKey = `refreshDevice.ErrorMessageComponent.${value}`;
        }
    }
}
