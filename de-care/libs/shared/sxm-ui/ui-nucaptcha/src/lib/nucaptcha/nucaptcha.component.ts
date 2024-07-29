import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import * as uuid from 'uuid/v4';
import { DOCUMENT } from '@angular/common';
import { interval } from 'rxjs';
import { FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NewNucaptchaWorkflowService } from '@de-care/domains/utility/state-nucaptcha';

@Component({
    selector: 'sxm-ui-nucaptcha',
    templateUrl: './nucaptcha.component.html',
    styleUrls: ['./nucaptcha.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiNucaptchaComponent,
            multi: true,
        },
    ],
})
export class SxmUiNucaptchaComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
    readonly translationKeyPart = 'SharedSxmUiUiNucaptchaModule.nucaptchaComponent.';

    @ViewChild('nuCaptchaContainer', { static: true }) nuCaptchaContainer: ElementRef;
    @ViewChild('nuCaptchaImageContainer', { static: true }) nuCaptchaImageContainer: ElementRef;
    @Input() submitted = false;
    @Input() placement = 'Subscription';
    @Input() set captchaAnswerWrong(isWrong) {
        this.answerWasWrong = isWrong;
        if (this.answerWasWrong) {
            this.setupCaptcha();
            this.nucaptchaForm.reset();
        }
    }
    @Output() gotCaptcha = new EventEmitter(); //indicates that a captcha question has been received from the service
    @Output() captchaRendered = new EventEmitter(); //indicates when the captcha challenge has been rendered on screen

    nucaptchaForm: FormGroup;
    captchaId = uuid();
    hasCaptcha = false;
    hideCaptcha = true;
    isAudioCode = false;
    audioDownloadUrl = '';
    checkScriptHasLoadedSubscription;
    captchaImageLoaded;
    answerWasWrong = false;
    onTouched: () => void;

    private readonly _window: Window;

    constructor(
        private _formBuilder: FormBuilder,
        private readonly _newNucaptchaWorkflowService: NewNucaptchaWorkflowService,
        private _renderer: Renderer2,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: Document
    ) {
        this._window = this._document && this._document.defaultView;
    }

    ngOnInit() {
        this.nucaptchaForm = this.buildForm();
    }

    ngAfterViewInit() {
        this.setupCaptcha();
    }

    ngOnDestroy() {
        if (this.checkScriptHasLoadedSubscription) {
            this.checkScriptHasLoadedSubscription.unsubscribe();
        }
        this.captchaImageLoaded?.unsubscribe();
    }

    writeValue(val: any): void {
        val && this.nucaptchaForm.setValue(val, { emitEvent: false });
    }

    registerOnChange(fn: (_: any) => void): void {
        this.nucaptchaForm.valueChanges.subscribe(fn);
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    private buildForm(): FormGroup {
        return this._formBuilder.group({
            answer: this._formBuilder.control('', {
                updateOn: 'blur',
                validators: null,
            }),
        });
    }

    toggleMedia(): void {
        const toggleFunc = this._window['ncCmdToggleAudio'];
        if (toggleFunc) {
            this.isAudioCode = !this.isAudioCode;
            toggleFunc.apply(null, ['']);

            this.getCaptchaToken();

            const ncLabel = this._document.getElementById('directions-verbose-label');
            const ncAnswerInput = this._document.getElementById('nucaptcha-answer');
            if (ncLabel && ncAnswerInput) {
                this._renderer.addClass(ncLabel, 'hide');
                this._renderer.addClass(ncAnswerInput, 'hide');
            }

            if (this.isAudioCode) {
                const origDownloadLink = this._document.getElementById('audio-download');
                this.audioDownloadUrl = origDownloadLink ? origDownloadLink.getAttribute('href') : 'javascript:void(0)';
            }
        }
    }

    replayAudio(): void {
        const audioElement = this._document.getElementById('nucaptcha-media') as HTMLAudioElement;
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
            audioElement.play();
        }
    }

    tryNewCode(): void {
        this.setupCaptcha();
    }

    getNewCaptcha(): void {
        this.setupCaptcha();
        this.nucaptchaForm.reset();
    }

    // Getting the nuCaptcha to work with Angular requires bending some of the rules of Angular like direct DOM manipulation
    private setupCaptcha() {
        this.resetCaptcha();

        this._newNucaptchaWorkflowService.build({ placement: this.placement }).subscribe(
            (captcha) => {
                this.hasCaptcha = true;
                this.nucaptchaForm.controls.answer.setValidators(Validators.required);

                this.gotCaptcha.emit(true);

                // tempElement used to convert result into a parseable form so the scripts can be identified
                const tempElement = this._renderer.createElement('div');
                tempElement.innerHTML = captcha;

                const scripts = tempElement.getElementsByTagName('script');
                const newScriptElements = this.createNewScriptElements(scripts);

                // deleting original script elements
                while (scripts[0]) {
                    scripts[0].parentNode.removeChild(scripts[0]);
                }

                const template = document.getElementById('login-captcha-content');
                if (template) {
                    this.nuCaptchaContainer.nativeElement.innerHTML = tempElement.innerHTML;
                    template.appendChild(this.nuCaptchaContainer.nativeElement);
                    // appending scripts individually so they run
                    for (const script of newScriptElements) {
                        if (template) {
                            template.appendChild(script);
                        }
                    }
                } else {
                    // appending html to template without scripts
                    this.nuCaptchaContainer.nativeElement.innerHTML = tempElement.innerHTML;

                    // appending scripts individually so they run
                    for (const script of newScriptElements) {
                        this._renderer.appendChild(this.nuCaptchaContainer.nativeElement, script);
                    }
                }

                if (template) {
                    this.captchaImageLoaded = interval(500).subscribe((val) => {
                        const nucaptchaMedia = this._document.getElementById('nucaptcha-media');
                        if (nucaptchaMedia) {
                            this.nuCaptchaImageContainer.nativeElement.innerHTML = '';
                            this.nuCaptchaImageContainer.nativeElement.appendChild(nucaptchaMedia);
                            this.captchaImageLoaded.unsubscribe();
                        }
                    });
                }

                // checks to see if captcha elements got added by the scripts yet
                // then hides the default input field and label, sets hideCaptcha to false
                this.checkScriptHasLoadedSubscription = interval(500).subscribe((val) => {
                    if (this.hideCaptcha) {
                        const ncLabel = this._document.getElementById('directions-verbose-label');
                        const ncAnswerInput = this._document.getElementById('nucaptcha-answer');
                        if (ncLabel && ncAnswerInput) {
                            this._renderer.addClass(ncLabel, 'hide');
                            this._renderer.addClass(ncAnswerInput, 'hide');
                            this.hideCaptcha = false;
                            this._changeDetectorRef.markForCheck();
                            this.checkScriptHasLoadedSubscription.unsubscribe();
                            this.captchaRendered.emit();
                        }
                    }
                });

                this.getCaptchaToken();

                this._changeDetectorRef.markForCheck();
            },
            (error) => {
                this.hasCaptcha = false;
                this.gotCaptcha.emit(false);
                this.nucaptchaForm.controls.answer.setValidators(null);
                this.nucaptchaForm.controls.answer.reset();
                this.resetCaptcha();
            }
        );
    }

    private resetCaptcha() {
        this.nuCaptchaContainer.nativeElement.innerHTML = '';
        this.hideCaptcha = true;
        this.isAudioCode = false;
        this._changeDetectorRef.markForCheck();
    }

    private createNewScriptElements(scripts: HTMLCollectionOf<HTMLScriptElement>): HTMLScriptElement[] {
        const newScriptElements = [];
        for (let i = 0; i < scripts.length; i++) {
            const scriptTag = this._renderer.createElement('script');
            scriptTag.innerHTML = scripts[i].innerHTML;
            newScriptElements.push(scriptTag);
        }
        return newScriptElements;
    }

    getCaptchaToken() {
        const captchaTokenElement = this._document.getElementById('nucaptcha-token') as HTMLInputElement;
        return captchaTokenElement ? captchaTokenElement.value : '';
    }
}
