import { SettingsService } from './settings.service';

export function getChatProviderFromSettingsService(settingsService: SettingsService) {
    return settingsService.settings.chatProvider;
}
