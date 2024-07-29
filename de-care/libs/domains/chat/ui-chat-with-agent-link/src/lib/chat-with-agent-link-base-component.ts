import { Input, Component } from '@angular/core';
import { Queues } from './data-services/queues';

export interface ChatWithAgentLinkProviderComponent {
    chatLinkText: string;
    queue: Queues;
}

@Component({ template: '' })
export class ChatWithAgentLinkBaseComponent {
    id: string;
    defaultId: string;
    protected _queueMappings: { [queue in Queues]: string };
    @Input() chatLinkText: string;
    @Input() set queue(queue: Queues) {
        const idForQueue = this._queueMappings[queue];
        this.id = idForQueue ? idForQueue : this.defaultId;
    }
}
