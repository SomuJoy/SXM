import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';

import { Component, OnInit } from '@angular/core';
import { ValidateAndCollectDeviceMinActivationCodeWorkflowService } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { ActivatedRoute, Router } from '@angular/router';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-activate-device-min-page',
    templateUrl: './activate-device-min-page.component.html',
    styleUrls: ['./activate-device-min-page.component.scss'],
})
export class ActivateDeviceMinPageComponent implements OnInit, ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _validateAndCollectDeviceMinActivationCodeWorkflowService: ValidateAndCollectDeviceMinActivationCodeWorkflowService,
        private _router: Router,
        private readonly _activatedRoute: ActivatedRoute
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this._validateAndCollectDeviceMinActivationCodeWorkflowService.build().subscribe({
            next: (data) => {
                if (data) {
                    this._router.navigate(['../sign-in/sonos'], { relativeTo: this._activatedRoute });
                } else {
                    this._router.navigate(['../activate-device'], { relativeTo: this._activatedRoute });
                }
            },
            error: () => {
                this._router.navigate(['../activate-device'], { relativeTo: this._activatedRoute });
            },
        });
    }
}
