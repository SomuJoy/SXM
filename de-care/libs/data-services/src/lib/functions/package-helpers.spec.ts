import { changePackageNameForPlatform, getPlatformFromPackageName, getPlatformFromName, getNormalizedPackageName, mapPackageNameToListenOn } from './package-helpers';
import { ListenOn } from '../configs/listen-on.constant';
import { PackagePlatformEnum } from '../enums/package.enum';
import { boolean } from '@storybook/addon-knobs';

describe('package helpers functions', () => {
    describe('getPlatformFromPackageName', () => {
        it('should get XM platform enum', () => {
            expect(getPlatformFromPackageName('1_SIR_AUD_EVT')).toBe(PackagePlatformEnum.Xm);
        });
        it('should get SiriusXM platform enum', () => {
            expect(getPlatformFromPackageName('SXM_SIR_AUD_EVT')).toBe(PackagePlatformEnum.Siriusxm);
            expect(getPlatformFromPackageName('3_SIR_AUD_EVT')).toBe(PackagePlatformEnum.Siriusxm);
        });
        it('should get Sirius platform enum when key prefix not found', () => {
            expect(getPlatformFromPackageName('SIR_AUD_EVT')).toBe(PackagePlatformEnum.Sirius);
        });
    });

    describe('getPlatformFromName', () => {
        it('should get the XM platform enum', () => {
            expect(getPlatformFromName('xm')).toBe(PackagePlatformEnum.Xm);
            expect(getPlatformFromName('XM')).toBe(PackagePlatformEnum.Xm);
            expect(getPlatformFromName(' xm ')).toBe(PackagePlatformEnum.Xm);
        });
        it('should get the SiriusXM platform enum', () => {
            expect(getPlatformFromName('sxm')).toBe(PackagePlatformEnum.Siriusxm);
            expect(getPlatformFromName('SXM')).toBe(PackagePlatformEnum.Siriusxm);
            expect(getPlatformFromName(' sxm ')).toBe(PackagePlatformEnum.Siriusxm);
        });
        it('should get the Sirius platform enum', () => {
            expect(getPlatformFromName('sirius')).toBe(PackagePlatformEnum.Sirius);
        });
        it('should return null if platform name is not known', () => {
            expect(getPlatformFromName('analog')).toBe(null);
        });
        it('should return null when not passed in a string', () => {
            expect(getPlatformFromName(null)).toBe(null);
            expect(getPlatformFromName(undefined)).toBe(null);
            expect(getPlatformFromName(100 as any)).toBe(null);
        });
    });

    describe('changePackageNameForPlatform', () => {
        it('should change the package name prefix when platform is XM', () => {
            const result = changePackageNameForPlatform('SXM_SIR_AUD_EVT', PackagePlatformEnum.Xm);
            expect(result).toBe('1_SIR_AUD_EVT');
        });
        it('should remove the package name prefix when not SiriusXM or XM', () => {
            const result = changePackageNameForPlatform('SXM_SIR_AUD_EVT', PackagePlatformEnum.Sirius);
            expect(result).toBe('SIR_AUD_EVT');
        });
        it('should return the same value when package name already has requested platform prefix', () => {
            const result = changePackageNameForPlatform('SXM_SIR_AUD_EVT', PackagePlatformEnum.Siriusxm);
            expect(result).toBe('SXM_SIR_AUD_EVT');
        });
    });

    describe('getNormalizedPackageName', () => {
        it('should normalize the package name by replacing _AUD_ with _', () => {
            const result = getNormalizedPackageName('SXM_SIR_AUD_EVT');
            expect(result).toBe('SXM_SIR_EVT');
        });
        it('should normalize the package name by replacing _CAN_ with _', () => {
            const result = getNormalizedPackageName('SXM_SIR_CAN_EVT');
            expect(result).toBe('SXM_SIR_EVT');
        });
        it('should return a result of type object with expected properties found in ListenOn interface', () => {
            const result = mapPackageNameToListenOn('SXM_SIR_CAN_EVT');
            expect(result).toHaveProperty('insideTheCar');
            expect(result).toHaveProperty('outsideTheCar');
            expect(result).toHaveProperty('pandoraStations');
        });
        it('should return a result of type object with properties representing boolean values', () => {
            const result = mapPackageNameToListenOn('SXM_SIR_CAN_EVT');
            expect(typeof result.insideTheCar).toBe('boolean');
            expect(typeof result.outsideTheCar).toBe('boolean');
            expect(typeof result.pandoraStations).toBe('boolean');
        });
        it('should return a default value if no match found', () => {
            const def = <ListenOn>{ insideTheCar: false, outsideTheCar: false, pandoraStations: false };
            const result = mapPackageNameToListenOn('SXM_FOO_FOO_FOO');
            expect(result).toEqual(def);
        });
    });
});
