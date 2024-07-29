import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, OnDestroy, Input } from '@angular/core';
import { ChatWithAgentLinkBaseComponent } from '../chat-with-agent-link-base-component';

@Component({
    selector: 'chat-link-liveperson',
    template: `
        <a
            [id]="id"
            [class.inherit-color]="inheritColor"
            *ngIf="showPlaceholderLink"
            href="{{ 'DomainsChatUiChatWithAgentLinkModule.ChatLinkLivepersonComponent.CONTACT_US_URL' | translate }}"
            target="_blank"
            >{{ chatLinkText }}</a
        >
    `,
    styles: [
        `
            :host-context(.chat-text-link) a {
                font-weight: 400;
                text-decoration: none;
                border-bottom: 2px solid currentColor;
            }

            .inherit-color {
                color: inherit;
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
export class ChatLinkLivepersonComponent extends ChatWithAgentLinkBaseComponent implements AfterViewInit, OnDestroy {
    @HostBinding('attr.id') id;
    defaultId = 'general-queue';
    _queueMappings = {
        general: 'general-queue',
        cancelOnline: 'lp_wm_emb_phx_cancel',
        sales: '',
        generalAgents: 'general-queue', // for this provider we are using the same id as the general queue
    };
    observer: MutationObserver;
    showPlaceholderLink = true;
    @Input() inheritColor: boolean = true;

    constructor(private readonly _hostElement: ElementRef, private readonly _changeDetectorRef: ChangeDetectorRef) {
        super();
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
                    const linkElement = this._findInjectedLink(mutationRecord.addedNodes);
                    if (this._linkTextNotUpdated(linkElement)) {
                        this._setInjectedLinkText(linkElement, this.chatLinkText);
                    }
                    this._hideInitialLink();
                }
            }
        });
        this.observer.observe(this._hostElement.nativeElement, { attributes: false, childList: true, subtree: true });
    }

    private _linkTextNotUpdated(linkElement: Node): boolean {
        return linkElement && linkElement.textContent !== this.chatLinkText;
    }

    private _findInjectedLink(addedNodes: any): Node {
        if (addedNodes[0]) {
            try {
                const aTags = addedNodes[0].getElementsByTagName('a');
                if (aTags.length > 0) {
                    return aTags[0];
                }
            } catch {
                return null;
            }
        }
        return null;
    }

    private _setInjectedLinkText(node: Node, text: string) {
        node.textContent = text;
    }

    private _hideInitialLink() {
        this.showPlaceholderLink = false;
        this._changeDetectorRef.markForCheck();
    }
}
