export interface IConfiguration {
    mockApi?: boolean;
    environment: string;
    baseUrl: string;

    OneSignalAppID?: string;
    GoogleProjectNo?: string;
    FacebookAppID?: string;
}
export const Environments = {
    browser: 'browser',
    dev: 'dev',
    testing: 'testing',
    staging: 'staging',
    production: 'production'
};
