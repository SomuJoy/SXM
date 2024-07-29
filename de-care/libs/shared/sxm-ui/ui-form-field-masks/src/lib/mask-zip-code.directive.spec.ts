import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaskZipCodeDirective } from './mask-zip-code.directive';

@Component({
    template: `
        <input appMaskZipCode [zipMaskIsCanada]="isCanada" />
    `
})
export class TestComponent {
    isCanada = false;
    @ViewChild(MaskZipCodeDirective) maskZipCodeDirectiveInstance: MaskZipCodeDirective;
}

describe('MaskZipCodeDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let componentInstance: TestComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [MaskZipCodeDirective, TestComponent]
        });
        fixture = TestBed.createComponent(TestComponent);
        componentInstance = fixture.componentInstance;
    });

    it('Should call expected callbacks on input changes', async(() => {
        fixture.detectChanges();
        const changeCallbackSpy = jest.fn();
        const touchedCallbackSpy = jest.fn();
        componentInstance.maskZipCodeDirectiveInstance['_onChangeCallback'] = changeCallbackSpy;
        componentInstance.maskZipCodeDirectiveInstance['_onTouchedCallback'] = touchedCallbackSpy;
        const input = fixture.nativeElement.querySelector('input');
        input.dispatchEvent(new Event('focus'));
        input.value = '12345';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable();
        expect(changeCallbackSpy).toHaveBeenCalled();
        expect(touchedCallbackSpy).toHaveBeenCalled();
    }));

    it('Should call expected callbacks after changes and blur', async(() => {
        fixture.detectChanges();
        const touchedCallbackSpy = jest.fn();
        const input = fixture.nativeElement.querySelector('input');
        input.dispatchEvent(new Event('focus'));
        input.value = '12345';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        input.value = '';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        componentInstance.maskZipCodeDirectiveInstance['_onTouchedCallback'] = touchedCallbackSpy;
        input.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(touchedCallbackSpy).toHaveBeenCalled();
    }));

    it('Should have correct max length in US', async(() => {
        const input = fixture.nativeElement.querySelector('input');
        fixture.detectChanges();
        expect(input.getAttribute('maxlength')).toBe('10');
    }));

    it('Should format correctly if the user inputs the whole value in US', async(() => {
        const input = fixture.nativeElement.querySelector('input');
        input.value = '123456789';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(input.value).toBe('12345-6789');
    }));

    it('Should format correctly if the user inputs first 6 numbers in US', async(() => {
        const input = fixture.nativeElement.querySelector('input');
        input.value = '123456';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(input.value).toBe('12345-6');
    }));

    it('Should add a dash after an space in US', async(() => {
        const input = fixture.nativeElement.querySelector('input');
        input.value = '12345 ';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(input.value).toBe('12345-');
    }));

    it('Should have correct max length in Canada', async(() => {
        const input = fixture.nativeElement.querySelector('input');
        componentInstance.isCanada = true;
        fixture.detectChanges();
        expect(input.getAttribute('maxlength')).toBe('7');
    }));

    it('Should format correctly if the user inputs the whole value in Canada', async(() => {
        const input = fixture.nativeElement.querySelector('input');
        componentInstance.isCanada = true;
        fixture.detectChanges();
        input.value = 'A1A1A1';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(input.value).toBe('A1A 1A1');
    }));

    it('Should format correctly if the user inputs first four values in Canada', async(() => {
        const input = fixture.nativeElement.querySelector('input');
        componentInstance.isCanada = true;
        fixture.detectChanges();
        input.value = 'A1A1';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(input.value).toBe('A1A 1');
    }));

    it('Should replace the invalid char with an space after three valid chars in Canada', async(() => {
        const input = fixture.nativeElement.querySelector('input');
        componentInstance.isCanada = true;
        fixture.detectChanges();
        input.value = 'A1A-';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(input.value).toBe('A1A ');
    }));
});
