import { IConfiguration, Environments } from './configuration';
import { production } from './endpoint.json';
import { version } from './version.json';

export class Configuration implements IConfiguration {

    private envUrl: string = production;
    public environment: string = Environments.production;
    public version: string = version;
    public oneSignalAppID: string = 'e968fd14-bd05-47a0-8f5e-462485446a4c';
    public googleProjectNo: string = '773081189088';
    public facebookAppID: string = '1462290493817069';

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
