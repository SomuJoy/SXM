import { Mock } from 'ts-mockery';
import { IdentificationMode, IdentificationModeService } from './identification-mode.service';

describe('IdentificationModeService', () => {
    describe('getIdentificationModes', () => {
        describe('default', () => {
            it('should return flepz and car info with flepz selected by default', () => {
                const service = new IdentificationModeService(Mock.of<Document>({ location: { search: '' } }));
                const expected: IdentificationMode[] = [
                    { type: 'car-info', isSelected: true },
                    { type: 'account-info', isSelected: false },
                ];
                expect(service.getIdentificationModes()).toEqual(expected);
            });
        });

        describe('search mode', () => {
            it('should return default with car info selected when search mode is radio id', () => {
                const service = new IdentificationModeService(Mock.of<Document>({ location: { search: '?searchmode=rid_search' } }));
                const expected: IdentificationMode[] = [
                    { type: 'car-info', isSelected: false },
                    { type: 'account-info', isSelected: true },
                ];
                expect(service.getIdentificationModes()).toEqual(expected);
            });
            it('should return default with flepz selected when search mode is flepz', () => {
                const service = new IdentificationModeService(Mock.of<Document>({ location: { search: '?searchmode=flepz_search' } }));
                const expected: IdentificationMode[] = [
                    { type: 'car-info', isSelected: true },
                    { type: 'account-info', isSelected: false },
                ];
                expect(service.getIdentificationModes()).toEqual(expected);
            });
            it('should return default with flepz selected when search mode is not a known mode', () => {
                const service = new IdentificationModeService(Mock.of<Document>({ location: { search: '?searchmode=unknown' } }));
                const expected: IdentificationMode[] = [
                    { type: 'car-info', isSelected: true },
                    { type: 'account-info', isSelected: false },
                ];
                expect(service.getIdentificationModes()).toEqual(expected);
            });
        });

        describe('direct mailer', () => {
            it('should return account id and flepz with account id selected when direct mailer is indicated', () => {
                const service = new IdentificationModeService(Mock.of<Document>({ location: { search: '?tbView=DM' } }));
                const expected: IdentificationMode[] = [
                    { type: 'radio-info', isSelected: true },
                    { type: 'account-info', isSelected: false },
                ];
                expect(service.getIdentificationModes()).toEqual(expected);
            });
            it('should not include account id in the modes when direct mailer is incorrectly indicated', () => {
                const service = new IdentificationModeService(Mock.of<Document>({ location: { search: '?tbView=incorrect' } }));
                const modes = service.getIdentificationModes();
                expect(modes.some((mode) => mode.type === 'radio-info')).toBe(false);
            });
        });
    });
});
