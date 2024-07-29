import { Settings } from '@de-care/settings';
import { ElementsSettings } from '@de-care/elements';

export const environment = {
    production: true,
    elementsSettings: {
        rflzSuccessUrl: '',
        flepzSuccessUrl: '',
        nouvRtpUrl: '',
        promocodeValidationBaseRedirectUrl: '',
        rflzErrorCodeStreamingRedirectUrl: '',
        rflzErrorCodeFlepzRedirectUrl: '',
        streamingFlepzSuccessUrl: ''
    } as ElementsSettings,
    settings: {
        apiUrl: 'https://dex-dev.corp.siriusxm.com/dvgllvdexoac02-17160-care',
        apiPath: '/services',
        oacUrl: 'https://careqa.siriusxm.com/OAC-US-1526/',
        ndClientEnabled: true,
        ndClientId: 'w-440133',
        country: 'us'
    } as Settings
};
