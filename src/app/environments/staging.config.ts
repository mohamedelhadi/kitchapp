import { IConfiguration, Environments } from "./configuration";
import { staging } from "../../_build/json/endpoints.json";

export class Configuration implements IConfiguration {

    Environment: string = Environments.Staging;
    OneSignalAppID: string = "d0219f81-9edd-413c-840d-b4f71e659d9c";
    GoogleProjectNo: string = "735993356118";
    FacebookAppID: string = "1378368965603493";

    private baseUrl: string = staging;

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
