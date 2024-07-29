import { Component, ViewChild, ElementRef, Output, EventEmitter, Input, SimpleChanges, OnChanges, OnDestroy, HostListener, AfterViewInit, Inject } from '@angular/core';
import { behaviorEventErrorFromAppCode, behaviorEventImpressionForChatLinkRendered } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { ChatWithAgentLinkBaseComponent } from '../chat-with-agent-link-base-component';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'chat-link-twenty-four-seven',
    template: `
        <a [id]="id" [class.inherit-color]="id === _queueMappings.general && inheritColor" #chatLink>{{ chatLinkText }}</a>
        <a
            [href]="'DomainsChatUiChatWithAgentLinkModule.ChatLinkTwentyFourSevenComponent.CONTACT_US_URL' | translate"
            target="_blank"
            [style.display]="'none'"
            #fallbackChatLink
        ></a>
    `,
    styles: [
        `
            .display-none {
                display: none;
            }

            .inherit-color {
                color: inherit;
            }
            :host-context(.chat-text-link) a {
                font-weight: 400;
                text-decoration: none;
                border-bottom: 2px solid currentColor;
            }

            /* TODO: Using !important everywhere is not a good practice, but it's required here 
            to avoid the property override from outer components. This part should be removed when
            the UI framework used by Angular is in sync with the dot com UI framework */
            :host-context(.chat-underlined-link) a.inherit-color {
                font-weight: 400 !important;
                text-decoration-line: underline;
                text-decoration-thickness: 2px;
                text-underline-offset: 3px;
            }
        `,
    ],
})
export class ChatLinkTwentyFourSevenComponent extends ChatWithAgentLinkBaseComponent implements AfterViewInit, OnChanges, OnDestroy {
    defaultId = 'chat-247-Link-body1';
    _queueMappings = {
        general: 'chat-247-Link-body1', // this is for the BOT
        cancelOnline: 'chat-247-Link-body2',
        sales: '',
        generalAgents: 'chat-247-Link-body3', // this is for actual Agents
    };
    private readonly _window: Window;
    private _providerNotified = false;

    isChatEnabled = false;
    observer: MutationObserver;
    @ViewChild('chatLink') chatLink: ElementRef<HTMLElement>;
    @ViewChild('fallbackChatLink') private _fallbackChatLink: ElementRef<HTMLAnchorElement>;
    @Output() twentyFourSevenAvailability = new EventEmitter<boolean>();
    @Input() isInChatLinkStage = false;
    // TODO: If set to false removes the format color dependency on _queueMappings.general. Should be refactored to handle style dependency
    // on queue in a better way, or check if this dependency is really required.
    @Input() inheritColor = true;
    @HostListener('click') onClick() {
        this._clickFallbackLinkIfTwentyFourSevenLinkNotWiredUp();
    }

    constructor(private readonly _store: Store, @Inject(DOCUMENT) document: Document) {
        super();
        this._window = document?.defaultView;
    }

    ngAfterViewInit(): void {
        // If mutation observer does not detect the activation of the chat service, and chat is not enabled,
        // the activation status needs to be checked when the component view is complete. If chat is inactive
        // after checking, the mutation observer is enabled (only for cancelOnline)
        if (!this.isChatEnabled) {
            if (this.id === this._queueMappings.cancelOnline && this.isInChatLinkStage) {
                if (this._chatLinkHasCssClassAppliedFromTwentyFourSeven()) {
                    this.isChatEnabled = true;
                    this.twentyFourSevenAvailability.emit(true);
                    this._notifyProviderThatLinkIsRendered();
                } else {
                    !this.observer && this.waitFor247AddedAttribute();
                }
            }
        } else {
            this._notifyProviderThatLinkIsRendered();
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

        // TODO: In some scenarios, onChange lifecycle occurs only when the component begins to load, so the chatLink
        // element is not rendered yet to check the chat enabling. This logic has to be reviewed. It depends on the
        // isInChatLinkStage variable being updated after the chat component is loaded, but this is not the case for
        // all scenarios.
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
                        this.isChatEnabled = this._chatLinkHasCssClassAppliedFromTwentyFourSeven();
                        this.twentyFourSevenAvailability.emit(this.isChatEnabled);
                        _observer.disconnect();
                    }
                });
            });

            this.observer.observe(targetNode, config);
        }
    }

    private _chatLinkHasCssClassAppliedFromTwentyFourSeven(): boolean {
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

    private _clickFallbackLinkIfTwentyFourSevenLinkNotWiredUp() {
        if (this.chatLink && this.chatLink.nativeElement && this._chatLinkHasCssClassAppliedFromTwentyFourSeven() === false) {
            if (this._fallbackChatLink && this._fallbackChatLink.nativeElement) {
                this._fallbackChatLink.nativeElement.click();
            }
        }
    }

    private _notifyProviderThatLinkIsRendered(): void {
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
