import { IConfiguration, Environments } from "./configuration";
import { dev } from "../../_build/json/endpoints.json";

export class Configuration implements IConfiguration {

    public Environment: string = Environments.Dev;
    public OneSignalAppID: string = "d0219f81-9edd-413c-840d-b4f71e659d9c";
    public GoogleProjectNo: string = "735993356118";
    public FacebookAppID: string = "1378368965603493";

    private baseUrl: string = dev; // "http://10.0.0.172:37864/"; // "http://10.0.2.2:37864/"; //"http://192.168.137.20/bSmart/";

    constructor() {
        this.init();
    }

    public init(): void {
        this.baseUrl = this.baseUrl.replace(/\/?(\?|#|$)/, "/$1"); // append "/" if it's not already appended
    }

    get BaseUrl(): string {
        return this.baseUrl;
    }

    static get Instance() {
        return new Configuration();
    }
}
