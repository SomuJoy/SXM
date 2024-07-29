import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ObjectTokenizerService {
    tokenize<T>(payload: T): string {
        const isValid = payload && typeof payload === 'object' && Object.entries(payload).length > 0;
        return isValid ? btoa(JSON.stringify(payload)) : '';
    }

    detokenize<T>(payload: string): T | { error: any } {
        try {
            return payload ? JSON.parse(atob(payload)) : null;
        } catch (e) {
            return { error: e };
        }
    }
}
