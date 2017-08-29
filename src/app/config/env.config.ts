import { IConfiguration, environments } from './configuration';
import { browser } from './endpoint.json';

export class Configuration implements IConfiguration {

    public environment: string = environments.browser;
    private baseUrl: string = browser;
    public mockApi = false;
    public OneSignalAppID: string = "d0219f81-9edd-413c-840d-b4f71e659d9c";
    public GoogleProjectNo: string = "735993356118";
    public FacebookAppID: string = "1378368965603493";

    constructor() {
        // append "/" if it's not already appended
        this.baseUrl = this.baseUrl.replace(/\/?(\?|#|$)/, '/$1');
    }
    public get BaseUrl(): string {
        return this.baseUrl;
    }
    public static get Instance() {
        return new Configuration();
    }
}
