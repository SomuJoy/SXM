import { CurrentUTCDayHour } from './state/reducer';
import { isDST } from '@de-care/shared/browser-common/date-time';

export function calculateUTCDayHour(): CurrentUTCDayHour {
    let date = new Date();
    if (!isDST(date)) {
        date = new Date(date.getTime() - 60 * 60 * 1000);
    }
    return { day: date.getUTCDay(), hour: date.getUTCHours() };
}

enum ChoicePlanName {
    'SIR_AUD_CHOICE_CTRY',
    'SIR_AUD_CHOICE_HH',
    'SIR_AUD_CHOICE_POP',
    'SIR_AUD_CHOICE_CLROCK',
    'SIR_AUD_CHOICE_ROCK',
    'SIR_IP_CHOICE_CTRY',
    'SIR_IP_CHOICE_HH',
    'SIR_IP_CHOICE_POP',
    'SIR_IP_CHOICE_CLROCK',
    'SIR_IP_CHOICE_ROCK',
}
export const removeXMPreface = (packageName: string): string => packageName.replace('1_', '');
export const sortChoiceGenre = (a: string, b: string): number => (ChoicePlanName[a] > ChoicePlanName[b] ? 1 : ChoicePlanName[a] < ChoicePlanName[b] ? -1 : 0);

export function isPlatinumVip(packageName: string): boolean {
    return packageName?.endsWith('AUD_VIP');
}
export function isChoice(packageName: string): boolean {
    return packageName?.includes('AUD_CHOICE') || packageName?.includes('IP_CHOICE');
}

export const isPlatinum = (packageName: string): boolean => packageName.match(/^.+_ALLACCESS$/g)?.length > 0;
export const isPlatinumFamilyFriendly = (packageName: string): boolean => (packageName.match(/^.+_ALLACCESS_FF$/g)?.length || 0) > 0;
export const isMusicAndEntertainment = (packageName: string): boolean => (packageName.match(/^.+_EVT$/g)?.length || 0) > 0;
export const isMusicAndEntertainmentFamilyFriendly = (packageName: string): boolean =>
    (packageName.match(/^.+_AUD_FF$/g)?.length || 0) > 0 || (packageName.match(/^.+_DATA.+_FF$/g)?.length || 0) > 0;
export const isMusicShowcase = (packageName: string): boolean => (packageName.match(/^.+_MM$/g)?.length || 0) > 0;
export const isNewsSportsAndTalk = (packageName: string): boolean => (packageName.match(/^.+_NS$/g)?.length || 0) > 0;
