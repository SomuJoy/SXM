import { Component, ViewChild, ElementRef, Output, EventEmitter, SimpleChanges, OnChanges, OnDestroy, HostListener, AfterViewInit, Inject } from '@angular/core';
import { behaviorEventErrorFromAppCode, behaviorEventImpressionForChatLinkRendered } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { ChatWithAgentLinkBaseComponent } from '../chat-with-agent-link-base-component';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { CommonModule, DOCUMENT } from '@angular/common';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    standalone: true,
    selector: 'chat-button-twenty-four-seven',
    template: `
        <button [id]="id" [class.display-none]="!isChatEnabled" #chatButton>{{ chatLinkText }}</button>
        <button target="_blank" [style.display]="'none'" (click)="onFallbackChatButtonClick()" #fallbackChatButton></button>
    `,
    styles: [
        `
            button.primary {
                margin-top: 8px;
            }
        `,
    ],
    imports: [CommonModule],
})
export class ChatButtonTwentyFourSevenComponent extends ChatWithAgentLinkBaseComponent implements AfterViewInit, OnChanges, OnDestroy, ComponentWithLocale {
    defaultId = 'chat-247-Link-body1';
    _queueMappings = {
        general: 'chat-247-Link-body1', // this is for the BOT
        cancelOnline: 'chat-247-Link-body2',
        sales: '',
        generalAgents: 'chat-247-Link-body3', // this is for actual Agents
    };
    private readonly _window: Window;
    private _providerNotified = false;

    languageResources: LanguageResources;
    translateKeyPrefix: string;

    isChatEnabled = false;
    observer: MutationObserver;
    @ViewChild('chatButton') chatLink: ElementRef<HTMLElement>;
    @ViewChild('fallbackChatButton') private _fallbackChatLink: ElementRef<HTMLAnchorElement>;
    @Output() twentyFourSevenAvailability = new EventEmitter<boolean>();
    @HostListener('click') onClick() {
        this._clickFallbackButtonIfTwentyFourSevenButtonNotWiredUp();
    }

    constructor(private readonly _store: Store, @Inject(DOCUMENT) document: Document, readonly translationsForComponentService: TranslationsForComponentService) {
        super();
        this._window = document && document?.defaultView;
        translationsForComponentService.init(this);
    }

    ngAfterViewInit(): void {
        if (this.isChatEnabled) {
            this._notifyProviderThatButtonIsRendered();
        }
    }

    ngOnDestroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes?.queue?.firstChange && changes?.queue?.currentValue !== 'cancelOnline') {
            this.isChatEnabled = true;
        }
        if (changes?.isInChatLinkStage?.currentValue && this.id === this._queueMappings.cancelOnline) {
            // delay so that the anchor link DOM loads before triggering the attaching of the mutation observer
            this._store.dispatch(behaviorEventImpressionForChatLinkRendered());
            this.waitFor247AddedAttribute();
        }
    }

    waitFor247AddedAttribute() {
        // helps observe the anchor tag till 247 adds the 'chat-enabled' class
        // which will be used to make the decision about showing the cancel online button or the enabled chat link
        const targetNode = this.chatLink?.nativeElement;
        const config = { attributes: true, childList: false, subtree: false };

        if (targetNode) {
            this.observer = new MutationObserver((mutationsList, _observer) => {
                Object.keys(mutationsList).forEach((mutationKey) => {
                    const mutation = mutationsList[mutationKey];
                    if (mutation.type === 'attributes') {
                        this.isChatEnabled = this._chatButtonHasCssClassAppliedFromTwentyFourSeven();
                        this.twentyFourSevenAvailability.emit(this.isChatEnabled);
                        _observer.disconnect();
                    }
                });
            });

            this.observer.observe(targetNode, config);
        }
    }

    onFallbackChatButtonClick() {
        this._window.open(this.translationsForComponentService.instant(`${this.translateKeyPrefix}.CONTACT_US_URL`));
    }

    private _chatButtonHasCssClassAppliedFromTwentyFourSeven(): boolean {
        // NOTE: These are volatile to change from 247 :(
        //       Apparently right after the link is clicked the class changes to chat-engage(d)
        //       Sometimes the class chat-engaged gets added, sometimes it's chat-engage without the ending d
        //       So we have to check for any one of these to know that chat is enabled/active
        //       Wish we had a better way to identify chat enabled, like a data- attribute or something that they would provide.
        return (
            this.chatLink.nativeElement.classList.contains('chat-enabled') ||
            this.chatLink.nativeElement.classList.contains('chat-engage') ||
            this.chatLink.nativeElement.classList.contains('chat-engaged')
        );
    }

    private _clickFallbackButtonIfTwentyFourSevenButtonNotWiredUp() {
        if (this.chatLink && this.chatLink.nativeElement && this._chatButtonHasCssClassAppliedFromTwentyFourSeven() === false) {
            if (this._fallbackChatLink && this._fallbackChatLink.nativeElement) {
                this._fallbackChatLink.nativeElement.click();
            }
        }
    }

    private _notifyProviderThatButtonIsRendered(): void {
        if (!this._providerNotified && this._window?.['_satellite']?.['track']) {
            // silently try this so we don't break the app if this code fails
            try {
                this._window['_satellite']['track']('sendChatData');
                this._providerNotified = true;
            } catch {
                this._store.dispatch(behaviorEventErrorFromAppCode({ error: 'Failed to execute 247 chat provider tfsSendDataCallback() after link rendered.' }));
            }
        }
    }
}
