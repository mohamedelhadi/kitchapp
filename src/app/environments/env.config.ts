import { IConfiguration, Environments } from "./configuration";
import { production } from "../../_build/json/endpoints.json";

export class Configuration implements IConfiguration {

    Environment: string = Environments.Production;
    OneSignalAppID: string = "e968fd14-bd05-47a0-8f5e-462485446a4c";
    GoogleProjectNo: string = "773081189088";
    FacebookAppID: string = "1462290493817069";

    private baseUrl: string = production;

    constructor() {
        this.init();
    }

    init(): void {
        this.baseUrl = this.baseUrl.replace(/\/?(\?|#|$)/, "/$1"); // append "/" if it's not already appended
    }

    get BaseUrl(): string {
        return this.baseUrl;
    }

    static get Instance() {
        return new Configuration();
    }
}
