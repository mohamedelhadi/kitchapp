import { IConfiguration, Environments } from "./configuration";
import { staging } from "../_build/json/endpoints.json";

export class Configuration implements IConfiguration {

    Environment: string = Environments.Staging;
    OneSignalAppID: string = "e2953e25-8c9b-4c39-9de4-75a45bbf7cd7";

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
