export interface PasswordRules {
    primary: {
        minimumCharsPresented: boolean;
    };
    secondary: {
        numbersPresented: boolean;
        symbolsPresented: boolean;
        lowerLettersPresented: boolean;
        upperLettersPresented: boolean;
    };
    passingPrimaryRules?: number;
    passingSecondaryRules?: number;
}

/**
 * Tests the provided password for password rules
 * @param pwd
 */
export function generatePasswordRules(pwd: string): PasswordRules {
    const rules = {
        primary: {
            minimumCharsPresented: /(.){8}/.test(pwd)
        },
        secondary: {
            numbersPresented: /\d/.test(pwd),
            lowerLettersPresented: /[a-z]/.test(pwd),
            upperLettersPresented: /[A-Z]/.test(pwd),
            symbolsPresented: /[!%&@#$^*?_~()-+,=]/.test(pwd)
        }
    };
    return {
        ...rules,
        ...{
            passingSecondaryRules: Object.values(rules.secondary).filter(i => i).length,
            passingPrimaryRules: Object.values(rules.primary).filter(i => i).length
        }
    };
}
