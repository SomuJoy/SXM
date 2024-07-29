import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { SxmUiButtonCtaComponentModule } from '@de-care/shared/sxm-ui/ui-button-cta';
import { SxmUiCheckboxCardWithIconAndLabelFormFieldComponentModule } from '@de-care/shared/sxm-ui/ui-checkbox-card-form-field';
import { SxmUiSkeletonLoaderPanelComponentModule } from '@de-care/shared/sxm-ui/ui-skeleton-loader-panel';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { suspensify } from '@jscutlery/operators';
import { TranslateModule } from '@ngx-translate/core';
import { timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxmcd-step-select-category-page',
    templateUrl: './step-select-category-page.component.html',
    styleUrls: ['./step-select-category-page.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        SxmUiSkeletonLoaderPanelComponentModule,
        SxmUiCheckboxCardWithIconAndLabelFormFieldComponentModule,
        SxmUiButtonCtaComponentModule,
    ],
})
export class StepSelectCategoryPageComponent implements ComponentWithLocale {
    translateKeyPrefix: string | undefined;
    languageResources: LanguageResources | undefined;
    categoryOptions$ = timer(4000).pipe(
        map(() => [
            { label: 'Music', id: 'cat1' },
            { label: 'Sports', id: 'cat2' },
            { label: 'Podcasts', id: 'cat3' },
            { label: 'Talk Radio', id: 'cat4' },
        ]),
        suspensify(),
        tap((categories) => {
            if (Array.isArray(categories.value)) {
                categories.value.forEach((category) => {
                    this.form.addControl(category.id, new FormControl());
                });
            }
        })
    );
    form = new UntypedFormGroup({});

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    submit() {
        console.log(this.form.value);
    }
}
