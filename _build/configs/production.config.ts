import { IConfiguration, Environments } from './configuration';
import { production } from './endpoint.json';

export class Configuration implements IConfiguration {

    public environment: string = Environments.production;
    private envUrl: string = production;
    public OneSignalAppID: string = "e968fd14-bd05-47a0-8f5e-462485446a4c";
    public GoogleProjectNo: string = "773081189088";
    public FacebookAppID: string = "1462290493817069";

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
