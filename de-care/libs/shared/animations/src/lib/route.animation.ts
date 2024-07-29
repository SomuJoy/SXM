import { transition, trigger, query, style, animate, group } from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
    transition('PurchasePage => UpgradingDevices', [
        group([
            query(':enter', [style({ transform: 'translateY(100%)', opacity: 0 }), animate('1s ease-in-out', style({ transform: 'translateY(0%)', opacity: 1 }))], {
                optional: true
            }),
            query(':leave', [style({ opacity: '1' }), animate('1s ease-in-out', style({ opacity: '0' }))], { optional: true })
        ])
    ]),
    transition('UpgradingDevices => ConfirmationPage', [
        query(
            ':enter, :leave',
            style({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%'
            }),
            { optional: true }
        ),
        group([
            query(':enter header', [style({ transform: 'translateY(-50px)', opacity: 0 }), animate('0.4s 0.3s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))], {
                optional: true
            }),
            query(
                ':enter main, sxm-ui-app-footer',
                [style({ transform: 'translateY(100%)', opacity: 0 }), animate('0.4s 0.3s ease-in-out', style({ transform: 'translateY(0)', opacity: 1 }))],
                { optional: true }
            ),
            query(':leave', [style({ transform: 'translateY(0%)', opacity: '1' }), animate('1s ease-in-out', style({ transform: 'translateY(-20%)', opacity: '0' }))], {
                optional: true
            })
        ])
    ])
]);
