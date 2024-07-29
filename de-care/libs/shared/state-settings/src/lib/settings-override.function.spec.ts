import { settingsOverride } from './settings-override.function';

describe('settingsOverride', () => {
    it('should return same value if override is null or undefined', () => {
        const settings = initMockSettings();
        expect(settingsOverride(settings, null)).toEqual(settings);
        expect(settingsOverride(settings, undefined)).toEqual(settings);
    });
    it('should return a new object when override is sent in', () => {
        const settings = initMockSettings();
        const result = settingsOverride(settings, { apiUrl: 'newValue' });
        expect(result).not.toStrictEqual(settings);
    });
    it('should override only the fields sent in', () => {
        const settings = initMockSettings();
        settings.country = 'ca';
        const result = settingsOverride(settings, { apiUrl: 'newValue' });
        expect(result.apiUrl).toBe('newValue');
        expect(result.country).toBe('ca');
    });
});

function initMockSettings() {
    return {
        apiPath: '',
        apiUrl: '',
        country: 'us',
        isOem: false,
        ndClientEnabled: false,
        ndClientId: '',
        oacUrl: '',
        sheerIdIdentificationWidgetUrl: '',
        sheerIdIdentificationReVerificationWidgetUrl: '',
        enableCVV: false,
        chatProvider: 'liveperson'
    };
}
