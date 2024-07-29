import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, OnDestroy, Inject } from '@angular/core';
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
    selector: 'chat-button-liveperson',
    template: `
        <button [id]="id" *ngIf="showPlaceholderButton" target="_blank" class="button primary full-width" (click)="onChatButtonClick()">
            {{ chatLinkText }}
        </button>
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
export class ChatButtonLivepersonComponent extends ChatWithAgentLinkBaseComponent implements AfterViewInit, OnDestroy, ComponentWithLocale {
    @HostBinding('attr.id') id;
    defaultId = 'general-queue';
    _queueMappings = {
        general: 'general-queue',
        cancelOnline: 'lp_wm_emb_phx_cancel',
        sales: '',
        generalAgents: 'general-queue', // for this provider we are using the same id as the general queue
    };
    observer: MutationObserver;
    showPlaceholderButton = true;
    private readonly _window: Window;

    languageResources: LanguageResources;
    translateKeyPrefix: string;

    constructor(
        private readonly _hostElement: ElementRef,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        readonly translationsForComponentService: TranslationsForComponentService,
        @Inject(DOCUMENT) document
    ) {
        super();
        translationsForComponentService.init(this);
        this._window = document && document.defaultView;
    }

    ngAfterViewInit(): void {
        this._initInjectionWatch();
    }

    ngOnDestroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    private _initInjectionWatch() {
        this.observer = new MutationObserver((mutationsList) => {
            for (const mutationRecord of mutationsList) {
                if (mutationRecord.type === 'childList') {
                    const buttonElement = this._findInjectedButton(mutationRecord.addedNodes);
                    if (this._buttonTextNotUpdated(buttonElement)) {
                        this._setInjectedButtonText(buttonElement, this.chatLinkText);
                    }
                    this._hideInitialButton();
                }
            }
        });
        this.observer.observe(this._hostElement.nativeElement, { attributes: false, childList: true, subtree: true });
    }

    private _buttonTextNotUpdated(buttonElement: Node): boolean {
        return buttonElement && buttonElement.textContent !== this.chatLinkText;
    }

    private _findInjectedButton(addedNodes: any): Node {
        if (addedNodes[0]) {
            try {
                const buttonTags = addedNodes[0].getElementsByTagName('button');
                if (buttonTags.length > 0) {
                    return buttonTags[0];
                }
            } catch {
                return null;
            }
        }
        return null;
    }

    private _setInjectedButtonText(node: Node, text: string) {
        node.textContent = text;
    }

    private _hideInitialButton() {
        this.showPlaceholderButton = false;
        this._changeDetectorRef.markForCheck();
    }

    onChatButtonClick() {
        this._window.open(this.translationsForComponentService.instant(`${this.translateKeyPrefix}.CONTACT_US_URL`));
    }
}
