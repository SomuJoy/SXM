import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CMS_API_BASE_URL } from '@de-care/shared/configuration-tokens-cms';
import { APPLICATION_ROUTES } from './app.routes';
import { environment } from '../environments/environment';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(APPLICATION_ROUTES, { initialNavigation: 'enabledBlocking' }),
        TranslateModule.forRoot(),
    ],
    providers: [{ provide: CMS_API_BASE_URL, useValue: environment.settings.cmsUrlBase }],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(translateService: TranslateService) {
        translateService.setDefaultLang('en-US');
    }
}
