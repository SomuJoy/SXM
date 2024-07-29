import { Component, Inject, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { ChatProvider, ChatProviderToken } from '@de-care/shared/configuration-tokens-chat';
import { Queues } from '../data-services/queues';
import { ChatButtonLivepersonComponent } from '../chat-button-liveperson/chat-button-liveperson.component';
import { ChatButtonTwentyFourSevenComponent } from '../chat-button-twenty-four-seven/chat-button-twenty-four-seven.component';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'chat-with-agent-button',
    template: `
        <ng-container [ngSwitch]="chatProvider">
            <chat-button-liveperson *ngSwitchCase="'liveperson'" [chatLinkText]="chatLinkText" [queue]="queue"></chat-button-liveperson>

            <chat-button-twenty-four-seven
                *ngSwitchCase="'247'"
                [chatLinkText]="chatLinkText"
                [queue]="queue"
                (twentyFourSevenAvailability)="setAvailability($event)"
            ></chat-button-twenty-four-seven>
        </ng-container>
    `,
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, ChatButtonLivepersonComponent, ChatButtonTwentyFourSevenComponent],
})
export class ChatWithAgentButtonComponent {
    @Input() chatLinkText: string;
    @Input() queue: Queues;
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
