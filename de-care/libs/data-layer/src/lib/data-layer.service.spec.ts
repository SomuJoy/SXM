import { Mock } from 'ts-mockery';
import { EventEmitter } from '@angular/core';
import { DataLayerService } from './data-layer.service';
import { UserSettingsService } from '@de-care/settings';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { NEVER } from 'rxjs';
import { DataLayerModel } from '@de-care/data-services';
import { DataTrackerService } from '@de-care/shared/data-tracker';
import { CoreLoggerService } from './logs/console-logger.service';

describe('DataLayerService', () => {
    const mockLangChangeEmitter = new EventEmitter<LangChangeEvent>();
    const mockDataTrackerService = Mock.of<DataTrackerService>({});
    const userSettingsService = Mock.of<UserSettingsService>({
        selectedCanadianProvince$: NEVER
    });
    const translateService = Mock.of<TranslateService>({
        onLangChange: mockLangChangeEmitter
    });
    const coreLoggerService = Mock.of<CoreLoggerService>({
        info: jest.fn(),
        debug: jest.fn()
    });
    interface MyWin extends Window {
        digitalData: DataLayerModel;
    }

    interface MyDocument extends Document {
        defaultView: MyWin & typeof globalThis;
    }
    describe('interaction with digitalData on window', () => {
        it('should create digitalData if not present', () => {
            const document = Mock.of<Document>({
                defaultView: {}
            });

            new DataLayerService(mockDataTrackerService, userSettingsService, translateService, coreLoggerService, document);
            expect(document.defaultView).toHaveProperty('digitalData', { isReady: false });
        });

        it('should reuse existing object reference', () => {
            const mockDigitalData: DataLayerModel | {} = {};

            const document = Mock.of<MyDocument>({
                defaultView: {
                    digitalData: mockDigitalData
                }
            });

            new DataLayerService(mockDataTrackerService, userSettingsService, translateService, coreLoggerService, document);

            expect(document.defaultView.digitalData).toBe(mockDigitalData); // Same object reference
        });

        it('update should reuse existing object reference', () => {
            const mockDigitalData: DataLayerModel | {} = {};

            const document = Mock.of<MyDocument>({
                defaultView: {
                    digitalData: mockDigitalData
                }
            });

            const service = new DataLayerService(mockDataTrackerService, userSettingsService, translateService, coreLoggerService, document);

            service.update('someParam', 'test');

            expect(document.defaultView.digitalData).toBe(mockDigitalData); // Same object reference
            expect(document.defaultView).toHaveProperty('digitalData', { isReady: true, someParam: 'test' });
        });
    });
});
