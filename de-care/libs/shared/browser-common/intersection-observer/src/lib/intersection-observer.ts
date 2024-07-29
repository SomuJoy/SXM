import { Observable, Subject } from 'rxjs';

export const fromIntersectionObserver = (element: HTMLElement, config: IntersectionObserverInit) =>
    new Observable<boolean>(subscriber => {
        const subject$ = new Subject<{
            entry: IntersectionObserverEntry;
            observer: IntersectionObserver;
        }>();

        const intersectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (isIntersecting(entry)) {
                    subject$.next({ entry, observer });
                }
            });
        }, config);

        subject$.subscribe(() => {
            subscriber.next(true);
        });

        intersectionObserver.observe(element);

        return {
            unsubscribe() {
                intersectionObserver.disconnect();
                subject$.unsubscribe();
            }
        };
    });

function isIntersecting(entry: IntersectionObserverEntry) {
    return entry.isIntersecting || entry.intersectionRatio > 0;
}
