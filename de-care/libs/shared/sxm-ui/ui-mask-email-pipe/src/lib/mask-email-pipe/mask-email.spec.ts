import { MaskEmailPipe } from './mask-email.pipe';

describe('mask email pipe', () => {
    const pipe = new MaskEmailPipe();

    it('should return first letter, 5 asterisks, and the @email when given an email', () => {
        expect(pipe.transform('gogogadget@yahoo.com')).toBe('g*****@yahoo.com');
    });

    it('should return letters for passed in length, 5 asterisks, and the @email when given an email and length', () => {
        expect(pipe.transform('gogogadget@yahoo.com', 3)).toBe('gog*****@yahoo.com');
    });

    it('should return the same input if the email is already masked', () => {
        expect(pipe.transform('g*****@yahoo.com')).toBe('g*****@yahoo.com');
    });
});
