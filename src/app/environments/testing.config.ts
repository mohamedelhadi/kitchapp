﻿import { IConfiguration, Environments } from "./configuration";
import { testing } from "../../_build/json/endpoints.json";

export class Configuration implements IConfiguration {

    Environment: string = Environments.Testing;
    OneSignalAppID: string = "d8f974a9-a14a-49cf-a713-cca37f801505";

    private baseUrl: string = testing;

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