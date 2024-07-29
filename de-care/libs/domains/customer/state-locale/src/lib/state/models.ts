export interface CustomerLocale {
    province: string;
    provinceSelectionDisabled: boolean;
    provinceSelectionVisible: boolean;
    language: string;
    provinces: ProvinceInfo[];
}

export interface ProvinceInfo {
    label: string;
    key: string;
}
