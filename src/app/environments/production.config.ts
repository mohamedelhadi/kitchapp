import { IConfiguration, Environments } from "./configuration";
import { production } from "../../_build/json/endpoints.json";

export class Configuration implements IConfiguration {

    Environment: string = Environments.Production;
    OneSignalAppID: string = "2e4b08ae-8c5a-4da8-8ca2-5ba56ecea4b6";

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
