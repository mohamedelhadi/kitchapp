export interface IConfiguration {
    mockApi?: boolean;
    environment: string;

    OneSignalAppID?: string;
    GoogleProjectNo?: string;
    FacebookAppID?: string;
}
export const environments = {
    browser: 'browser',
    dev: 'dev',
    testing: 'testing',
    staging: 'staging',
    production: 'production'
};
