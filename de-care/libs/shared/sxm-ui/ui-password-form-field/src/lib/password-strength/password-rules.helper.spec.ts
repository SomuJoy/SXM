import { generatePasswordRules } from './password-rules.helper';

describe('Password strength helper functions', () => {
    describe('generates blank password rules object', () => {
        it('generateBlankPasswordRules() returns PasswordRules object with correct properties', () => {
            const mockBlank = generatePasswordRules('');
            expect(mockBlank.primary).toBeDefined();
            expect(mockBlank.primary.minimumCharsPresented).toBeDefined();
            expect(mockBlank.secondary).toBeDefined();
            expect(mockBlank.secondary.lowerLettersPresented).toBeDefined();
            expect(mockBlank.secondary.numbersPresented).toBeDefined();
            expect(mockBlank.secondary.symbolsPresented).toBeDefined();
            expect(mockBlank.secondary.upperLettersPresented).toBeDefined();
        });
        it('generateBlankPasswordRules() returns PasswordRules object with default values of false', () => {
            const mockBlank = generatePasswordRules('');
            expect(mockBlank.primary.minimumCharsPresented).toBe(false);
            expect(mockBlank.secondary.lowerLettersPresented).toBe(false);
            expect(mockBlank.secondary.numbersPresented).toBe(false);
            expect(mockBlank.secondary.symbolsPresented).toBe(false);
            expect(mockBlank.secondary.upperLettersPresented).toBe(false);
        });
    });

    describe('Password value - is blank', () => {
        const mockPwd = '';
        const mockRules = generatePasswordRules(mockPwd);

        it('...should result in no passing rules', () => {
            expect(mockRules.passingPrimaryRules).toBe(0);
            expect(mockRules.passingSecondaryRules).toBe(0);
            expect(mockRules.primary.minimumCharsPresented).toBe(false);
            expect(mockRules.secondary.numbersPresented).toBe(false);
            expect(mockRules.secondary.symbolsPresented).toBe(false);
            expect(mockRules.secondary.lowerLettersPresented).toBe(false);
            expect(mockRules.secondary.upperLettersPresented).toBe(false);
        });
    });

    // Minimum of 8 characters is not met
    // At least 3 out of the 4 secondary rules are not met
    describe('Test Password: m', () => {
        const mockPwd = 'm';
        const mockRules = generatePasswordRules(mockPwd);
        it('...should result in ONE passing PRIMARY rule and ONE passing SECONDARY rule', () => {
            expect(mockRules.passingPrimaryRules).toBe(0);
            expect(mockRules.passingSecondaryRules).toBe(1);
        });
    });
    describe('Test Password: mM', () => {
        const mockPwd = 'mM';
        const mockRules = generatePasswordRules(mockPwd);
        it('...should result in ONE passing PRIMARY rule and ONE passing SECONDARY rule', () => {
            expect(mockRules.passingPrimaryRules).toBe(0);
            expect(mockRules.passingSecondaryRules).toBe(2);
        });
    });
    describe('Test Password: mM1', () => {
        const mockPwd = 'mM1';
        const mockRules = generatePasswordRules(mockPwd);
        it('...should result in ONE passing PRIMARY rule and ONE passing SECONDARY rule', () => {
            expect(mockRules.passingPrimaryRules).toBe(0);
            expect(mockRules.passingSecondaryRules).toBe(3);
        });
    });
    describe('Test Password: mM1$', () => {
        const mockPwd = 'mM1$';
        const mockRules = generatePasswordRules(mockPwd);
        it('...should result in ONE passing PRIMARY rule and ONE passing SECONDARY rule', () => {
            expect(mockRules.passingPrimaryRules).toBe(0);
            expect(mockRules.passingSecondaryRules).toBe(4);
        });
    });
    describe('Test Password: meowMeow', () => {
        const mockPwd = 'meowMeow';
        const mockRules = generatePasswordRules(mockPwd);
        it('...should result in ONE passing PRIMARY rule and ONE passing SECONDARY rule', () => {
            expect(mockRules.passingPrimaryRules).toBe(1);
            expect(mockRules.passingSecondaryRules).toBe(2);
        });
    });

    // When the main condition + 3 of the secondary rules are met
    describe('Test Password: meowMeow123', () => {
        const mockPwd = 'meowMeow123';
        const mockRules = generatePasswordRules(mockPwd);
        it('...should result in ONE passing PRIMARY rule and THREE passing SECONDARY rule', () => {
            expect(mockRules.passingPrimaryRules).toBe(1);
            expect(mockRules.passingSecondaryRules).toBe(3);
        });
    });

    // Primary and all 4 secondary rules are satisfied
    describe('Test Password: meowMeow123@', () => {
        const mockPwd = 'meowMeow123@';
        const mockRules = generatePasswordRules(mockPwd);
        it('...should result in ONE passing PRIMARY rule and FOUR passing SECONDARY rule', () => {
            expect(mockRules.passingPrimaryRules).toBe(1);
            expect(mockRules.passingSecondaryRules).toBe(4);
        });
    });
});
