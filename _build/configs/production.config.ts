import { IConfiguration, environments } from './configuration';
import { production } from './endpoint.json';

export class Configuration implements IConfiguration {

    public environment: string = environments.production;
    private baseUrl: string = production;
    public OneSignalAppID: string = "e968fd14-bd05-47a0-8f5e-462485446a4c";
    public GoogleProjectNo: string = "773081189088";
    public FacebookAppID: string = "1462290493817069";

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
