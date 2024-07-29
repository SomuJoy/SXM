import { Component, ChangeDetectionStrategy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LanguageResources } from '@de-care/shared/translation';

@Component({
    selector: 'sxm-ui-nfl-opt-in',
    templateUrl: './nfl-opt-in.component.html',
    styleUrls: ['./nfl-opt-in.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiNflOptInComponent implements OnInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    form: FormGroup;
    @Output() submitVerifyAccountForm: EventEmitter<any> = new EventEmitter<any>();

    constructor(private _formBuilder: FormBuilder) {}

    onSelect() {
        this.submitVerifyAccountForm.emit({ nflForOptIn: this.form.get('optInForNFL').value });
    }

    ngOnInit() {
        this.form = this._formBuilder.group({
            optInForNFL: [false],
        });
    }
}
