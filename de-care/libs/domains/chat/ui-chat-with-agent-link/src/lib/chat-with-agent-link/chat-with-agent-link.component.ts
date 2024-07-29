import { Component, Inject, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { ChatProvider, ChatProviderToken } from '@de-care/shared/configuration-tokens-chat';
import { Queues } from '../data-services/queues';

@Component({
    selector: 'chat-with-agent-link',
    template: `
        <ng-container [ngSwitch]="chatProvider">
            <chat-link-liveperson [inheritColor]="inheritColor" *ngSwitchCase="'liveperson'" [chatLinkText]="chatLinkText" [queue]="queue"></chat-link-liveperson>

            <chat-link-twenty-four-seven
                *ngSwitchCase="'247'"
                [chatLinkText]="chatLinkText"
                [queue]="queue"
                [isInChatLinkStage]="isInChatLinkStage"
                (twentyFourSevenAvailability)="setAvailability($event)"
                [inheritColor]="inheritColor"
            ></chat-link-twenty-four-seven>
        </ng-container>
    `,
    styles: [
        `
            .invalid-feedback chat-with-agent-link a {
                color: inherit;
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class ChatWithAgentLinkComponent {
    @Input() chatLinkText: string;
    @Input() queue: Queues;
    @Input() isInChatLinkStage: boolean = false;
    @Input() inheritColor: boolean = true;
    @Output() isAvailableEvent = new EventEmitter<boolean>();

    constructor(@Inject(ChatProviderToken) public readonly chatProvider: ChatProvider) {
        if (!this.chatProvider) {
            this.chatProvider = '247';
        }
    }

    setAvailability(isAvailable: boolean) {
        this.isAvailableEvent.emit(isAvailable);
    }
}
