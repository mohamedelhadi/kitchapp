import { IConfiguration, Environments } from './configuration';
import { staging } from './endpoint.json';

export class Configuration implements IConfiguration {

    public environment: string = Environments.staging;
    private envUrl: string = staging;
    public OneSignalAppID: string = "d0219f81-9edd-413c-840d-b4f71e659d9c";
    public GoogleProjectNo: string = "735993356118";
    public FacebookAppID: string = "1378368965603493";

    constructor() {
        // append "/" if it's not already appended
        this.envUrl = this.envUrl.replace(/\/?(\?|#|$)/, '/$1');
    }
    public get baseUrl(): string {
        return this.envUrl;
    }
    public static get instance() {
        return new Configuration();
    }
}
