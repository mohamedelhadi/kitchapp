// Storage
export const RESTAURANTS = "RESTAURANTS";
export const FAVORITE_RESTAURANTS = "FAVORITE_RESTAURANTS";
export const CITIES = "CITIES";
export const CUISINES = "CUISINES";
export const BRANCHES = "BRANCHES";
export const DEALS = "DEALS";
export const USER = "USER";
export const SETTINGS = "SETTINGS";
export const FB_TOKEN = "FB_TOKEN";
export const TOKEN = "TOKEN";
export const EXPIRES_AT = "EXPIRES_AT";

// Language
export enum Language {
    en = 0,
    ar = 1
}
export const DefaultLanguage: Language = Language.en;
export const SupportedLanguages: string[] = []; // contains codes of the supported languages
for (const l in Language) {
    if (Language.hasOwnProperty(l) && /^\d+$/.test(l)) { // discard the string keys of the enum
        SupportedLanguages[l] = Language[l];
    }
}

export enum AuthenticationStatus {
    LoggedIn,
    LoggedOut
}

export enum IonPageEvents {
    ionViewDidLoad,
    ionViewWillEnter,
    ionViewDidEnter,
    ionViewWillLeave,
    ionViewDidLeave,
    ionViewWillUnload,
    ionViewCanEnter,
    ionViewCanLeave
}

export enum LoginProvider {
    Facebook,
    Gmail,
    Microsoft
}