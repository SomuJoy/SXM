import { UserSettingsService } from './user-settings.service';
import { hot } from '@nrwl/angular/testing';
import { LANGUAGE_CODES } from '@de-care/shared/state-settings';
import { async, TestBed } from '@angular/core/testing';

describe('user-settings service', () => {
    let svc: UserSettingsService;
    beforeEach(async(() => {
        const testBed = TestBed.configureTestingModule({
            providers: [UserSettingsService]
        });
        svc = testBed.inject(UserSettingsService);
    }));
    describe('Instantiations', () => {
        it('should initialize', () => {
            svc = new UserSettingsService();

            expect(svc.isQuebec$).toBeObservable(hot('a', { a: false }));
            expect(svc.selectedCanadianProvince$).toBeObservable(hot('a', { a: 'ON' }));
            expect(svc.provinceSelectionDisabled$).toBeObservable(hot('a', { a: false }));
            expect(svc.provinceSelectionVisible$).toBeObservable(hot('a', { a: false }));
            expect(svc.dateFormat$).toBeObservable(hot('a', { a: 'MM/dd/y' }));
        });
    });

    describe('setSelectedCanadianProvince', () => {
        it('should respond to QC', () => {
            svc = new UserSettingsService();

            svc.setSelectedCanadianProvince('QC');

            expect(svc.isQuebec()).toEqual(true);
            expect(svc.isQuebec$).toBeObservable(hot('a', { a: true }));
            expect(svc.selectedCanadianProvince$).toBeObservable(hot('a', { a: 'QC' }));
        });

        it('should not respond to AB', () => {
            svc = new UserSettingsService();

            svc.setSelectedCanadianProvince('AB');

            expect(svc.isQuebec()).toEqual(false);
            expect(svc.isQuebec$).toBeObservable(hot('a', { a: false }));
            expect(svc.selectedCanadianProvince$).toBeObservable(hot('a', { a: 'AB' }));
        });
    });

    describe('dateFormat', () => {
        it('should respond to EN_CA', () => {
            svc = new UserSettingsService();

            svc.setDateFormatBasedOnLocale(LANGUAGE_CODES.EN_CA);

            expect(svc.dateFormat$).toBeObservable(hot('a', { a: 'MMMM d, y' }));
        });

        it('should respond to FR_CA', () => {
            svc = new UserSettingsService();

            svc.setDateFormatBasedOnLocale(LANGUAGE_CODES.FR_CA);

            expect(svc.dateFormat$).toBeObservable(hot('a', { a: 'd MMMM y' }));
        });

        it('should respond to EN_US', () => {
            svc = new UserSettingsService();

            svc.setDateFormatBasedOnLocale(LANGUAGE_CODES.EN_US);

            expect(svc.dateFormat$).toBeObservable(hot('a', { a: 'MM/dd/y' }));
        });
    });

    describe('setProvinceSelectionDisabled', () => {
        it('should respond to EN_CA', () => {
            svc = new UserSettingsService();
            expect(svc.provinceSelectionDisabled$).toBeObservable(hot('a', { a: false }));

            svc.setProvinceSelectionDisabled(true);

            expect(svc.provinceSelectionDisabled$).toBeObservable(hot('a', { a: true }));
        });
    });

    describe('setProvinceSelectionVisible', () => {
        it('should respond to EN_CA', () => {
            svc = new UserSettingsService();
            expect(svc.provinceSelectionVisible$).toBeObservable(hot('a', { a: false }));

            svc.setProvinceSelectionVisible(true);

            expect(svc.provinceSelectionVisible$).toBeObservable(hot('a', { a: true }));
        });
    });
});
